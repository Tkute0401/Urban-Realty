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

/**
 * Middleware to check if user can access developer features
 */
const requireDeveloperAccess = requireSubscription.bind(null, 'premium', 'Developer features');

/**
 * Middleware to check if user can access professional services
 */
const requireProfessionalServices = requireSubscription.bind(null, 'basic', 'Professional services');

/**
 * Middleware to check if user can access contact features
 */
const requireContactAccess = requireSubscription.bind(null, 'basic', 'Contact features');

/**
 * Middleware to check if user can access media upload features
 */
const requireMediaAccess = requireSubscription.bind(null, 'basic', 'Media upload features');

/**
 * Middleware to check if user can access admin features
 */
const requireAdminAccess = requireSubscription.bind(null, 'enterprise', 'Admin features');

/**
 * Middleware to check if user can access property management features
 */
const requirePropertyManagement = requireSubscription.bind(null, 'basic', 'Property management features');

/**
 * Middleware to check if user can access user profile features
 */
const requireProfileAccess = requireSubscription.bind(null, 'basic', 'Profile management features');

/**
 * Middleware to check if user can access advanced property features
 */
const requireAdvancedPropertyFeatures = requireSubscription.bind(null, 'premium', 'Advanced property features');

/**
 * Middleware to check if user can access bulk operations
 */
const requireBulkOperations = requireSubscription.bind(null, 'enterprise', 'Bulk operations');

/**
 * Middleware to check if user can access export features
 */
const requireExportAccess = requireSubscription.bind(null, 'premium', 'Export features');

/**
 * Middleware to check if user can access import features
 */
const requireImportAccess = requireSubscription.bind(null, 'enterprise', 'Import features');

/**
 * Middleware to check if user can access reporting features
 */
const requireReportingAccess = requireSubscription.bind(null, 'premium', 'Reporting features');

/**
 * Middleware to check if user can access customization features
 */
const requireCustomizationAccess = requireSubscription.bind(null, 'enterprise', 'Customization features');

/**
 * Middleware to check if user can access integration features
 */
const requireIntegrationAccess = requireSubscription.bind(null, 'enterprise', 'Integration features');

/**
 * Middleware to check if user can access white-label features
 */
const requireWhiteLabelAccess = requireSubscription.bind(null, 'enterprise', 'White-label features');

/**
 * Middleware to check if user can access multi-user features
 */
const requireMultiUserAccess = requireSubscription.bind(null, 'enterprise', 'Multi-user features');

/**
 * Middleware to check if user can access lead management features
 */
const requireLeadManagement = requireSubscription.bind(null, 'basic', 'Lead management features');

/**
 * Middleware to check if user can access CRM features
 */
const requireCRM = requireSubscription.bind(null, 'premium', 'CRM features');

/**
 * Middleware to check if user can access team management features
 */
const requireTeamManagement = requireSubscription.bind(null, 'enterprise', 'Team management features');

/**
 * Middleware to check if user can access property promotion features
 */
const requirePropertyPromotion = requireSubscription.bind(null, 'premium', 'Property promotion features');

/**
 * Middleware to check if user can access featured property features
 */
const requireFeaturedProperty = requireSubscription.bind(null, 'premium', 'Featured property features');

/**
 * Middleware to check if user can access priority listing features
 */
const requirePriorityListing = requireSubscription.bind(null, 'premium', 'Priority listing features');

/**
 * Middleware to check if user can access favorites features
 */
const requireFavoritesAccess = requireSubscription.bind(null, 'basic', 'Favorites and saved searches');

/**
 * Middleware to check if user can access recently viewed features
 */
const requireRecentlyViewedAccess = requireSubscription.bind(null, 'basic', 'Recently viewed properties');

/**
 * Middleware to check if user can access property alerts
 */
const requirePropertyAlerts = requireSubscription.bind(null, 'basic', 'Property alerts');

/**
 * Middleware to check if user can access market insights
 */
const requireMarketInsights = requireSubscription.bind(null, 'premium', 'Market insights');

/**
 * Middleware to check if user can access investment analysis
 */
const requireInvestmentAnalysis = requireSubscription.bind(null, 'premium', 'Investment analysis');

/**
 * Middleware to check if user can access document management
 */
const requireDocumentManagement = requireSubscription.bind(null, 'premium', 'Document management');

/**
 * Middleware to check if user can access commission tracking
 */
const requireCommissionTracking = requireSubscription.bind(null, 'premium', 'Commission tracking');

/**
 * Middleware to check if user can access performance analytics
 */
const requirePerformanceAnalytics = requireSubscription.bind(null, 'premium', 'Performance analytics');

