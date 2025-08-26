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
 * Middleware to check if user can access advanced analytics
 */
const requireAdvancedAnalytics = requireSubscription.bind(null, 'enterprise', 'Advanced analytics');

/**
 * Middleware to check if user can access priority listing features
 */
const requirePriorityListing = requireSubscription.bind(null, 'premium', 'Priority listing features');

/**
 * Middleware to check if user can access featured property features
 */
const requireFeaturedProperty = requireSubscription.bind(null, 'premium', 'Featured property features');

/**
 * Middleware to check if user can access property promotion features
 */
const requirePropertyPromotion = requireSubscription.bind(null, 'premium', 'Property promotion features');

/**
 * Middleware to check if user can access lead management features
 */
const requireLeadManagement = requireSubscription.bind(null, 'premium', 'Lead management features');

/**
 * Middleware to check if user can access customer relationship management
 */
const requireCRM = requireSubscription.bind(null, 'enterprise', 'Customer relationship management');

/**
 * Middleware to check if user can access workflow automation
 */
const requireWorkflowAutomation = requireSubscription.bind(null, 'enterprise', 'Workflow automation');

/**
 * Middleware to check if user can access advanced search filters
 */
const requireAdvancedFilters = requireSubscription.bind(null, 'basic', 'Advanced search filters');

/**
 * Middleware to check if user can access saved searches
 */
const requireSavedSearches = requireSubscription.bind(null, 'basic', 'Saved searches');

/**
 * Middleware to check if user can access property alerts
 */
const requirePropertyAlerts = requireSubscription.bind(null, 'basic', 'Property alerts');

/**
 * Middleware to check if user can access market insights
 */
const requireMarketInsights = requireSubscription.bind(null, 'premium', 'Market insights');

/**
 * Middleware to check if user can access comparative market analysis
 */
const requireCMA = requireSubscription.bind(null, 'premium', 'Comparative market analysis');

/**
 * Middleware to check if user can access investment analysis
 */
const requireInvestmentAnalysis = requireSubscription.bind(null, 'premium', 'Investment analysis');

/**
 * Middleware to check if user can access property valuation tools
 */
const requireValuationTools = requireSubscription.bind(null, 'premium', 'Property valuation tools');

/**
 * Middleware to check if user can access document management
 */
const requireDocumentManagement = requireSubscription.bind(null, 'premium', 'Document management');

/**
 * Middleware to check if user can access e-signature features
 */
const requireESignature = requireSubscription.bind(null, 'enterprise', 'E-signature features');

/**
 * Middleware to check if user can access transaction management
 */
const requireTransactionManagement = requireSubscription.bind(null, 'enterprise', 'Transaction management');

/**
 * Middleware to check if user can access commission tracking
 */
const requireCommissionTracking = requireSubscription.bind(null, 'premium', 'Commission tracking');

/**
 * Middleware to check if user can access team management
 */
const requireTeamManagement = requireSubscription.bind(null, 'enterprise', 'Team management');

/**
 * Middleware to check if user can access performance analytics
 */
const requirePerformanceAnalytics = requireSubscription.bind(null, 'premium', 'Performance analytics');

/**
 * Middleware to check if user can access marketing tools
 */
const requireMarketingTools = requireSubscription.bind(null, 'premium', 'Marketing tools');

/**
 * Middleware to check if user can access social media integration
 */
const requireSocialMediaIntegration = requireSubscription.bind(null, 'premium', 'Social media integration');

/**
 * Middleware to check if user can access email marketing
 */
const requireEmailMarketing = requireSubscription.bind(null, 'premium', 'Email marketing');

/**
 * Middleware to check if user can access SMS marketing
 */
const requireSMSMarketing = requireSubscription.bind(null, 'enterprise', 'SMS marketing');

/**
 * Middleware to check if user can access virtual tour features
 */
const requireVirtualTour = requireSubscription.bind(null, 'premium', 'Virtual tour features');

/**
 * Middleware to check if user can access 3D property visualization
 */
const require3DVisualization = requireSubscription.bind(null, 'enterprise', '3D property visualization');

/**
 * Middleware to check if user can access drone photography
 */
const requireDronePhotography = requireSubscription.bind(null, 'premium', 'Drone photography');

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
const requireHomeInspection = requireSubscription.bind(null, 'premium', 'Home inspection services');

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
 * Middleware to check if user can access moving services
 */
