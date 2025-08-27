const mongoose = require('mongoose');
const Stripe = require('stripe');
const Subscription = require('../models/Subscription');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-06-20'
});

function toStripeAmount(amountInDollars) {
  return Math.round((amountInDollars || 0) * 100);
}

async function ensureProductForPlan(plan) {
  if (plan.stripeProductId) {
    try {
      await stripe.products.retrieve(plan.stripeProductId);
      return plan.stripeProductId;
    } catch (_) {
      // fallthrough to recreate
    }
  }

  const product = await stripe.products.create({
    name: plan.name,
    metadata: {
      subscriptionId: plan._id.toString(),
      type: plan.type
    }
  });
  return product.id;
}

async function findExistingPrice(productId, interval) {
  const prices = await stripe.prices.list({ product: productId, limit: 100, active: true });
  const match = prices.data.find(p => p.recurring && p.recurring.interval === interval);
  return match ? match.id : null;
}

async function ensurePrice(productId, unitAmount, interval) {
  // Try to reuse an existing price for same interval and amount
  const existingId = await findExistingPrice(productId, interval);
  if (existingId) return existingId;

  const price = await stripe.prices.create({
    currency: 'usd',
    unit_amount: unitAmount,
    recurring: { interval },
    product: productId
  });
  return price.id;
}

async function syncStripePrices() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not set');
  }

  const plans = await Subscription.find();
  let updated = 0;

  for (const plan of plans) {
    // Skip free plans for prices; keep product for grouping
    const productId = await ensureProductForPlan(plan);

    let priceMonthlyId = plan.stripePriceIdMonthly;
    let priceYearlyId = plan.stripePriceIdYearly;

    if (plan.price > 0) {
      const monthlyAmount = toStripeAmount(plan.price);
      const yearlyAmount = toStripeAmount(plan.price * 12 * 0.8); // 20% discount yearly

      // Create or reuse prices
      priceMonthlyId = await ensurePrice(productId, monthlyAmount, 'month');
      priceYearlyId = await ensurePrice(productId, yearlyAmount, 'year');
    } else {
      priceMonthlyId = '';
      priceYearlyId = '';
    }

    plan.stripeProductId = productId;
    plan.stripePriceIdMonthly = priceMonthlyId;
    plan.stripePriceIdYearly = priceYearlyId;
    await plan.save();
    updated++;
    console.log(`Synced Stripe for plan '${plan.name}': product=${productId}, monthly=${priceMonthlyId}, yearly=${priceYearlyId}`);
  }

  console.log(`Stripe price sync complete. Updated ${updated} plans.`);
}

module.exports = { syncStripePrices };

// Allow running directly
if (require.main === module) {
  (async () => {
    try {
      const uri = process.env.MONGO_URI || 'mongodb+srv://tanmay:1234@urbanrealty.rbqbb.mongodb.net/?retryWrites=true&w=majority&appName=UrbanRealty';
      await mongoose.connect(uri);
      console.log('MongoDB Connected');
      await syncStripePrices();
      await mongoose.disconnect();
      process.exit(0);
    } catch (err) {
      console.error('Stripe sync error:', err.message);
      process.exit(1);
    }
  })();
}

