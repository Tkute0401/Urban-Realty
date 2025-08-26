import axios from './axios';

const subscriptionService = {
  // Get user's current subscription
  getMySubscription: async () => {
    try {
      const response = await axios.get('/subscriptions/my-subscription');
      return response.data;
    } catch (error) {
      console.error('Error fetching subscription:', error);
      throw error;
    }
  },

  // Check if user has access to a specific feature
  checkFeatureAccess: async (feature) => {
    try {
      const response = await axios.get(`/subscriptions/check-feature/${feature}`);
      return response.data;
    } catch (error) {
      console.error('Error checking feature access:', error);
      throw error;
    }
  },

  // Get available subscription plans
  getSubscriptions: async () => {
    try {
      const response = await axios.get('/subscriptions');
      return response.data;
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      throw error;
    }
  },

  // Subscribe to a plan
  subscribe: async (subscriptionData) => {
    try {
      const response = await axios.post('/subscriptions/subscribe', subscriptionData);
      return response.data;
    } catch (error) {
      console.error('Error subscribing:', error);
      throw error;
    }
  },

  // Cancel subscription
  cancelSubscription: async () => {
    try {
      const response = await axios.put('/subscriptions/cancel');
      return response.data;
    } catch (error) {
      console.error('Error canceling subscription:', error);
      throw error;
    }
  },

  // Update payment method
  updatePaymentMethod: async (paymentData) => {
    try {
      const response = await axios.put('/subscriptions/payment-method', paymentData);
      return response.data;
    } catch (error) {
      console.error('Error updating payment method:', error);
      throw error;
    }
  },

  // Get billing history
  getBillingHistory: async () => {
    try {
      const response = await axios.get('/subscriptions/billing-history');
      return response.data;
    } catch (error) {
      console.error('Error fetching billing history:', error);
      throw error;
    }
  },

  // Get comprehensive billing details
  getBillingDetails: async () => {
    try {
      const response = await axios.get('/subscriptions/billing-details');
      return response.data;
    } catch (error) {
      console.error('Error fetching billing details:', error);
      throw error;
    }
  },

  // Get user invoices
  getInvoices: async (page = 1, limit = 10) => {
    try {
      const response = await axios.get(`/subscriptions/invoices?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching invoices:', error);
      throw error;
    }
  },

  // Get specific invoice
  getInvoice: async (invoiceId) => {
    try {
      const response = await axios.get(`/subscriptions/invoices/${invoiceId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching invoice:', error);
      throw error;
    }
  },

  // Mark invoice as paid
  markInvoiceAsPaid: async (invoiceId, transactionId) => {
    try {
      const response = await axios.put(`/subscriptions/invoices/${invoiceId}/mark-paid`, {
        transactionId
      });
      return response.data;
    } catch (error) {
      console.error('Error marking invoice as paid:', error);
      throw error;
    }
  },

  // Change subscription plan
  changePlan: async (subscriptionId, billingCycle) => {
    try {
      const response = await axios.put('/subscriptions/change-plan', {
        subscriptionId,
        billingCycle
      });
      return response.data;
    } catch (error) {
      console.error('Error changing subscription plan:', error);
      throw error;
    }
  },

  // Check listing limit
  checkListingLimit: async () => {
    try {
      const response = await axios.get('/subscriptions/listing-limit');
      return response.data;
    } catch (error) {
      console.error('Error checking listing limit:', error);
      throw error;
    }
  },

  // Feature access mapping
  featureRequirements: {
    // Basic features
    'contact': 'basic',
    'property_management': 'basic',
    'media_upload': 'basic',
    'advanced_search': 'basic',
    'favorites': 'basic',
    'recently_viewed': 'basic',
    'property_alerts': 'basic',
    'profile_management': 'basic',
    'professional_services': 'basic',

    // Premium features
    'analytics': 'premium',
    'priority_support': 'premium',
    'market_insights': 'premium',
    'investment_analysis': 'premium',
    'document_management': 'premium',
    'commission_tracking': 'premium',
    'performance_analytics': 'premium',
    'marketing_tools': 'premium',
    'virtual_tour_features': 'premium',
    'professional_photography': 'premium',
    'staging_services': 'premium',
    'home_inspection_services': 'premium',
    'legal_services': 'premium',
    'insurance_services': 'premium',
    'financing_services': 'premium',
    'security_services': 'premium',
    'smart_home_features': 'premium',
    'energy_efficiency_tools': 'premium',
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
    'export_features': 'premium',
    'reporting_features': 'premium',
    'developer_access': 'premium',

    // Enterprise features
    'admin_access': 'enterprise',
    'custom_branding': 'enterprise',
    'api_access': 'enterprise',
    'multi_user_support': 'enterprise',
    'advanced_analytics': 'enterprise',
    'white_label_features': 'enterprise',
    'integration_features': 'enterprise',
    'workflow_automation': 'enterprise',
    'customer_relationship_management': 'enterprise',
    'sms_marketing': 'enterprise',
    '3d_property_visualization': 'enterprise',
    'e_signature_features': 'enterprise',
    'transaction_management': 'enterprise',
    'team_management': 'enterprise',
    'bulk_operations': 'enterprise',
    'import_features': 'enterprise',
    'price_predictions': 'enterprise',
    'customization_features': 'enterprise',
    'crm': 'enterprise'
  },

  // Get required plan for a feature
  getRequiredPlan: (feature) => {
    return subscriptionService.featureRequirements[feature] || 'free';
  },

  // Check if user has access to a feature based on their subscription
  hasAccess: (userSubscription, feature) => {
    const requiredPlan = subscriptionService.getRequiredPlan(feature);
    const subscriptionLevels = {
      'free': 0,
      'basic': 1,
      'premium': 2,
      'enterprise': 3
    };

    const userLevel = subscriptionLevels[userSubscription] || 0;
    const requiredLevel = subscriptionLevels[requiredPlan] || 0;

    return userLevel >= requiredLevel;
  },

  // Get feature display name
  getFeatureDisplayName: (feature) => {
    const featureNames = {
      'contact': 'Contact Features',
      'property_management': 'Property Management',
      'media_upload': 'Media Upload',
      'advanced_search': 'Advanced Search',
      'favorites': 'Favorites & Saved Searches',
      'recently_viewed': 'Recently Viewed Properties',
      'property_alerts': 'Property Alerts',
      'profile_management': 'Profile Management',
      'professional_services': 'Professional Services',
      'analytics': 'Analytics & Insights',
      'priority_support': 'Priority Support',
      'market_insights': 'Market Insights',
      'investment_analysis': 'Investment Analysis',
      'document_management': 'Document Management',
      'commission_tracking': 'Commission Tracking',
      'performance_analytics': 'Performance Analytics',
      'marketing_tools': 'Marketing Tools',
      'virtual_tour_features': 'Virtual Tour Features',
      'professional_photography': 'Professional Photography',
      'staging_services': 'Staging Services',
      'home_inspection_services': 'Home Inspection Services',
      'legal_services': 'Legal Services',
      'insurance_services': 'Insurance Services',
      'financing_services': 'Financing Services',
      'security_services': 'Security Services',
      'smart_home_features': 'Smart Home Features',
      'energy_efficiency_tools': 'Energy Efficiency Tools',
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
      'export_features': 'Export Features',
      'reporting_features': 'Reporting Features',
      'developer_access': 'Developer Features',
      'admin_access': 'Admin Features',
      'custom_branding': 'Custom Branding',
      'api_access': 'API Access',
      'multi_user_support': 'Multi-User Support',
      'advanced_analytics': 'Advanced Analytics',
      'white_label_features': 'White-Label Features',
      'integration_features': 'Integration Features',
      'workflow_automation': 'Workflow Automation',
      'customer_relationship_management': 'Customer Relationship Management',
      'sms_marketing': 'SMS Marketing',
      '3d_property_visualization': '3D Property Visualization',
      'e_signature_features': 'E-Signature Features',
      'transaction_management': 'Transaction Management',
      'team_management': 'Team Management',
      'bulk_operations': 'Bulk Operations',
      'import_features': 'Import Features',
      'price_predictions': 'Price Predictions',
      'customization_features': 'Customization Features',
      'crm': 'CRM Features'
    };

    return featureNames[feature] || feature;
  }
};

export default subscriptionService;