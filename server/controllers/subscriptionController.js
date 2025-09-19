const Subscription = require('../models/Subscription');
const UserSubscription = require('../models/UserSubscription');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// Mock subscription data for fallback
const mockSubscriptions = [
  {
    _id: '1',
    name: 'Free Plan',
    type: 'free',
    description: 'Perfect for getting started with basic features',
    price: 0,
    billingCycle: 'monthly',
    isActive: true,
    features: {
      propertyListings: 5,
      advancedSearch: false,
      prioritySupport: false,
      analytics: false,
      customBranding: false,
      apiAccess: false
    },
    maxUsers: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '2',
    name: 'Basic Plan',
    type: 'basic',
    description: 'Great for small teams and growing businesses',
    price: 29,
    billingCycle: 'monthly',
    isActive: true,
    features: {
      propertyListings: 50,
      advancedSearch: true,
      prioritySupport: false,
      analytics: true,
      customBranding: false,
      apiAccess: false
    },
    maxUsers: 3,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '3',
    name: 'Premium Plan',
    type: 'premium',
    description: 'Advanced features for professional real estate agents',
    price: 99,
    billingCycle: 'monthly',
    isActive: true,
    features: {
      propertyListings: 200,
      advancedSearch: true,
      prioritySupport: true,
      analytics: true,
      customBranding: true,
      apiAccess: true
    },
    maxUsers: 10,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '4',
    name: 'Enterprise Plan',
    type: 'enterprise',
    description: 'Complete solution for large organizations',
    price: 299,
    billingCycle: 'monthly',
    isActive: true,
    features: {
      propertyListings: -1, // Unlimited
      advancedSearch: true,
      prioritySupport: true,
      analytics: true,
      customBranding: true,
      apiAccess: true
    },
    maxUsers: -1, // Unlimited
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// @desc    Get all subscriptions
// @route   GET /api/v1/subscriptions
// @access  Public
exports.getSubscriptions = asyncHandler(async (req, res, next) => {
  const mongoose = require('mongoose');
  
  // Check if MongoDB is connected, if not use mock data immediately
  if (mongoose.connection.readyState !== 1) {
    console.warn('MongoDB not connected, using mock subscription data');
    
    return res.status(200).json({
      success: true,
      count: mockSubscriptions.length,
      data: mockSubscriptions
    });
  }

  try {
    const subscriptions = await Subscription.find({ isActive: true });

    res.status(200).json({
      success: true,
      count: subscriptions.length,
      data: subscriptions
    });
  } catch (error) {
    console.warn('MongoDB query failed, using mock data:', error.message);
    
    res.status(200).json({
      success: true,
      count: mockSubscriptions.length,
      data: mockSubscriptions
    });
  }
});

// @desc    Get single subscription
// @route   GET /api/v1/subscriptions/:id
// @access  Public
exports.getSubscription = asyncHandler(async (req, res, next) => {
  const subscription = await Subscription.findById(req.params.id);

  if (!subscription) {
    // Check if the ID might be a route name that was caught by the parameterized route
    if (req.params.id === 'billing-history') {
      return next(new ErrorResponse('Billing history endpoint requires authentication. Please include your authorization token.', 401));
    }
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
  }).populate('subscription');

  // If user has an active/pending subscription, allow plan change when different
  if (existingSubscription) {
    const isSamePlan = String(existingSubscription.subscription?._id || existingSubscription.subscription) === String(subscriptionId);
    if (isSamePlan) {
      return next(new ErrorResponse('You are already subscribed to this plan', 400));
    }

    // Cancel the existing subscription before creating a new one (plan change)
    existingSubscription.status = 'cancelled';
    existingSubscription.autoRenew = false;
    existingSubscription.endDate = new Date();
    await existingSubscription.save();
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


// @desc    Get user's upcoming billing information
// @route   GET /api/v1/subscriptions/upcoming-billing
// @access  Private
exports.getUpcomingBilling = asyncHandler(async (req, res, next) => {
  try {
    console.log('Upcoming billing request for user:', req.user.id);
    
    // Find active subscription for the user
    const activeSubscription = await UserSubscription.findOne({
      user: req.user.id,
      status: 'active',
      autoRenew: true
    }).populate('subscription');

    if (!activeSubscription) {
      console.log('No active subscription found for user:', req.user.id);
      return res.status(200).json({
        success: true,
        data: null,
        message: 'No active subscription with auto-renewal found'
      });
    }

    // Calculate next billing date if not set
    let nextBillingDate = activeSubscription.nextBillingDate;
    if (!nextBillingDate) {
      nextBillingDate = new Date(activeSubscription.endDate);
      if (activeSubscription.billingCycle === 'monthly') {
        nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
      } else if (activeSubscription.billingCycle === 'yearly') {
        nextBillingDate.setFullYear(nextBillingDate.getFullYear() + 1);
      }
    }

    // Calculate days until next billing
    const today = new Date();
    const daysUntilBilling = Math.ceil((nextBillingDate - today) / (1000 * 60 * 60 * 24));

    const upcomingBilling = {
      subscriptionId: activeSubscription._id,
      subscriptionName: activeSubscription.subscription?.name || 'Subscription',
      subscriptionType: activeSubscription.subscription?.type || 'unknown',
      billingCycle: activeSubscription.billingCycle,
      amount: activeSubscription.amount,
      currency: activeSubscription.currency || 'USD',
      nextBillingDate: nextBillingDate,
      daysUntilBilling: Math.max(0, daysUntilBilling),
      paymentMethod: activeSubscription.paymentMethod,
      autoRenew: activeSubscription.autoRenew,
      currentPeriodStart: activeSubscription.startDate,
      currentPeriodEnd: activeSubscription.endDate
    };

    console.log('Returning upcoming billing info for user:', req.user.id);

    res.status(200).json({
      success: true,
      data: upcomingBilling
    });
  } catch (error) {
    console.error('Error fetching upcoming billing for user:', req.user.id, error);
    return next(new ErrorResponse(`Error fetching upcoming billing: ${error.message}`, 500));
  }
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
  try {
    console.log('Billing history request for user:', req.user.id);
    
    // Get all user subscriptions (active, cancelled, expired)
    const userSubscriptions = await UserSubscription.find({
      user: req.user.id,
      status: { $in: ['active', 'cancelled', 'expired', 'pending'] }
    }).populate('subscription').sort({ createdAt: -1 });

    console.log('Found subscriptions:', userSubscriptions.length);

    if (!userSubscriptions || userSubscriptions.length === 0) {
      console.log('No subscriptions found for user:', req.user.id);
      return res.status(200).json({
        success: true,
        data: [],
        message: 'No billing history found',
        userId: req.user.id
      });
    }

    // Build comprehensive billing history
    const billingHistory = userSubscriptions.map(subscription => {
      const billingEntry = {
        _id: subscription._id,
        date: subscription.startDate,
        description: `${subscription.subscription?.name || 'Subscription'} - ${subscription.billingCycle} subscription`,
        amount: subscription.amount,
        currency: subscription.currency || 'USD',
        status: subscription.paymentStatus || 'pending',
        subscriptionType: subscription.subscription?.type || 'unknown',
        billingCycle: subscription.billingCycle,
        startDate: subscription.startDate,
        endDate: subscription.endDate,
        subscriptionStatus: subscription.status,
        paymentMethod: subscription.paymentMethod
      };

      // Add next billing date if subscription is active
      if (subscription.status === 'active' && subscription.nextBillingDate) {
        billingEntry.nextBillingDate = subscription.nextBillingDate;
      }

      return billingEntry;
    });

    // Add additional billing entries for recurring payments (if any)
    const activeSubscription = userSubscriptions.find(sub => sub.status === 'active');
    if (activeSubscription && activeSubscription.lastBillingDate) {
      // Add the last billing entry
      billingHistory.unshift({
        _id: `billing-${activeSubscription._id}`,
        date: activeSubscription.lastBillingDate,
        description: `${activeSubscription.subscription?.name || 'Subscription'} - ${activeSubscription.billingCycle} renewal`,
        amount: activeSubscription.amount,
        currency: activeSubscription.currency || 'USD',
        status: 'paid',
        subscriptionType: activeSubscription.subscription?.type || 'unknown',
        billingCycle: activeSubscription.billingCycle,
        paymentMethod: activeSubscription.paymentMethod
      });
    }

    console.log('Returning billing history with', billingHistory.length, 'entries');

    res.status(200).json({
      success: true,
      data: billingHistory,
      count: billingHistory.length,
      userId: req.user.id
    });
  } catch (error) {
    console.error('Error fetching billing history for user:', req.user.id, error);
    return next(new ErrorResponse(`Error fetching billing history: ${error.message}`, 500));
  }
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