/**
 * Middleware to check if user can access marketing tools
 */
const requireMarketingTools = requireSubscription.bind(null, 'premium', 'Marketing tools');

/**
 * Middleware to check if user can access virtual tour features
 */
const requireVirtualTourFeatures = requireSubscription.bind(null, 'premium', 'Virtual tour features');

/**
 * Middleware to check if user can access professional photography
 */
const requireProfessionalPhotography = requireSubscription.bind(null, 'premium', 'Professional photography');

/**
 * Middleware to check if user can access staging services
 */
const requireStagingServices = requireSubscription.bind(null, 'premium', 'Staging services');

/**
 * Middleware to check if user can access home inspection services
 */
const requireHomeInspectionServices = requireSubscription.bind(null, 'premium', 'Home inspection services');

/**
 * Middleware to check if user can access legal services
 */
const requireLegalServices = requireSubscription.bind(null, 'premium', 'Legal services');

/**
 * Middleware to check if user can access insurance services
 */
const requireInsuranceServices = requireSubscription.bind(null, 'premium', 'Insurance services');

/**
 * Middleware to check if user can access financing services
 */
const requireFinancingServices = requireSubscription.bind(null, 'premium', 'Financing services');

/**
 * Middleware to check if user can access security services
 */
const requireSecurityServices = requireSubscription.bind(null, 'premium', 'Security services');

/**
 * Middleware to check if user can access smart home features
 */
const requireSmartHomeFeatures = requireSubscription.bind(null, 'premium', 'Smart home features');

/**
 * Middleware to check if user can access energy efficiency tools
 */
const requireEnergyEfficiencyTools = requireSubscription.bind(null, 'premium', 'Energy efficiency tools');

/**
 * Middleware to check if user can access sustainability features
 */
const requireSustainabilityFeatures = requireSubscription.bind(null, 'premium', 'Sustainability features');

/**
 * Middleware to check if user can access crime statistics
 */
const requireCrimeStatistics = requireSubscription.bind(null, 'premium', 'Crime statistics');

/**
 * Middleware to check if user can access air quality data
 */
const requireAirQualityData = requireSubscription.bind(null, 'premium', 'Air quality data');

/**
 * Middleware to check if user can access flood risk data
 */
const requireFloodRiskData = requireSubscription.bind(null, 'premium', 'Flood risk data');

/**
 * Middleware to check if user can access earthquake risk data
 */
const requireEarthquakeRiskData = requireSubscription.bind(null, 'premium', 'Earthquake risk data');

/**
 * Middleware to check if user can access tax information
 */
const requireTaxInformation = requireSubscription.bind(null, 'premium', 'Tax information');

/**
 * Middleware to check if user can access permit information
 */
const requirePermitInformation = requireSubscription.bind(null, 'premium', 'Permit information');

/**
 * Middleware to check if user can access zoning information
 */
const requireZoningInformation = requireSubscription.bind(null, 'premium', 'Zoning information');

/**
 * Middleware to check if user can access development plans
 */
const requireDevelopmentPlans = requireSubscription.bind(null, 'premium', 'Development plans');

/**
 * Middleware to check if user can access market trends
 */
const requireMarketTrends = requireSubscription.bind(null, 'premium', 'Market trends');

/**
 * Middleware to check if user can access investment opportunities
 */
const requireInvestmentOpportunities = requireSubscription.bind(null, 'premium', 'Investment opportunities');

/**
 * Middleware to check if user can access rental yield analysis
 */
const requireRentalYieldAnalysis = requireSubscription.bind(null, 'premium', 'Rental yield analysis');

/**
 * Middleware to check if user can access ROI calculations
 */
const requireROICalculations = requireSubscription.bind(null, 'premium', 'ROI calculations');

/**
 * Middleware to check if user can access cash flow analysis
 */
const requireCashFlowAnalysis = requireSubscription.bind(null, 'premium', 'Cash flow analysis');

/**
 * Middleware to check if user can access advanced cost estimators
 */
const requireAdvancedCostEstimators = requireSubscription.bind(null, 'premium', 'Advanced cost estimators');

/**
 * Middleware to check if user can access custom branding
 */
const requireCustomBrandingAccess = requireSubscription.bind(null, 'enterprise', 'Custom branding');

/**
 * Middleware to check if user can access API access
 */
const requireApiAccessControl = requireSubscription.bind(null, 'enterprise', 'API access');

/**
 * Middleware to check if user can access multi-user support
 */
const requireMultiUserSupport = requireSubscription.bind(null, 'enterprise', 'Multi-user support');