const requireMovingServices = requireSubscription.bind(null, 'basic', 'Moving services');

/**
 * Middleware to check if user can access cleaning services
 */
const requireCleaningServices = requireSubscription.bind(null, 'basic', 'Cleaning services');

/**
 * Middleware to check if user can access maintenance services
 */
const requireMaintenanceServices = requireSubscription.bind(null, 'basic', 'Maintenance services');

/**
 * Middleware to check if user can access landscaping services
 */
const requireLandscapingServices = requireSubscription.bind(null, 'basic', 'Landscaping services');

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
const requireEnergyEfficiency = requireSubscription.bind(null, 'premium', 'Energy efficiency tools');

/**
 * Middleware to check if user can access sustainability features
 */
const requireSustainabilityFeatures = requireSubscription.bind(null, 'premium', 'Sustainability features');

/**
 * Middleware to check if user can access neighborhood insights
 */
const requireNeighborhoodInsights = requireSubscription.bind(null, 'basic', 'Neighborhood insights');

/**
 * Middleware to check if user can access school ratings
 */
const requireSchoolRatings = requireSubscription.bind(null, 'basic', 'School ratings');

/**
 * Middleware to check if user can access crime statistics
 */
const requireCrimeStatistics = requireSubscription.bind(null, 'premium', 'Crime statistics');

/**
 * Middleware to check if user can access transportation data
 */
const requireTransportationData = requireSubscription.bind(null, 'basic', 'Transportation data');

/**
 * Middleware to check if user can access walkability scores
 */
const requireWalkabilityScores = requireSubscription.bind(null, 'basic', 'Walkability scores');

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
 * Middleware to check if user can access property history
 */
const requirePropertyHistory = requireSubscription.bind(null, 'basic', 'Property history');

/**
 * Middleware to check if user can access tax information
 */
const requireTaxInformation = requireSubscription.bind(null, 'premium', 'Tax information');

/**
 * Middleware to check if user can access HOA information
 */
const requireHOAInformation = requireSubscription.bind(null, 'basic', 'HOA information');

/**
 * Middleware to check if user can access utility information
 */
const requireUtilityInformation = requireSubscription.bind(null, 'basic', 'Utility information');

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
 * Middleware to check if user can access price predictions
 */
const requirePricePredictions = requireSubscription.bind(null, 'enterprise', 'Price predictions');

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
 * Middleware to check if user can access mortgage calculator
 */
const requireMortgageCalculator = requireSubscription.bind(null, 'basic', 'Mortgage calculator');

/**
 * Middleware to check if user can access refinance calculator
 */
const requireRefinanceCalculator = requireSubscription.bind(null, 'basic', 'Refinance calculator');

/**
 * Middleware to check if user can access affordability calculator
 */
const requireAffordabilityCalculator = requireSubscription.bind(null, 'basic', 'Affordability calculator');

/**
 * Middleware to check if user can access rent vs buy calculator
 */
const requireRentVsBuyCalculator = requireSubscription.bind(null, 'basic', 'Rent vs buy calculator');

/**
 * Middleware to check if user can access closing cost calculator
 */
const requireClosingCostCalculator = requireSubscription.bind(null, 'basic', 'Closing cost calculator');

/**
 * Middleware to check if user can access property tax calculator
 */
const requirePropertyTaxCalculator = requireSubscription.bind(null, 'basic', 'Property tax calculator');

/**
 * Middleware to check if user can access insurance calculator
 */
const requireInsuranceCalculator = requireSubscription.bind(null, 'basic', 'Insurance calculator');

/**
 * Middleware to check if user can access HOA fee calculator
 */
const requireHOAFeeCalculator = requireSubscription.bind(null, 'basic', 'HOA fee calculator');

/**
 * Middleware to check if user can access utility cost estimator
 */
const requireUtilityCostEstimator = requireSubscription.bind(null, 'basic', 'Utility cost estimator');

/**
 * Middleware to check if user can access maintenance cost estimator
 */
const requireMaintenanceCostEstimator = requireSubscription.bind(null, 'premium', 'Maintenance cost estimator');

/**
 * Middleware to check if user can access renovation cost estimator
 */
const requireRenovationCostEstimator = requireSubscription.bind(null, 'premium', 'Renovation cost estimator');

/**
 * Middleware to check if user can access landscaping cost estimator
 */
