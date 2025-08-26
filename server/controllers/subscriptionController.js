const Subscription = require('../models/Subscription');
const UserSubscription = require('../models/UserSubscription');
const User = require('../models/User');
const Invoice = require('../models/Invoice');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const invoiceService = require('../utils/invoiceService');

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

  let invoice = null;
  let subscriptionChangeType = 'initial';

  // If user has an active/pending subscription, handle plan change
  if (existingSubscription) {
    const isSamePlan = String(existingSubscription.subscription?._id || existingSubscription.subscription) === String(subscriptionId);
    if (isSamePlan) {
      return next(new ErrorResponse('You are already subscribed to this plan', 400));
    }

    // Determine if this is an upgrade or downgrade
    const subscriptionLevels = { free: 0, basic: 1, premium: 2, enterprise: 3 };
    const currentLevel = subscriptionLevels[existingSubscription.subscription.type] || 0;
    const newLevel = subscriptionLevels[subscription.type] || 0;
    
    subscriptionChangeType = newLevel > currentLevel ? 'upgrade' : 'downgrade';

    // Handle subscription change based on type
    if (subscriptionChangeType === 'upgrade') {
      const result = await invoiceService.handleSubscriptionUpgrade(userId, subscriptionId, billingCycle);
      return res.status(201).json({
        success: true,
        data: {
          userSubscription: result.newSubscription,
          invoice: result.invoice,
          prorationCredit: result.prorationCredit,
          finalAmount: result.finalAmount,
          changeType: 'upgrade'
        }
      });
    } else {
      const result = await invoiceService.handleSubscriptionDowngrade(userId, subscriptionId, billingCycle);
      return res.status(201).json({
        success: true,
        data: {
          userSubscription: result.newSubscription,
          invoice: result.invoice,
          effectiveDate: result.effectiveDate,
          changeType: 'downgrade'
        }
      });
    }
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

  // Generate invoice for new subscription
  invoice = await invoiceService.generateInvoice(userSubscription, 'initial');

  // Update user subscription status
  await User.findByIdAndUpdate(userId, {
    currentSubscription: userSubscription._id,
    subscriptionStatus: subscription.type,
    subscriptionExpiry: endDate
  });

  res.status(201).json({
    success: true,
    data: {
      userSubscription,
      invoice,
      changeType: 'initial'
    }
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

// @desc    Get comprehensive billing details
// @route   GET /api/v1/subscriptions/billing-details
// @access  Private
exports.getBillingDetails = asyncHandler(async (req, res, next) => {
  try {
    const billingDetails = await invoiceService.getBillingDetails(req.user.id);
    
    res.status(200).json({
      success: true,
      data: billingDetails
    });
  } catch (error) {
    return next(new ErrorResponse(`Error fetching billing details: ${error.message}`, 500));
  }
});

// @desc    Get specific invoice
// @route   GET /api/v1/subscriptions/invoices/:id
// @access  Private
exports.getInvoice = asyncHandler(async (req, res, next) => {
  const invoice = await Invoice.findById(req.params.id)
    .populate('subscription')
    .populate('userSubscription');

  if (!invoice) {
    return next(new ErrorResponse('Invoice not found', 404));
  }

  // Ensure user can only access their own invoices
  if (invoice.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to access this invoice', 403));
  }

  res.status(200).json({
    success: true,
    data: invoice
  });
});

// @desc    Get all user invoices
// @route   GET /api/v1/subscriptions/invoices
// @access  Private
exports.getUserInvoices = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;

  const invoices = await Invoice.find({ user: req.user.id })
    .populate('subscription')
    .sort({ createdAt: -1 })
    .skip(startIndex)
    .limit(limit);

  const total = await Invoice.countDocuments({ user: req.user.id });

  res.status(200).json({
    success: true,
    count: invoices.length,
    pagination: {
      current: page,
      pages: Math.ceil(total / limit),
      total
    },
    data: invoices
  });
});

// @desc    Mark invoice as paid (for testing/demo purposes)
// @route   PUT /api/v1/subscriptions/invoices/:id/mark-paid
// @access  Private
exports.markInvoiceAsPaid = asyncHandler(async (req, res, next) => {
  const { transactionId } = req.body;
  
  const invoice = await Invoice.findById(req.params.id);
  if (!invoice) {
    return next(new ErrorResponse('Invoice not found', 404));
  }

  // Ensure user can only access their own invoices
  if (invoice.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to access this invoice', 403));
  }

  const updatedInvoice = await invoiceService.markInvoiceAsPaid(invoice._id, transactionId);

  res.status(200).json({
    success: true,
    data: updatedInvoice
  });
});

// @desc    Change subscription plan
// @route   PUT /api/v1/subscriptions/change-plan
// @access  Private
exports.changeSubscriptionPlan = asyncHandler(async (req, res, next) => {
  const { subscriptionId, billingCycle } = req.body;
  const userId = req.user.id;

  // Get current subscription
  const currentSubscription = await UserSubscription.findOne({
    user: userId,
    status: 'active'
  }).populate('subscription');

  if (!currentSubscription) {
    return next(new ErrorResponse('No active subscription found', 404));
  }

  // Get new subscription
  const newSubscription = await Subscription.findById(subscriptionId);
  if (!newSubscription) {
    return next(new ErrorResponse('New subscription not found', 404));
  }

  // Check if it's the same plan
  if (String(currentSubscription.subscription._id) === String(subscriptionId)) {
    return next(new ErrorResponse('You are already subscribed to this plan', 400));
  }

  // Determine if this is an upgrade or downgrade
  const subscriptionLevels = { free: 0, basic: 1, premium: 2, enterprise: 3 };
  const currentLevel = subscriptionLevels[currentSubscription.subscription.type] || 0;
  const newLevel = subscriptionLevels[newSubscription.type] || 0;
  
  let result;
  if (newLevel > currentLevel) {
    // Upgrade
    result = await invoiceService.handleSubscriptionUpgrade(userId, subscriptionId, billingCycle);
  } else {
    // Downgrade
    result = await invoiceService.handleSubscriptionDowngrade(userId, subscriptionId, billingCycle);
  }

  res.status(200).json({
    success: true,
    data: {
      userSubscription: result.newSubscription,
      invoice: result.invoice,
      changeType: newLevel > currentLevel ? 'upgrade' : 'downgrade',
      ...(newLevel > currentLevel ? {
        prorationCredit: result.prorationCredit,
        finalAmount: result.finalAmount
      } : {
        effectiveDate: result.effectiveDate
      })
    }
  });
});