/**
 * Middleware to check if user can access advanced analytics
 */
const requireAdvancedAnalytics = requireSubscription.bind(null, 'enterprise', 'Advanced analytics');

/**
 * Middleware to check if user can access white-label features
 */
const requireWhiteLabelFeatures = requireSubscription.bind(null, 'enterprise', 'White-label features');

/**
 * Middleware to check if user can access integration features
 */
const requireIntegrationFeatures = requireSubscription.bind(null, 'enterprise', 'Integration features');

/**
 * Middleware to check if user can access workflow automation
 */
const requireWorkflowAutomation = requireSubscription.bind(null, 'enterprise', 'Workflow automation');

/**
 * Middleware to check if user can access customer relationship management
 */
const requireCustomerRelationshipManagement = requireSubscription.bind(null, 'enterprise', 'Customer relationship management');

/**
 * Middleware to check if user can access SMS marketing
 */
const requireSMSMarketing = requireSubscription.bind(null, 'enterprise', 'SMS marketing');

/**
 * Middleware to check if user can access 3D property visualization
 */
const require3DPropertyVisualization = requireSubscription.bind(null, 'enterprise', '3D property visualization');

/**
 * Middleware to check if user can access e-signature features
 */
const requireESignatureFeatures = requireSubscription.bind(null, 'enterprise', 'E-signature features');

/**
 * Middleware to check if user can access transaction management
 */
const requireTransactionManagement = requireSubscription.bind(null, 'enterprise', 'Transaction management');

/**
 * Middleware to check if user can access team management
 */
const requireTeamManagementAccess = requireSubscription.bind(null, 'enterprise', 'Team management');

/**
 * Middleware to check if user can access bulk operations
 */
const requireBulkOperationsAccess = requireSubscription.bind(null, 'enterprise', 'Bulk operations');

/**
 * Middleware to check if user can access import features
 */
const requireImportFeatures = requireSubscription.bind(null, 'enterprise', 'Import features');

/**
 * Middleware to check if user can access price predictions
 */
const requirePricePredictions = requireSubscription.bind(null, 'enterprise', 'Price predictions');

module.exports = {
  requireSubscription,
  requireAdvancedSearch,
  requireAnalytics,
  requireCustomBranding,
  requireApiAccess,
  checkListingLimit,
  requirePrioritySupport,
  requireDeveloperAccess,
  requireProfessionalServices,
  requireContactAccess,
  requireMediaAccess,
  requireAdminAccess,
  requirePropertyManagement,
  requireProfileAccess,
  requireAdvancedPropertyFeatures,
  requireBulkOperations,
  requireExportAccess,
  requireImportAccess,
  requireReportingAccess,
  requireCustomizationAccess,
  requireIntegrationAccess,
  requireWhiteLabelAccess,
  requireMultiUserAccess,
  requireLeadManagement,
  requireCRM,
  requireTeamManagement,
  requirePropertyPromotion,
  requireFeaturedProperty,
  requirePriorityListing,
  requireFavoritesAccess,
  requireRecentlyViewedAccess,
  requirePropertyAlerts,
  requireMarketInsights,
  requireInvestmentAnalysis,
  requireDocumentManagement,
  requireCommissionTracking,
  requirePerformanceAnalytics,
  requireMarketingTools,
  requireVirtualTourFeatures,
  requireProfessionalPhotography,
  requireStagingServices,
  requireHomeInspectionServices,
  requireLegalServices,
  requireInsuranceServices,
  requireFinancingServices,
  requireSecurityServices,
  requireSmartHomeFeatures,
  requireEnergyEfficiencyTools,
  requireSustainabilityFeatures,
  requireCrimeStatistics,
  requireAirQualityData,
  requireFloodRiskData,
  requireEarthquakeRiskData,
  requireTaxInformation,
  requirePermitInformation,
  requireZoningInformation,
  requireDevelopmentPlans,
  requireMarketTrends,
  requireInvestmentOpportunities,
  requireRentalYieldAnalysis,
  requireROICalculations,
  requireCashFlowAnalysis,
  requireAdvancedCostEstimators,
  requireCustomBrandingAccess,
  requireApiAccessControl,
  requireMultiUserSupport,
  requireAdvancedAnalytics,
  requireWhiteLabelFeatures,
  requireIntegrationFeatures,
  requireWorkflowAutomation,
  requireCustomerRelationshipManagement,
  requireSMSMarketing,
  require3DPropertyVisualization,
  requireESignatureFeatures,
  requireTransactionManagement,
  requireTeamManagementAccess,
  requireBulkOperationsAccess,
  requireImportFeatures,
  requirePricePredictions
};