const requireLandscapingCostEstimator = requireSubscription.bind(null, 'premium', 'Landscaping cost estimator');

/**
 * Middleware to check if user can access pool cost estimator
 */
const requirePoolCostEstimator = requireSubscription.bind(null, 'premium', 'Pool cost estimator');

/**
 * Middleware to check if user can access solar panel cost estimator
 */
const requireSolarPanelCostEstimator = requireSubscription.bind(null, 'premium', 'Solar panel cost estimator');

/**
 * Middleware to check if user can access smart home cost estimator
 */
const requireSmartHomeCostEstimator = requireSubscription.bind(null, 'premium', 'Smart home cost estimator');

/**
 * Middleware to check if user can access security system cost estimator
 */
const requireSecuritySystemCostEstimator = requireSubscription.bind(null, 'premium', 'Security system cost estimator');

/**
 * Middleware to check if user can access home theater cost estimator
 */
const requireHomeTheaterCostEstimator = requireSubscription.bind(null, 'premium', 'Home theater cost estimator');

/**
 * Middleware to check if user can access wine cellar cost estimator
 */
const requireWineCellarCostEstimator = requireSubscription.bind(null, 'premium', 'Wine cellar cost estimator');

/**
 * Middleware to check if user can access home gym cost estimator
 */
const requireHomeGymCostEstimator = requireSubscription.bind(null, 'premium', 'Home gym cost estimator');

/**
 * Middleware to check if user can access home office cost estimator
 */
const requireHomeOfficeCostEstimator = requireSubscription.bind(null, 'premium', 'Home office cost estimator');

/**
 * Middleware to check if user can access guest house cost estimator
 */
const requireGuestHouseCostEstimator = requireSubscription.bind(null, 'premium', 'Guest house cost estimator');

/**
 * Middleware to check if user can access garage cost estimator
 */
const requireGarageCostEstimator = requireSubscription.bind(null, 'premium', 'Garage cost estimator');

/**
 * Middleware to check if user can access shed cost estimator
 */
const requireShedCostEstimator = requireSubscription.bind(null, 'premium', 'Shed cost estimator');

/**
 * Middleware to check if user can access deck cost estimator
 */
const requireDeckCostEstimator = requireSubscription.bind(null, 'premium', 'Deck cost estimator');

/**
 * Middleware to check if user can access patio cost estimator
 */
const requirePatioCostEstimator = requireSubscription.bind(null, 'premium', 'Patio cost estimator');

/**
 * Middleware to check if user can access fence cost estimator
 */
const requireFenceCostEstimator = requireSubscription.bind(null, 'premium', 'Fence cost estimator');

/**
 * Middleware to check if user can access driveway cost estimator
 */
const requireDrivewayCostEstimator = requireSubscription.bind(null, 'premium', 'Driveway cost estimator');

/**
 * Middleware to check if user can access walkway cost estimator
 */
const requireWalkwayCostEstimator = requireSubscription.bind(null, 'premium', 'Walkway cost estimator');

/**
 * Middleware to check if user can access retaining wall cost estimator
 */
const requireRetainingWallCostEstimator = requireSubscription.bind(null, 'premium', 'Retaining wall cost estimator');

/**
 * Middleware to check if user can access irrigation system cost estimator
 */
const requireIrrigationSystemCostEstimator = requireSubscription.bind(null, 'premium', 'Irrigation system cost estimator');

/**
 * Middleware to check if user can access outdoor kitchen cost estimator
 */
const requireOutdoorKitchenCostEstimator = requireSubscription.bind(null, 'premium', 'Outdoor kitchen cost estimator');

/**
 * Middleware to check if user can access fire pit cost estimator
 */
const requireFirePitCostEstimator = requireSubscription.bind(null, 'premium', 'Fire pit cost estimator');

/**
 * Middleware to check if user can access hot tub cost estimator
 */
const requireHotTubCostEstimator = requireSubscription.bind(null, 'premium', 'Hot tub cost estimator');

/**
 * Middleware to check if user can access sauna cost estimator
 */
const requireSaunaCostEstimator = requireSubscription.bind(null, 'premium', 'Sauna cost estimator');

/**
 * Middleware to check if user can access steam room cost estimator
 */
const requireSteamRoomCostEstimator = requireSubscription.bind(null, 'premium', 'Steam room cost estimator');

/**
 * Middleware to check if user can access massage room cost estimator
 */
