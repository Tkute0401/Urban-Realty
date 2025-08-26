const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('./async');

/**
 * Middleware to check if user has required subscription level
 * @param {string} requiredPlan - Minimum required subscription plan
 * @param {string} feature - Feature being accessed (for error messages)
 */
const requireSubscription = (requiredPlan, feature = 'this feature') => {
  return asyncHandler(async (req, res, next) => {
    // Get user with subscription status
    const user = await User.findById(req.user.id).select('subscriptionStatus');
    
    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }
    
    // Ensure user has subscriptionStatus (migrate if needed)
    if (!user.subscriptionStatus) {
      // This should rarely happen, but handle it gracefully
      user.subscriptionStatus = 'free';
      await user.save();
    }
    
    // Define subscription hierarchy
    const subscriptionLevels = {
      'free': 0,
      'basic': 1,
      'premium': 2,
      'enterprise': 3
    };
    
    const userLevel = subscriptionLevels[user.subscriptionStatus] || 0;
    const requiredLevel = subscriptionLevels[requiredPlan] || 0;
    
    if (userLevel < requiredLevel) {
      return next(new ErrorResponse(
        `Access denied. ${feature} requires a ${requiredPlan} subscription or higher. Your current plan: ${user.subscriptionStatus}`,
        403
      ));
    }
    
    next();
  });
};

/**
 * Middleware to check if user can access advanced search features
 */
const requireAdvancedSearch = requireSubscription.bind(null, 'basic', 'Advanced search features');

/**
 * Middleware to check if user can access analytics
 */
const requireAnalytics = requireSubscription.bind(null, 'premium', 'Analytics and insights');

/**
 * Middleware to check if user can access custom branding
 */
const requireCustomBranding = requireSubscription.bind(null, 'enterprise', 'Custom branding options');

/**
 * Middleware to check if user can access API
 */
const requireApiAccess = requireSubscription.bind(null, 'enterprise', 'API access');

/**
 * Middleware to check if user can create property listings
 * @param {number} maxListings - Maximum number of listings allowed
 */
const checkListingLimit = (maxListings) => {
  return asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('subscriptionStatus');
    
    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }
    
    // Get user's current subscription to check listing limits
    const UserSubscription = require('../models/UserSubscription');
    const userSub = await UserSubscription.findOne({
      user: req.user.id,
      status: 'active'
    }).populate('subscription');
    
    if (!userSub || !userSub.subscription) {
      // User is on free plan
      if (maxListings > 0) {
        return next(new ErrorResponse(
          'Access denied. Property listings require a paid subscription plan.',
          403
        ));
      }
      return next();
    }
    
    // Check if user has reached their listing limit
    const Property = require('../models/Property');
    const currentListings = await Property.countDocuments({ 
      user: req.user.id,
      status: { $ne: 'deleted' }
    });
    
    if (currentListings >= userSub.subscription.features.propertyListings) {
      return next(new ErrorResponse(
        `You have reached your listing limit of ${userSub.subscription.features.propertyListings} properties. Please upgrade your plan to add more listings.`,
        403
      ));
    }
    
    next();
  });
};

/**
 * Middleware to check if user can access priority support
 */
const requirePrioritySupport = requireSubscription.bind(null, 'premium', 'Priority customer support');

module.exports = {
  requireSubscription,
  requireAdvancedSearch,
  requireAnalytics,
  requireCustomBranding,
  requireApiAccess,
  checkListingLimit,
  requirePrioritySupport
};