const Subscription = require('../models/Subscription');
const UserSubscription = require('../models/UserSubscription');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get all subscriptions
// @route   GET /api/v1/subscriptions
// @access  Public
exports.getSubscriptions = asyncHandler(async (req, res, next) => {
  const subscriptions = await Subscription.find({ isActive: true });

  res.status(200).json({
    success: true,
    count: subscriptions.length,
    data: subscriptions
  });
});

// @desc    Get single subscription
// @route   GET /api/v1/subscriptions/:id
// @access  Public
exports.getSubscription = asyncHandler(async (req, res, next) => {
  const subscription = await Subscription.findById(req.params.id);

  if (!subscription) {
    return next(new ErrorResponse(`Subscription not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: subscription
  });
});

// @desc    Create new subscription
// @route   POST /api/v1/subscriptions
// @access  Private (Admin only)
exports.createSubscription = asyncHandler(async (req, res, next) => {
  const subscription = await Subscription.create(req.body);

  res.status(201).json({
    success: true,
    data: subscription
  });
});

// @desc    Update subscription
// @route   PUT /api/v1/subscriptions/:id
// @access  Private (Admin only)
exports.updateSubscription = asyncHandler(async (req, res, next) => {
  let subscription = await Subscription.findById(req.params.id);

  if (!subscription) {
    return next(new ErrorResponse(`Subscription not found with id of ${req.params.id}`, 404));
  }

  subscription = await Subscription.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: subscription
  });
});

// @desc    Delete subscription
// @route   DELETE /api/v1/subscriptions/:id
// @access  Private (Admin only)
exports.deleteSubscription = asyncHandler(async (req, res, next) => {
  const subscription = await Subscription.findById(req.params.id);

  if (!subscription) {
    return next(new ErrorResponse(`Subscription not found with id of ${req.params.id}`, 404));
  }

  await subscription.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Subscribe user to a plan
// @route   POST /api/v1/subscriptions/subscribe
// @access  Private
exports.subscribeUser = asyncHandler(async (req, res, next) => {
  const { subscriptionId, billingCycle, paymentMethod } = req.body;
  const userId = req.user.id;

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
    return next(new ErrorResponse('User already has an active subscription', 400));
  }

  // Calculate end date based on billing cycle
  const startDate = new Date();
  const endDate = new Date();
  if (billingCycle === 'monthly') {
    endDate.setMonth(endDate.getMonth() + 1);
  } else if (billingCycle === 'yearly') {
    endDate.setFullYear(endDate.getFullYear() + 1);
  }

  // Calculate amount based on billing cycle
  let amount = subscription.price;
  if (billingCycle === 'yearly') {
    amount = subscription.price * 12 * 0.8; // 20% discount for yearly
  }

  // Create user subscription
  const userSubscription = await UserSubscription.create({
    user: userId,
    subscription: subscriptionId,
    billingCycle,
    startDate,
    endDate,
    amount,
    paymentMethod,
    status: 'pending'
  });

  // Update user subscription status
  await User.findByIdAndUpdate(userId, {
    currentSubscription: userSubscription._id,
    subscriptionStatus: subscription.type,
    subscriptionExpiry: endDate
  });

  res.status(201).json({
    success: true,
    data: userSubscription
  });
});

// @desc    Get user's current subscription
// @route   GET /api/v1/subscriptions/my-subscription
// @access  Private
exports.getMySubscription = asyncHandler(async (req, res, next) => {
  const { getUserSubscriptionInfo } = require('../utils/subscriptionUtils');
  
  try {
    const subscriptionInfo = await getUserSubscriptionInfo(req.user.id);
    
    res.status(200).json({
      success: true,
      data: subscriptionInfo
    });
  } catch (error) {
    return next(new ErrorResponse('Error fetching subscription information', 500));
  }
});

// @desc    Cancel user subscription
// @route   PUT /api/v1/subscriptions/cancel
// @access  Private
exports.cancelSubscription = asyncHandler(async (req, res, next) => {
  const userSubscription = await UserSubscription.findOne({
    user: req.user.id,
    status: 'active'
  });

  if (!userSubscription) {
    return next(new ErrorResponse('No active subscription found', 404));
  }

  userSubscription.status = 'cancelled';
  userSubscription.autoRenew = false;
  await userSubscription.save();

  // Update user subscription status
  await User.findByIdAndUpdate(req.user.id, {
    subscriptionStatus: 'free',
    subscriptionExpiry: null
  });

  res.status(200).json({
    success: true,
    data: userSubscription
  });
});

// @desc    Update subscription payment status
// @route   PUT /api/v1/subscriptions/:id/payment-status
// @access  Private (Admin only)
exports.updatePaymentStatus = asyncHandler(async (req, res, next) => {
  const { paymentStatus } = req.body;
  const userSubscription = await UserSubscription.findById(req.params.id);

  if (!userSubscription) {
    return next(new ErrorResponse('User subscription not found', 404));
  }

  userSubscription.paymentStatus = paymentStatus;
  
  // If payment is successful, activate subscription
  if (paymentStatus === 'paid') {
    userSubscription.status = 'active';
    userSubscription.lastBillingDate = new Date();
    
    // Calculate next billing date
    const nextBillingDate = new Date(userSubscription.endDate);
    if (userSubscription.billingCycle === 'monthly') {
      nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
    } else if (userSubscription.billingCycle === 'yearly') {
      nextBillingDate.setFullYear(nextBillingDate.getFullYear() + 1);
    }
    userSubscription.nextBillingDate = nextBillingDate;
  }

  await userSubscription.save();

  res.status(200).json({
    success: true,
    data: userSubscription
  });
});

// @desc    Check if user can access a specific feature
// @route   GET /api/v1/subscriptions/check-feature/:feature
// @access  Private
exports.checkFeatureAccess = asyncHandler(async (req, res, next) => {
  const { canAccessFeature } = require('../utils/subscriptionUtils');
  const { feature } = req.params;
  
  try {
    const hasAccess = await canAccessFeature(req.user.id, feature);
    
    res.status(200).json({
      success: true,
      data: {
        feature,
        hasAccess,
        message: hasAccess ? 'Access granted' : 'Access denied'
      }
    });
  } catch (error) {
    return next(new ErrorResponse('Error checking feature access', 500));
  }
});

// @desc    Check user's listing limit
// @route   GET /api/v1/subscriptions/listing-limit
// @access  Private
exports.checkListingLimit = asyncHandler(async (req, res, next) => {
  const { checkListingLimit } = require('../utils/subscriptionUtils');
  
  try {
    const limitInfo = await checkListingLimit(req.user.id);
    
    res.status(200).json({
      success: true,
      data: limitInfo
    });
  } catch (error) {
    return next(new ErrorResponse('Error checking listing limit', 500));
  }
});

// @desc    Get user's billing history
// @route   GET /api/v1/subscriptions/billing-history
// @access  Private
exports.getBillingHistory = asyncHandler(async (req, res, next) => {
  const userSubscription = await UserSubscription.findOne({
    user: req.user.id,
    status: { $in: ['active', 'cancelled', 'expired'] }
  }).populate('subscription');

  if (!userSubscription) {
    return res.status(200).json({
      success: true,
      data: []
    });
  }

  // Mock billing history for now - in production, this would come from a billing system
  const billingHistory = [
    {
      _id: '1',
      date: userSubscription.startDate,
      description: `${userSubscription.subscription.name} - ${userSubscription.billingCycle} subscription`,
      amount: userSubscription.amount,
      currency: userSubscription.currency,
      status: userSubscription.paymentStatus
    }
  ];

  res.status(200).json({
    success: true,
    data: billingHistory
  });
});

// @desc    Update user's payment method
// @route   PUT /api/v1/subscriptions/payment-method
// @access  Private
exports.updatePaymentMethod = asyncHandler(async (req, res, next) => {
  const { paymentMethod, cardNumber, expiryDate, cvv } = req.body;
  
  const userSubscription = await UserSubscription.findOne({
    user: req.user.id,
    status: 'active'
  });

  if (!userSubscription) {
    return next(new ErrorResponse('No active subscription found', 404));
  }

  // Update payment method (in production, this would integrate with payment processor)
  userSubscription.paymentMethod = paymentMethod;
  await userSubscription.save();

  res.status(200).json({
    success: true,
    data: {
      message: 'Payment method updated successfully',
      paymentMethod
    }
  });
});