const requireMassageRoomCostEstimator = requireSubscription.bind(null, 'premium', 'Massage room cost estimator');

/**
 * Middleware to check if user can access meditation room cost estimator
 */
const requireMeditationRoomCostEstimator = requireSubscription.bind(null, 'premium', 'Meditation room cost estimator');

/**
 * Middleware to check if user can access yoga room cost estimator
 */
const requireYogaRoomCostEstimator = requireSubscription.bind(null, 'premium', 'Yoga room cost estimator');

/**
 * Middleware to check if user can access art studio cost estimator
 */
const requireArtStudioCostEstimator = requireSubscription.bind(null, 'premium', 'Art studio cost estimator');

/**
 * Middleware to check if user can access music room cost estimator
 */
const requireMusicRoomCostEstimator = requireSubscription.bind(null, 'premium', 'Music room cost estimator');

/**
 * Middleware to check if user can access library cost estimator
 */
const requireLibraryCostEstimator = requireSubscription.bind(null, 'premium', 'Library cost estimator');

/**
 * Middleware to check if user can access game room cost estimator
 */
const requireGameRoomCostEstimator = requireSubscription.bind(null, 'premium', 'Game room cost estimator');

/**
 * Middleware to check if user can access billiard room cost estimator
 */
const requireBilliardRoomCostEstimator = requireSubscription.bind(null, 'premium', 'Billiard room cost estimator');

/**
 * Middleware to check if user can access bowling alley cost estimator
 */
const requireBowlingAlleyCostEstimator = requireSubscription.bind(null, 'premium', 'Bowling alley cost estimator');

/**
 * Middleware to check if user can access indoor basketball court cost estimator
 */
const requireIndoorBasketballCourtCostEstimator = requireSubscription.bind(null, 'premium', 'Indoor basketball court cost estimator');

/**
 * Middleware to check if user can access indoor tennis court cost estimator
 */
const requireIndoorTennisCourtCostEstimator = requireSubscription.bind(null, 'premium', 'Indoor tennis court cost estimator');

/**
 * Middleware to check if user can access indoor swimming pool cost estimator
 */
const requireIndoorSwimmingPoolCostEstimator = requireSubscription.bind(null, 'premium', 'Indoor swimming pool cost estimator');

/**
 * Middleware to check if user can access indoor golf simulator cost estimator
 */
const requireIndoorGolfSimulatorCostEstimator = requireSubscription.bind(null, 'premium', 'Indoor golf simulator cost estimator');

/**
 * Middleware to check if user can access indoor climbing wall cost estimator
 */
const requireIndoorClimbingWallCostEstimator = requireSubscription.bind(null, 'premium', 'Indoor climbing wall cost estimator');

/**
 * Middleware to check if user can access indoor rock climbing cost estimator
 */
const requireIndoorRockClimbingCostEstimator = requireSubscription.bind(null, 'premium', 'Indoor rock climbing cost estimator');

/**
 * Middleware to check if user can access indoor zip line cost estimator
 */
const requireIndoorZipLineCostEstimator = requireSubscription.bind(null, 'premium', 'Indoor zip line cost estimator');

/**
 * Middleware to check if user can access indoor trampoline cost estimator
 */
const requireIndoorTrampolineCostEstimator = requireSubscription.bind(null, 'premium', 'Indoor trampoline cost estimator');

/**
 * Middleware to check if user can access indoor playground cost estimator
 */
const requireIndoorPlaygroundCostEstimator = requireSubscription.bind(null, 'premium', 'Indoor playground cost estimator');

/**
 * Middleware to check if user can access indoor pet park cost estimator
 */
const requireIndoorPetParkCostEstimator = requireSubscription.bind(null, 'premium', 'Indoor pet park cost estimator');

/**
 * Middleware to check if user can access indoor dog training area cost estimator
 */
const requireIndoorDogTrainingAreaCostEstimator = requireSubscription.bind(null, 'premium', 'Indoor dog training area cost estimator');

/**
 * Middleware to check if user can access indoor cat playground cost estimator
 */
const requireIndoorCatPlaygroundCostEstimator = requireSubscription.bind(null, 'premium', 'Indoor cat playground cost estimator');

/**
 * Middleware to check if user can access indoor bird aviary cost estimator
 */
const requireIndoorBirdAviaryCostEstimator = requireSubscription.bind(null, 'premium', 'Indoor bird aviary cost estimator');

