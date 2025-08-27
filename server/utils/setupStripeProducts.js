/*
  Automates Stripe product/price creation and populates Subscription docs with IDs.

  Requirements (environment variables):
  - STRIPE_SECRET_KEY
  - MONGO_URI
  Optional:
  - STRIPE_CURRENCY (default: usd)
  - YEARLY_DISCOUNT_PERCENT (default: 20)
*/

const Stripe = require('stripe');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Subscription = require('../models/Subscription');

dotenv.config({ path: process.env.DOTENV_PATH || undefined });

if (!process.env.STRIPE_SECRET_KEY) {
  console.error('❌ STRIPE_SECRET_KEY is not set. Aborting.');
  process.exit(1);
}

if (!process.env.MONGO_URI) {
  console.error('❌ MONGO_URI is not set. Aborting.');
  process.exit(1);
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-06-20' });

const CURRENCY = (process.env.STRIPE_CURRENCY || 'usd').toLowerCase();
const YEARLY_DISCOUNT_PERCENT = Number(process.env.YEARLY_DISCOUNT_PERCENT || 20);

async function connectMongo() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('🗄️  MongoDB Connected');
}

function dollarsToCents(amount) {
  // Expects a Number like 9.99 and returns integer cents for Stripe
  return Math.round(Number(amount) * 100);
}

async function findOrCreateProduct(plan) {
  // Try to find an existing product by metadata.subscriptionType or by name
  const existing = await stripe.products.search({
    query: `name:'${plan.name.replace(/'/g, "\\'")}' AND active:'true'`,
    limit: 1
  }).catch(() => ({ data: [] }));

  if (existing && existing.data && existing.data.length > 0) {
    return existing.data[0];
  }

  return await stripe.products.create({
    name: plan.name,
    active: true,
    metadata: {
      subscriptionType: plan.type,
      subscriptionId: String(plan._id || ''),
    }
  });
}

async function findExistingRecurringPrice(productId, interval, unitAmount) {
  // Search prices for the product with matching interval and amount
  const prices = await stripe.prices.list({ product: productId, active: true, limit: 100 });
  const match = prices.data.find(p => {
    const sameInterval = p.recurring && p.recurring.interval === interval;
    const sameAmount = typeof unitAmount === 'number' ? p.unit_amount === unitAmount : true;
    return sameInterval && sameAmount;
  });
  return match || null;
}

async function ensurePricesForPlan(product, plan) {
  const monthlyAmount = dollarsToCents(plan.price);
  const yearlyAmount = dollarsToCents(plan.price * 12 * (1 - YEARLY_DISCOUNT_PERCENT / 100));

  const monthly = await findExistingRecurringPrice(product.id, 'month', monthlyAmount)
    || await stripe.prices.create({
      product: product.id,
      unit_amount: monthlyAmount,
      currency: CURRENCY,
      recurring: { interval: 'month' },
      metadata: {
        subscriptionType: plan.type,
        billingCycle: 'monthly'
      }
    });

  const yearly = await findExistingRecurringPrice(product.id, 'year', yearlyAmount)
    || await stripe.prices.create({
      product: product.id,
      unit_amount: yearlyAmount,
      currency: CURRENCY,
      recurring: { interval: 'year' },
      metadata: {
        subscriptionType: plan.type,
        billingCycle: 'yearly',
        discountPercent: String(YEARLY_DISCOUNT_PERCENT)
      }
    });

  return { monthly, yearly };
}

async function run() {
  await connectMongo();

  const plans = await Subscription.find({ isActive: true }).sort({ price: 1 });
  if (!plans || plans.length === 0) {
    console.log('ℹ️  No subscriptions found to process.');
    return;
  }

  const results = [];

  for (const plan of plans) {
    if (plan.type === 'free' || plan.price === 0) {
      console.log(`➡️  Skipping free plan: ${plan.name}`);
      continue;
    }

    console.log(`➡️  Ensuring Stripe product/prices for plan: ${plan.name}`);

    const product = await findOrCreateProduct(plan);
    const { monthly, yearly } = await ensurePricesForPlan(product, plan);

    // Persist IDs on the Subscription document
    plan.stripeProductId = product.id;
    plan.stripePriceIdMonthly = monthly.id;
    plan.stripePriceIdYearly = yearly.id;
    await plan.save();

    results.push({
      plan: plan.name,
      productId: product.id,
      monthlyPriceId: monthly.id,
      yearlyPriceId: yearly.id
    });
  }

  if (results.length === 0) {
    console.log('✅ Nothing to update. Free-only or already configured.');
  } else {
    console.table(results);
    console.log('✅ Stripe products and prices ensured. Subscriptions updated.');
  }
}

run()
  .catch((err) => {
    console.error('❌ Setup failed:', err);
    process.exitCode = 1;
  })
  .finally(async () => {
    try { await mongoose.connection.close(); } catch (_) {}
  });

