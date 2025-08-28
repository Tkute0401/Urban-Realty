const crypto = require('crypto');
const UserSubscription = require('../models/UserSubscription');
const Subscription = require('../models/Subscription');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const { razorpay, validateRazorpayConfig } = require('../config/razorpay');

// @desc    Create Razorpay order for subscription
// @route   POST /api/v1/payments/create-order
// @access  Private
exports.createOrder = asyncHandler(async (req, res, next) => {
  const { subscriptionId, billingCycle } = req.body;
  const userId = req.user.id;

  // Validate Razorpay configuration
  if (!validateRazorpayConfig()) {
    return next(new ErrorResponse('Payment gateway not configured', 500));
  }

  // Get subscription details
  const subscription = await Subscription.findById(subscriptionId);
  if (!subscription) {
    return next(new ErrorResponse('Subscription not found', 404));
  }

  // Check if user already has an active subscription
  const existingSubscription = await UserSubscription.findOne({
    user: userId,
    status: { $in: ['active', 'pending'] }
  });

  if (existingSubscription) {
    return next(new ErrorResponse('You already have an active or pending subscription', 400));
  }

  // Calculate amount based on billing cycle
  let amount = subscription.price;
  if (billingCycle === 'yearly') {
    amount = subscription.price * 12 * 0.8; // 20% discount for yearly
  }

  // Convert to paise (Razorpay expects amount in smallest currency unit)
  const amountInPaise = Math.round(amount * 100);

  // Create Razorpay order
  const orderOptions = {
    amount: amountInPaise,
    currency: 'INR',
    receipt: `sub_${userId}_${Date.now()}`,
    notes: {
      subscriptionId: subscriptionId,
      userId: userId,
      billingCycle: billingCycle,
      subscriptionType: subscription.type
    }
  };

  try {
    const order = await razorpay.orders.create(orderOptions);

    // Create user subscription record
    const startDate = new Date();
    const endDate = new Date();
    if (billingCycle === 'monthly') {
      endDate.setMonth(endDate.getMonth() + 1);
    } else if (billingCycle === 'yearly') {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }

    const userSubscription = await UserSubscription.create({
      user: userId,
      subscription: subscriptionId,
      billingCycle,
      startDate,
      endDate,
      amount,
      currency: 'INR',
      status: 'pending',
      paymentStatus: 'pending',
      razorpayOrderId: order.id,
      paymentGateway: 'razorpay'
    });

    res.status(200).json({
      success: true,
      data: {
        orderId: order.id,
        amount: amountInPaise,
        currency: 'INR',
        subscriptionId: userSubscription._id,
        keyId: process.env.RAZORPAY_KEY_ID
      }
    });
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    return next(new ErrorResponse('Failed to create payment order', 500));
  }
});

// @desc    Verify Razorpay payment and activate subscription
// @route   POST /api/v1/payments/verify
// @access  Private
exports.verifyPayment = asyncHandler(async (req, res, next) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, subscriptionId } = req.body;
  const userId = req.user.id;

  // Validate required fields
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !subscriptionId) {
    return next(new ErrorResponse('Missing payment verification details', 400));
  }

  // Verify payment signature
  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return next(new ErrorResponse('Invalid payment signature', 400));
  }

  // Find and update user subscription
  const userSubscription = await UserSubscription.findOne({
    _id: subscriptionId,
    user: userId,
    razorpayOrderId: razorpay_order_id,
    status: 'pending'
  });

  if (!userSubscription) {
    return next(new ErrorResponse('Subscription not found or already processed', 404));
  }

  // Update subscription status
  userSubscription.status = 'active';
  userSubscription.paymentStatus = 'paid';
  userSubscription.razorpayPaymentId = razorpay_payment_id;
  userSubscription.razorpaySignature = razorpay_signature;
  userSubscription.lastBillingDate = new Date();
  
  // Calculate next billing date
  if (userSubscription.billingCycle === 'monthly') {
    userSubscription.nextBillingDate = new Date(userSubscription.endDate);
  } else if (userSubscription.billingCycle === 'yearly') {
    userSubscription.nextBillingDate = new Date(userSubscription.endDate);
  }

  await userSubscription.save();

  // Update user subscription status
  await User.findByIdAndUpdate(userId, {
    currentSubscription: userSubscription._id,
    subscriptionStatus: userSubscription.subscription.type,
    subscriptionExpiry: userSubscription.endDate
  });

  res.status(200).json({
    success: true,
    message: 'Payment verified successfully. Subscription activated.',
    data: {
      subscriptionId: userSubscription._id,
      status: userSubscription.status,
      endDate: userSubscription.endDate
    }
  });
});