/**
 * Middleware to check if user can access indoor fish tank cost estimator
 */
const requireIndoorFishTankCostEstimator = requireSubscription.bind(null, 'premium', 'Indoor fish tank cost estimator');

/**
 * Middleware to check if user can access indoor reptile habitat cost estimator
 */
const requireIndoorReptileHabitatCostEstimator = requireSubscription.bind(null, 'premium', 'Indoor reptile habitat cost estimator');

/**
 * Middleware to check if user can access indoor hamster maze cost estimator
 */
const requireIndoorHamsterMazeCostEstimator = requireSubscription.bind(null, 'premium', 'Indoor hamster maze cost estimator');

/**
 * Middleware to check if user can access indoor rabbit hutch cost estimator
 */
const requireIndoorRabbitHutchCostEstimator = requireSubscription.bind(null, 'premium', 'Indoor rabbit hutch cost estimator');

/**
 * Middleware to check if user can access indoor guinea pig habitat cost estimator
 */
const requireIndoorGuineaPigHabitatCostEstimator = requireSubscription.bind(null, 'premium', 'Indoor guinea pig habitat cost estimator');

/**
 * Middleware to check if user can access indoor ferret playground cost estimator
 */
const requireIndoorFerretPlaygroundCostEstimator = requireSubscription.bind(null, 'premium', 'Indoor ferret playground cost estimator');

/**
 * Middleware to check if user can access indoor hedgehog habitat cost estimator
 */
const requireIndoorHedgehogHabitatCostEstimator = requireSubscription.bind(null, 'premium', 'Indoor hedgehog habitat cost estimator');

/**
 * Middleware to check if user can access indoor chinchilla habitat cost estimator
 */
const requireIndoorChinchillaHabitatCostEstimator = requireSubscription.bind(null, 'premium', 'Indoor chinchilla habitat cost estimator');

/**
 * Middleware to check if user can access indoor sugar glider habitat cost estimator
 */
const requireIndoorSugarGliderHabitatCostEstimator = requireSubscription.bind(null, 'premium', 'Indoor sugar glider habitat cost estimator');

/**
 * Middleware to check if user can access indoor degu habitat cost estimator
 */
const requireIndoorDeguHabitatCostEstimator = requireSubscription.bind(null, 'premium', 'Indoor degu habitat cost estimator');

/**
 * Middleware to check if user can access indoor gerbil habitat cost estimator
 */
const requireIndoorGerbilHabitatCostEstimator = requireSubscription.bind(null, 'premium', 'Indoor gerbil habitat cost estimator');

/**
 * Middleware to check if user can access indoor mouse habitat cost estimator
 */
const requireIndoorMouseHabitatCostEstimator = requireSubscription.bind(null, 'premium', 'Indoor mouse habitat cost estimator');

/**
 * Middleware to check if user can access indoor rat habitat cost estimator
 */
const requireIndoorRatHabitatCostEstimator = requireSubscription.bind(null, 'premium', 'Indoor rat habitat cost estimator');

/**
 * Middleware to check if user can access indoor hamster habitat cost estimator
 */
const requireIndoorHamsterHabitatCostEstimator = requireSubscription.bind(null, 'premium', 'Indoor hamster habitat cost estimator');

/**
 * Middleware to check if user can access indoor gerbil habitat cost estimator
 */
const requireIndoorGerbilHabitatCostEstimator2 = requireSubscription.bind(null, 'premium', 'Indoor gerbil habitat cost estimator');

/**
 * Middleware to check if user can access indoor mouse habitat cost estimator
 */
const requireIndoorMouseHabitatCostEstimator2 = requireSubscription.bind(null, 'premium', 'Indoor mouse habitat cost estimator');

/**
 * Middleware to check if user can access indoor rat habitat cost estimator
 */
const requireIndoorRatHabitatCostEstimator2 = requireSubscription.bind(null, 'premium', 'Indoor rat habitat cost estimator');

/**
 * Middleware to check if user can access indoor hamster habitat cost estimator
 */
const requireIndoorHamsterHabitatCostEstimator2 = requireSubscription.bind(null, 'premium', 'Indoor hamster habitat cost estimator');

/**
 * Middleware to check if user can access indoor gerbil habitat cost estimator
 */
const requireIndoorGerbilHabitatCostEstimator3 = requireSubscription.bind(null, 'premium', 'Indoor gerbil habitat cost estimator');

