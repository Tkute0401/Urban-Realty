import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from '../services/axios';

const useSubscriptionAccess = () => {
  const { user } = useAuth();
  const [subscriptionInfo, setSubscriptionInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      fetchSubscriptionInfo();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchSubscriptionInfo = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/subscriptions/my-subscription');
      setSubscriptionInfo(response.data.data);
    } catch (err) {
      console.error('Error fetching subscription info:', err);
      setError(err.response?.data?.message || 'Failed to fetch subscription info');
      // Set default free subscription info
      setSubscriptionInfo({
        status: 'free',
        subscriptionDetails: {
          name: 'Free Plan',
          type: 'free',
          features: {
            propertyListings: 0,
            advancedSearch: false,
            prioritySupport: false,
            analytics: false,
            customBranding: false,
            apiAccess: false
          }
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const checkFeatureAccess = async (feature) => {
    try {
      const response = await axios.get(`/subscriptions/check-feature/${feature}`);
      return response.data.data.hasAccess;
    } catch (err) {
      console.error('Error checking feature access:', err);
      return false;
    }
  };

  const checkListingLimit = async () => {
    try {
      const response = await axios.get('/subscriptions/listing-limit');
      return response.data.data;
    } catch (err) {
      console.error('Error checking listing limit:', err);
      return { canCreate: false, reason: 'Error checking listing limit' };
    }
  };

  const getCurrentPlan = () => {
    return subscriptionInfo?.status || 'free';
  };

  const getRequiredPlan = (feature) => {
    const featureRequirements = {
      // Basic features
      'contact': 'basic',
      'property_management': 'basic',
      'media_upload': 'basic',
      'advanced_search': 'basic',
      'saved_searches': 'basic',
      'property_alerts': 'basic',
      'neighborhood_insights': 'basic',
      'school_ratings': 'basic',
      'transportation_data': 'basic',
      'walkability_scores': 'basic',
      'property_history': 'basic',
      'hoa_information': 'basic',
      'utility_information': 'basic',
      'basic_calculators': 'basic',
      'moving_services': 'basic',
      'cleaning_services': 'basic',
      'maintenance_services': 'basic',
      'landscaping_services': 'basic',

      // Premium features
      'analytics': 'premium',
      'priority_support': 'premium',
      'market_insights': 'premium',
      'cma': 'premium',
      'investment_analysis': 'premium',
      'valuation_tools': 'premium',
      'document_management': 'premium',
      'commission_tracking': 'premium',
      'performance_analytics': 'premium',
      'marketing_tools': 'premium',
      'social_media_integration': 'premium',
      'email_marketing': 'premium',
      'virtual_tour': 'premium',
      'drone_photography': 'premium',
      'professional_photography': 'premium',
      'staging_services': 'premium',
      'home_inspection': 'premium',
      'legal_services': 'premium',
      'insurance_services': 'premium',
      'financing_services': 'premium',
      'security_services': 'premium',
      'smart_home_features': 'premium',
      'energy_efficiency': 'premium',
      'sustainability_features': 'premium',
      'crime_statistics': 'premium',
      'air_quality_data': 'premium',
      'flood_risk_data': 'premium',
      'earthquake_risk_data': 'premium',
      'tax_information': 'premium',
      'permit_information': 'premium',
      'zoning_information': 'premium',
      'development_plans': 'premium',
      'market_trends': 'premium',
      'investment_opportunities': 'premium',
      'rental_yield_analysis': 'premium',
      'roi_calculations': 'premium',
      'cash_flow_analysis': 'premium',
      'advanced_cost_estimators': 'premium',
      'lead_management': 'premium',
      'property_promotion': 'premium',
      'featured_property': 'premium',
      'priority_listing': 'premium',

      // Enterprise features
      'admin_access': 'enterprise',
      'custom_branding': 'enterprise',
      'api_access': 'enterprise',
      'multi_user': 'enterprise',
      'advanced_analytics': 'enterprise',
      'white_label': 'enterprise',
      'integration': 'enterprise',
      'workflow_automation': 'enterprise',
      'crm': 'enterprise',
      'sms_marketing': 'enterprise',
      '3d_visualization': 'enterprise',
      'e_signature': 'enterprise',
      'transaction_management': 'enterprise',
      'team_management': 'enterprise',
      'bulk_operations': 'enterprise',
      'import_features': 'enterprise',
      'price_predictions': 'enterprise',
      'customization': 'enterprise',
      'developer_access': 'enterprise'
    };

    return featureRequirements[feature] || 'free';
  };

  const hasAccess = (feature) => {
    const currentPlan = getCurrentPlan();
    const requiredPlan = getRequiredPlan(feature);
    
    const planLevels = {
      'free': 0,
      'basic': 1,
      'premium': 2,
      'enterprise': 3
    };

    const currentLevel = planLevels[currentPlan] || 0;
    const requiredLevel = planLevels[requiredPlan] || 0;

    return currentLevel >= requiredLevel;
  };

  const canCreateListing = () => {
    const currentPlan = getCurrentPlan();
    return currentPlan !== 'free';
  };

  const getListingLimit = () => {
    const planLimits = {
      'free': 0,
      'basic': 5,
      'premium': 25,
      'enterprise': 100
    };
    return planLimits[getCurrentPlan()] || 0;
  };

  const getFeatureDisplayName = (feature) => {
    const featureNames = {
      'contact': 'Contact Features',
      'property_management': 'Property Management',
      'media_upload': 'Media Upload',
      'advanced_search': 'Advanced Search',
      'saved_searches': 'Saved Searches',
      'property_alerts': 'Property Alerts',
      'neighborhood_insights': 'Neighborhood Insights',
      'school_ratings': 'School Ratings',
      'transportation_data': 'Transportation Data',
      'walkability_scores': 'Walkability Scores',
      'property_history': 'Property History',
      'hoa_information': 'HOA Information',
      'utility_information': 'Utility Information',
      'basic_calculators': 'Basic Calculators',
      'moving_services': 'Moving Services',
      'cleaning_services': 'Cleaning Services',
      'maintenance_services': 'Maintenance Services',
      'landscaping_services': 'Landscaping Services',
      'analytics': 'Analytics & Insights',
      'priority_support': 'Priority Support',
      'market_insights': 'Market Insights',
      'cma': 'Comparative Market Analysis',
      'investment_analysis': 'Investment Analysis',
      'valuation_tools': 'Property Valuation Tools',
      'document_management': 'Document Management',
      'commission_tracking': 'Commission Tracking',
      'performance_analytics': 'Performance Analytics',
      'marketing_tools': 'Marketing Tools',
      'social_media_integration': 'Social Media Integration',
      'email_marketing': 'Email Marketing',
      'virtual_tour': 'Virtual Tour Features',
      'drone_photography': 'Drone Photography',
      'professional_photography': 'Professional Photography',
      'staging_services': 'Staging Services',
      'home_inspection': 'Home Inspection Services',
      'legal_services': 'Legal Services',
      'insurance_services': 'Insurance Services',
      'financing_services': 'Financing Services',
      'security_services': 'Security Services',
      'smart_home_features': 'Smart Home Features',
      'energy_efficiency': 'Energy Efficiency Tools',
      'sustainability_features': 'Sustainability Features',
      'crime_statistics': 'Crime Statistics',
      'air_quality_data': 'Air Quality Data',
      'flood_risk_data': 'Flood Risk Data',
      'earthquake_risk_data': 'Earthquake Risk Data',
      'tax_information': 'Tax Information',
      'permit_information': 'Permit Information',
      'zoning_information': 'Zoning Information',
      'development_plans': 'Development Plans',
      'market_trends': 'Market Trends',
      'investment_opportunities': 'Investment Opportunities',
      'rental_yield_analysis': 'Rental Yield Analysis',
      'roi_calculations': 'ROI Calculations',
      'cash_flow_analysis': 'Cash Flow Analysis',
      'advanced_cost_estimators': 'Advanced Cost Estimators',
      'lead_management': 'Lead Management',
      'property_promotion': 'Property Promotion',
      'featured_property': 'Featured Property',
      'priority_listing': 'Priority Listing',
      'admin_access': 'Admin Features',
      'custom_branding': 'Custom Branding',
      'api_access': 'API Access',
      'multi_user': 'Multi-User Support',
      'advanced_analytics': 'Advanced Analytics',
      'white_label': 'White-Label Features',
      'integration': 'Integration Features',
      'workflow_automation': 'Workflow Automation',
      'crm': 'Customer Relationship Management',
      'sms_marketing': 'SMS Marketing',
      '3d_visualization': '3D Property Visualization',
      'e_signature': 'E-Signature Features',
      'transaction_management': 'Transaction Management',
      'team_management': 'Team Management',
      'bulk_operations': 'Bulk Operations',
      'import_features': 'Import Features',
      'price_predictions': 'Price Predictions',
      'customization': 'Customization Features',
      'developer_access': 'Developer Features'
    };

    return featureNames[feature] || feature;
  };

  return {
    subscriptionInfo,
    loading,
    error,
    getCurrentPlan,
    getRequiredPlan,
    hasAccess,
    canCreateListing,
    getListingLimit,
    checkFeatureAccess,
    checkListingLimit,
    getFeatureDisplayName,
    fetchSubscriptionInfo
  };
};

export default useSubscriptionAccess;