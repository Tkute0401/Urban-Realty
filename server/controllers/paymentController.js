const Stripe = require('stripe');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const Subscription = require('../models/Subscription');
const UserSubscription = require('../models/UserSubscription');
const User = require('../models/User');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-06-20'
});

// Create Stripe Checkout Session for a subscription
exports.createCheckoutSession = asyncHandler(async (req, res, next) => {
  const { subscriptionId, billingCycle } = req.body;
  const userId = req.user.id;

  const plan = await Subscription.findById(subscriptionId);
  if (!plan) return next(new ErrorResponse('Subscription plan not found', 404));

  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_PUBLISHABLE_KEY) {
    return next(new ErrorResponse('Stripe keys are not configured', 500));
  }

  const priceId = billingCycle === 'yearly' ? plan.stripePriceIdYearly : plan.stripePriceIdMonthly;
  if (!priceId) return next(new ErrorResponse('Stripe price not configured for this plan', 400));

  // Ensure Stripe customer
  const user = await User.findById(userId);
  let customerId = user.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.name,
      metadata: { userId: user._id.toString() }
    });
    customerId = customer.id;
    user.stripeCustomerId = customerId;
    await user.save();
  }

  // Create Checkout Session
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    customer: customerId,
    line_items: [
      { price: priceId, quantity: 1 }
    ],
    success_url: `${process.env.FRONTEND_URL}/billing-dashboard?success=true`,
    cancel_url: `${process.env.FRONTEND_URL}/subscriptions?canceled=true`,
    metadata: {
      userId: userId,
      subscriptionId: plan._id.toString(),
      billingCycle
    }
  });

  // Create a pending record (optional, can be created after webhook)
  const startDate = new Date();
  const endDate = new Date(startDate);
  if (billingCycle === 'yearly') endDate.setFullYear(endDate.getFullYear() + 1); else endDate.setMonth(endDate.getMonth() + 1);

  const pending = await UserSubscription.create({
    user: userId,
    subscription: plan._id,
    billingCycle,
    startDate,
    endDate,
    amount: plan.price * (billingCycle === 'yearly' ? 12 * 0.8 : 1),
    paymentMethod: 'stripe',
    status: 'pending',
    paymentStatus: 'pending',
    stripeCustomerId: customerId,
    stripeCheckoutSessionId: session.id
  });

  res.status(200).json({ success: true, data: { id: session.id, url: session.url } });
});

// Create Stripe customer portal session
exports.createPortalSession = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user || !user.stripeCustomerId) return next(new ErrorResponse('Stripe customer not found', 404));

  const portal = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${process.env.FRONTEND_URL}/billing-dashboard`
  });

  res.status(200).json({ success: true, data: { url: portal.url } });
});

// Stripe webhook handler
exports.webhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed.', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const { userId, subscriptionId, billingCycle } = session.metadata || {};
        const stripeSubscriptionId = session.subscription;
        const customerId = session.customer;

        const pending = await UserSubscription.findOne({ stripeCheckoutSessionId: session.id });
        if (pending) {
          pending.status = 'active';
          pending.paymentStatus = 'paid';
          pending.lastBillingDate = new Date();
          pending.stripeSubscriptionId = stripeSubscriptionId;
          await pending.save();

          await User.findByIdAndUpdate(pending.user, {
            currentSubscription: pending._id,
            subscriptionStatus: (await Subscription.findById(pending.subscription)).type,
            subscriptionExpiry: pending.endDate,
            stripeCustomerId: customerId
          });
        }
        break;
      }
      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        const subscriptionId = invoice.subscription;
        await UserSubscription.findOneAndUpdate(
          { stripeSubscriptionId: subscriptionId },
          { paymentStatus: 'failed' }
        );
        break;
      }
      case 'customer.subscription.deleted': {
        const sub = event.data.object;
        await UserSubscription.findOneAndUpdate(
          { stripeSubscriptionId: sub.id },
          { status: 'cancelled', autoRenew: false }
        );
        break;
      }
      default:
        break;
    }
  } catch (e) {
    console.error('Error handling webhook event', e);
  }

  res.json({ received: true });
};