/**
 * Middleware to check if user can access indoor mouse habitat cost estimator
 */
const requireIndoorMouseHabitatCostEstimator3 = requireSubscription.bind(null, 'premium', 'Indoor mouse habitat cost estimator');

/**
 * Middleware to check if user can access indoor rat habitat cost estimator
 */
const requireIndoorRatHabitatCostEstimator3 = requireSubscription.bind(null, 'premium', 'Indoor rat habitat cost estimator');

/**
 * Middleware to check if user can access indoor hamster habitat cost estimator
 */
const requireIndoorHamsterHabitatCostEstimator3 = requireSubscription.bind(null, 'premium', 'Indoor hamster habitat cost estimator');

/**
 * Middleware to check if user can access indoor gerbil habitat cost estimator
 */
const requireIndoorGerbilHabitatCostEstimator4 = requireSubscription.bind(null, 'premium', 'Indoor gerbil habitat cost estimator');

/**
 * Middleware to check if user can access indoor mouse habitat cost estimator
 */
const requireIndoorMouseHabitatCostEstimator4 = requireSubscription.bind(null, 'premium', 'Indoor mouse habitat cost estimator');

/**
 * Middleware to check if user can access indoor rat habitat cost estimator
 */
const requireIndoorRatHabitatCostEstimator4 = requireSubscription.bind(null, 'premium', 'Indoor rat habitat cost estimator');

/**
 * Middleware to check if user can access indoor hamster habitat cost estimator
 */
const requireIndoorHamsterHabitatCostEstimator4 = requireSubscription.bind(null, 'premium', 'Indoor hamster habitat cost estimator');

/**
 * Middleware to check if user can access indoor gerbil habitat cost estimator
 */
const requireIndoorGerbilHabitatCostEstimator5 = requireSubscription.bind(null, 'premium', 'Indoor gerbil habitat cost estimator');

/**
 * Middleware to check if user can access indoor mouse habitat cost estimator
 */
const requireIndoorMouseHabitatCostEstimator5 = requireSubscription.bind(null, 'premium', 'Indoor mouse habitat cost estimator');

/**
 * Middleware to check if user can access indoor rat habitat cost estimator
 */
const requireIndoorRatHabitatCostEstimator5 = requireSubscription.bind(null, 'premium', 'Indoor rat habitat cost estimator');

/**
 * Middleware to check if user can access indoor hamster habitat cost estimator
 */
