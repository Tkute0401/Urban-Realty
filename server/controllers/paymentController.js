const Subscription = require('../models/Subscription');
const UserSubscription = require('../models/UserSubscription');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const { createRazorpayInstance, verifyRazorpaySignature } = require('../utils/razorpay');

// @desc    Get Razorpay public key
// @route   GET /api/v1/subscriptions/razorpay/key
// @access  Private
exports.getRazorpayKey = asyncHandler(async (req, res) => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    return res.status(500).json({
      success: false,
      message: 'Razorpay is not configured on the server. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.'
    });
  }
  res.status(200).json({ success: true, key: process.env.RAZORPAY_KEY_ID });
});

// @desc    Create Razorpay order for a subscription
// @route   POST /api/v1/subscriptions/razorpay/order
// @access  Private
exports.createRazorpayOrder = asyncHandler(async (req, res, next) => {
  const { subscriptionId, billingCycle } = req.body;
  const userId = req.user.id;

  const subscription = await Subscription.findById(subscriptionId);
  if (!subscription) {
    return next(new ErrorResponse('Subscription not found', 404));
  }

  // Calculate amount
  let amount = subscription.price;
  if (billingCycle === 'yearly') {
    amount = subscription.price * 12 * 0.8; // 20% discount for yearly
  }

  const instance = createRazorpayInstance();
  const order = await instance.orders.create({
    amount: Math.round(amount * 100), // in paise
    currency: 'INR',
    receipt: `sub_${subscriptionId}_${Date.now()}`,
    notes: { userId, subscriptionId, billingCycle }
  });

  // Create pending user subscription linked to order
  const startDate = new Date();
  const endDate = new Date(startDate);
  if (billingCycle === 'monthly') endDate.setMonth(endDate.getMonth() + 1);
  else if (billingCycle === 'yearly') endDate.setFullYear(endDate.getFullYear() + 1);

  const userSubscription = await UserSubscription.create({
    user: userId,
    subscription: subscriptionId,
    billingCycle,
    startDate,
    endDate,
    amount,
    currency: 'INR',
    paymentMethod: 'razorpay',
    status: 'pending',
    paymentStatus: 'pending',
    razorpayOrderId: order.id
  });

  await User.findByIdAndUpdate(userId, {
    currentSubscription: userSubscription._id,
    subscriptionStatus: subscription.type,
    subscriptionExpiry: endDate
  });

  res.status(201).json({ success: true, order, subscription: userSubscription });
});

// @desc    Verify Razorpay payment signature and activate subscription
// @route   POST /api/v1/subscriptions/razorpay/verify
// @access  Private
exports.verifyRazorpayPayment = asyncHandler(async (req, res, next) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return next(new ErrorResponse('Missing Razorpay verification parameters', 400));
  }

  const isValid = verifyRazorpaySignature({
    orderId: razorpay_order_id,
    paymentId: razorpay_payment_id,
    signature: razorpay_signature
  });

  if (!isValid) {
    return next(new ErrorResponse('Invalid payment signature', 400));
  }

  const userSubscription = await UserSubscription.findOne({ razorpayOrderId: razorpay_order_id });
  if (!userSubscription) {
    return next(new ErrorResponse('Subscription record not found for this order', 404));
  }

  userSubscription.razorpayPaymentId = razorpay_payment_id;
  userSubscription.razorpaySignature = razorpay_signature;
  userSubscription.paymentStatus = 'paid';
  userSubscription.status = 'active';
  userSubscription.lastBillingDate = new Date();

  // Align next billing/end date for active period
  const nextBillingDate = new Date(userSubscription.endDate);
  if (userSubscription.billingCycle === 'monthly') nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
  else if (userSubscription.billingCycle === 'yearly') nextBillingDate.setFullYear(nextBillingDate.getFullYear() + 1);
  userSubscription.nextBillingDate = nextBillingDate;

  await userSubscription.save();

  await User.findByIdAndUpdate(userSubscription.user, {
    subscriptionStatus: (await Subscription.findById(userSubscription.subscription)).type,
    subscriptionExpiry: userSubscription.endDate
  });

  res.status(200).json({ success: true, data: userSubscription });
});