// @desc    Get payment status
// @route   GET /api/v1/payments/status/:subscriptionId
// @access  Private
exports.getPaymentStatus = asyncHandler(async (req, res, next) => {
  const { subscriptionId } = req.params;
  const userId = req.user.id;

  const userSubscription = await UserSubscription.findOne({
    _id: subscriptionId,
    user: userId
  }).populate('subscription');

  if (!userSubscription) {
    return next(new ErrorResponse('Subscription not found', 404));
  }

  res.status(200).json({
    success: true,
    data: {
      status: userSubscription.status,
      paymentStatus: userSubscription.paymentStatus,
      amount: userSubscription.amount,
      currency: userSubscription.currency,
      startDate: userSubscription.startDate,
      endDate: userSubscription.endDate,
      billingCycle: userSubscription.billingCycle,
      subscription: userSubscription.subscription
    }
  });
});

// @desc    Cancel subscription and process refund (if applicable)
// @route   POST /api/v1/payments/cancel/:subscriptionId
// @access  Private
exports.cancelSubscription = asyncHandler(async (req, res, next) => {
  const { subscriptionId } = req.params;
  const userId = req.user.id;

  const userSubscription = await UserSubscription.findOne({
    _id: subscriptionId,
    user: userId,
    status: 'active'
  });

  if (!userSubscription) {
    return next(new ErrorResponse('Active subscription not found', 404));
  }

  // Cancel subscription
  userSubscription.status = 'cancelled';
  userSubscription.autoRenew = false;
  userSubscription.endDate = new Date();
  await userSubscription.save();

  // Update user subscription status
  await User.findByIdAndUpdate(userId, {
    currentSubscription: null,
    subscriptionStatus: 'none',
    subscriptionExpiry: null
  });

  res.status(200).json({
    success: true,
    message: 'Subscription cancelled successfully',
    data: {
      subscriptionId: userSubscription._id,
      status: userSubscription.status,
      endDate: userSubscription.endDate
    }
  });
});

// @desc    Webhook handler for Razorpay events
// @route   POST /api/v1/payments/webhook
// @access  Public (no auth required)
exports.webhookHandler = asyncHandler(async (req, res, next) => {
  const signature = req.headers['x-razorpay-signature'];
  
  if (!signature) {
    return next(new ErrorResponse('Missing signature', 400));
  }

  // Verify webhook signature
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
    .update(JSON.stringify(req.body))
    .digest("hex");

  if (expectedSignature !== signature) {
    return next(new ErrorResponse('Invalid webhook signature', 400));
  }

  const event = req.body;

  try {
    switch (event.event) {
      case 'payment.captured':
        await handlePaymentCaptured(event.payload);
        break;
      case 'payment.failed':
        await handlePaymentFailed(event.payload);
        break;
      case 'subscription.activated':
        await handleSubscriptionActivated(event.payload);
        break;
      case 'subscription.cancelled':
        await handleSubscriptionCancelled(event.payload);
        break;
      default:
        console.log(`Unhandled event: ${event.event}`);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// Helper functions for webhook events
async function handlePaymentCaptured(payload) {
  const payment = payload.payment.entity;
  const order = payload.order.entity;
  
  // Find subscription by order ID and update payment status
  const userSubscription = await UserSubscription.findOne({
    razorpayOrderId: order.id
  });

  if (userSubscription) {
    userSubscription.paymentStatus = 'paid';
    userSubscription.razorpayPaymentId = payment.id;
    await userSubscription.save();
  }
}

async function handlePaymentFailed(payload) {
  const payment = payload.payment.entity;
  const order = payload.order.entity;
  
  // Find subscription by order ID and update payment status
  const userSubscription = await UserSubscription.findOne({
    razorpayOrderId: order.id
  });

  if (userSubscription) {
    userSubscription.paymentStatus = 'failed';
    userSubscription.status = 'inactive';
    await userSubscription.save();
  }
}

async function handleSubscriptionActivated(payload) {
  // Handle subscription activation if using Razorpay subscriptions
  console.log('Subscription activated:', payload);
}

async function handleSubscriptionCancelled(payload) {
  // Handle subscription cancellation if using Razorpay subscriptions
  console.log('Subscription cancelled:', payload);
}