const requireIndoorHamsterHabitatCostEstimator5 = requireSubscription.bind(null, 'premium', 'Indoor hamster habitat cost estimator');

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
  requireAdvancedAnalytics,
  requirePriorityListing,
  requireFeaturedProperty,
  requirePropertyPromotion,
  requireLeadManagement,
  requireCRM,
  requireWorkflowAutomation,
  requireAdvancedFilters,
  requireSavedSearches,
  requirePropertyAlerts,
  requireMarketInsights,
  requireCMA,
  requireInvestmentAnalysis,
  requireValuationTools,
  requireDocumentManagement,
  requireESignature,
  requireTransactionManagement,
  requireCommissionTracking,
  requireTeamManagement,
  requirePerformanceAnalytics,
  requireMarketingTools,
  requireSocialMediaIntegration,
  requireEmailMarketing,
  requireSMSMarketing,
  requireVirtualTour,
  require3DVisualization,
  requireDronePhotography,
  requireProfessionalPhotography,
  requireStagingServices,
  requireHomeInspection,
  requireLegalServices,
  requireInsuranceServices,
  requireFinancingServices,
  requireMovingServices,
  requireCleaningServices,
  requireMaintenanceServices,
  requireLandscapingServices,
  requireSecurityServices,
  requireSmartHomeFeatures,
  requireEnergyEfficiency,
  requireSustainabilityFeatures,
  requireNeighborhoodInsights,
  requireSchoolRatings,
  requireCrimeStatistics,
  requireTransportationData,
  requireWalkabilityScores,
  requireAirQualityData,
  requireFloodRiskData,
  requireEarthquakeRiskData,
  requirePropertyHistory,
  requireTaxInformation,
  requireHOAInformation,
  requireUtilityInformation,
  requirePermitInformation,
  requireZoningInformation,
  requireDevelopmentPlans,
  requireMarketTrends,
  requirePricePredictions,
  requireInvestmentOpportunities,
  requireRentalYieldAnalysis,
  requireROICalculations,
  requireCashFlowAnalysis,
  requireMortgageCalculator,
  requireRefinanceCalculator,
  requireAffordabilityCalculator,
  requireRentVsBuyCalculator,
  requireClosingCostCalculator,
  requirePropertyTaxCalculator,
  requireInsuranceCalculator,
  requireHOAFeeCalculator,
  requireUtilityCostEstimator,
  requireMaintenanceCostEstimator,
  requireRenovationCostEstimator,
  requireLandscapingCostEstimator,
  requirePoolCostEstimator,
  requireSolarPanelCostEstimator,
  requireSmartHomeCostEstimator,
  requireSecuritySystemCostEstimator,
  requireHomeTheaterCostEstimator,
  requireWineCellarCostEstimator,
  requireHomeGymCostEstimator,
  requireHomeOfficeCostEstimator,
  requireGuestHouseCostEstimator,
  requireGarageCostEstimator,
  requireShedCostEstimator,
  requireDeckCostEstimator,
  requirePatioCostEstimator,
  requireFenceCostEstimator,
  requireDrivewayCostEstimator,
  requireWalkwayCostEstimator,
  requireRetainingWallCostEstimator,
  requireIrrigationSystemCostEstimator,
  requireOutdoorKitchenCostEstimator,
  requireFirePitCostEstimator,
  requireHotTubCostEstimator,
  requireSaunaCostEstimator,
  requireSteamRoomCostEstimator,
  requireMassageRoomCostEstimator,
  requireMeditationRoomCostEstimator,
  requireYogaRoomCostEstimator,
  requireArtStudioCostEstimator,
  requireMusicRoomCostEstimator,
  requireLibraryCostEstimator,
  requireGameRoomCostEstimator,
  requireBilliardRoomCostEstimator,
  requireBowlingAlleyCostEstimator,
  requireIndoorBasketballCourtCostEstimator,
  requireIndoorTennisCourtCostEstimator,
  requireIndoorSwimmingPoolCostEstimator,
  requireIndoorGolfSimulatorCostEstimator,
  requireIndoorClimbingWallCostEstimator,
  requireIndoorRockClimbingCostEstimator,
  requireIndoorZipLineCostEstimator,
  requireIndoorTrampolineCostEstimator,
  requireIndoorPlaygroundCostEstimator,
  requireIndoorPetParkCostEstimator,
  requireIndoorDogTrainingAreaCostEstimator,
  requireIndoorCatPlaygroundCostEstimator,
  requireIndoorBirdAviaryCostEstimator,
  requireIndoorFishTankCostEstimator,
  requireIndoorReptileHabitatCostEstimator,
  requireIndoorHamsterMazeCostEstimator,
  requireIndoorRabbitHutchCostEstimator,
  requireIndoorGuineaPigHabitatCostEstimator,
  requireIndoorFerretPlaygroundCostEstimator,
  requireIndoorHedgehogHabitatCostEstimator,
  requireIndoorChinchillaHabitatCostEstimator,
  requireIndoorSugarGliderHabitatCostEstimator,
  requireIndoorDeguHabitatCostEstimator,
  requireIndoorGerbilHabitatCostEstimator,
  requireIndoorMouseHabitatCostEstimator,
  requireIndoorRatHabitatCostEstimator,
  requireIndoorHamsterHabitatCostEstimator,
  requireIndoorGerbilHabitatCostEstimator2,
  requireIndoorMouseHabitatCostEstimator2,
  requireIndoorRatHabitatCostEstimator2,
  requireIndoorHamsterHabitatCostEstimator2,
  requireIndoorGerbilHabitatCostEstimator3,
  requireIndoorMouseHabitatCostEstimator3,
  requireIndoorRatHabitatCostEstimator3,
  requireIndoorHamsterHabitatCostEstimator3,
  requireIndoorGerbilHabitatCostEstimator4,
  requireIndoorMouseHabitatCostEstimator4,
  requireIndoorRatHabitatCostEstimator4,
  requireIndoorHamsterHabitatCostEstimator4,
  requireIndoorGerbilHabitatCostEstimator5,
  requireIndoorMouseHabitatCostEstimator5,
  requireIndoorRatHabitatCostEstimator5,
  requireIndoorHamsterHabitatCostEstimator5
};