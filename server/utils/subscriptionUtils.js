const User = require('../models/User');
const UserSubscription = require('../models/UserSubscription');
const Subscription = require('../models/Subscription');

/**
 * Get user's current subscription status and details
 * @param {string} userId - User ID
 * @returns {Object} Subscription information
 */
const getUserSubscriptionInfo = async (userId) => {
  try {
    const user = await User.findById(userId).select('subscriptionStatus subscriptionExpiry currentSubscription');
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // Ensure user has subscription status
    if (!user.subscriptionStatus) {
      user.subscriptionStatus = 'free';
      await user.save();
    }
    
    let subscriptionDetails = null;
    let userSubscription = null;
    
    if (user.currentSubscription) {
      userSubscription = await UserSubscription.findById(user.currentSubscription)
        .populate('subscription');
      
      if (userSubscription && userSubscription.subscription) {
        subscriptionDetails = userSubscription.subscription;
      }
    }
    
    // If no active subscription found, get free plan details
    if (!subscriptionDetails) {
      subscriptionDetails = await Subscription.findOne({ type: 'free' });
    }
    
    return {
      status: user.subscriptionStatus,
      expiry: user.subscriptionExpiry,
      currentSubscription: userSubscription,
      subscriptionDetails: subscriptionDetails,
      isActive: userSubscription ? userSubscription.isActive : true,
      daysRemaining: userSubscription ? userSubscription.daysRemaining : 999999
    };
  } catch (error) {
    console.error('Error getting user subscription info:', error);
    // Return default free subscription info
    const freeSubscription = await Subscription.findOne({ type: 'free' });
    return {
      status: 'free',
      expiry: null,
      currentSubscription: null,
      subscriptionDetails: freeSubscription,
      isActive: true,
      daysRemaining: 999999
    };
  }
};

/**
 * Check if user can access a specific feature
 * @param {string} userId - User ID
 * @param {string} feature - Feature name
 * @returns {boolean} Whether user can access the feature
 */
const canAccessFeature = async (userId, feature) => {
  try {
    const user = await User.findById(userId).select('subscriptionStatus');
    
    if (!user) {
      return false;
    }
    
    // Ensure user has subscription status
    if (!user.subscriptionStatus) {
      user.subscriptionStatus = 'free';
      await user.save();
    }
    
    return user.canAccessFeature(feature);
  } catch (error) {
    console.error('Error checking feature access:', error);
    return false;
  }
};

/**
 * Check if user has reached their listing limit
 * @param {string} userId - User ID
 * @returns {Object} Listing limit information
 */
const checkListingLimit = async (userId) => {
  try {
    const user = await User.findById(userId).select('subscriptionStatus');
    
    if (!user) {
      return { canCreate: false, reason: 'User not found' };
    }
    
    // Ensure user has subscription status
    if (!user.subscriptionStatus) {
      user.subscriptionStatus = 'free';
      await user.save();
    }
    
    // Free users cannot create listings
    if (user.subscriptionStatus === 'free') {
      return { 
        canCreate: false, 
        reason: 'Property listings require a paid subscription plan',
        currentPlan: 'free',
        requiredPlan: 'basic'
      };
    }
    
    // Get user's subscription details
    const userSubscription = await UserSubscription.findOne({
      user: userId,
      status: 'active'
    }).populate('subscription');
    
    if (!userSubscription || !userSubscription.subscription) {
      return { 
        canCreate: false, 
        reason: 'No active subscription found',
        currentPlan: user.subscriptionStatus
      };
    }
    
    // Check current listing count
    const Property = require('../models/Property');
    const currentListings = await Property.countDocuments({ 
      user: userId,
      status: { $ne: 'deleted' }
    });
    
    const maxListings = userSubscription.subscription.features.propertyListings;
    
    if (currentListings >= maxListings) {
      return {
        canCreate: false,
        reason: `You have reached your listing limit of ${maxListings} properties`,
        currentListings,
        maxListings,
        currentPlan: user.subscriptionStatus
      };
    }
    
    return {
      canCreate: true,
      currentListings,
      maxListings,
      remaining: maxListings - currentListings,
      currentPlan: user.subscriptionStatus
    };
  } catch (error) {
    console.error('Error checking listing limit:', error);
    return { canCreate: false, reason: 'Error checking listing limit' };
  }
};

/**
 * Upgrade user to a new subscription plan
 * @param {string} userId - User ID
 * @param {string} planType - New plan type
 * @returns {Object} Result of upgrade operation
 */
const upgradeUserPlan = async (userId, planType) => {
  try {
    const user = await User.findById(userId);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // Get the new subscription plan
    const newPlan = await Subscription.findOne({ type: planType, isActive: true });
    
    if (!newPlan) {
      throw new Error(`Subscription plan '${planType}' not found`);
    }
    
    // Update user's subscription status
    user.subscriptionStatus = planType;
    user.subscriptionExpiry = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30); // 30 days from now
    
    await user.save();
    
    return {
      success: true,
      message: `Successfully upgraded to ${planType} plan`,
      newPlan: planType,
      expiry: user.subscriptionExpiry
    };
  } catch (error) {
    console.error('Error upgrading user plan:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Downgrade user to free plan
 * @param {string} userId - User ID
 * @returns {Object} Result of downgrade operation
 */
const downgradeToFree = async (userId) => {
  try {
    const user = await User.findById(userId);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // Update user's subscription status
    user.subscriptionStatus = 'free';
    user.subscriptionExpiry = null;
    user.currentSubscription = null;
    
    await user.save();
    
    // Cancel any active user subscriptions
    await UserSubscription.updateMany(
      { user: userId, status: 'active' },
      { status: 'cancelled' }
    );
    
    return {
      success: true,
      message: 'Successfully downgraded to free plan',
      newPlan: 'free'
    };
  } catch (error) {
    console.error('Error downgrading user plan:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

module.exports = {
  getUserSubscriptionInfo,
  canAccessFeature,
  checkListingLimit,
  upgradeUserPlan,
  downgradeToFree
};