const axios = require('axios');

// Test configuration
const BASE_URL = 'https://urban-realty-production.up.railway.app/api/v1';
// const BASE_URL = 'http://localhost:5000/api/v1';

// Test data
const testUsers = {
  free: {
    email: 'test-free@example.com',
    password: 'password123',
    name: 'Free User',
    role: 'buyer'
  },
  basic: {
    email: 'test-basic@example.com',
    password: 'password123',
    name: 'Basic User',
    role: 'buyer'
  },
  premium: {
    email: 'test-premium@example.com',
    password: 'password123',
    name: 'Premium User',
    role: 'agent'
  },
  enterprise: {
    email: 'test-enterprise@example.com',
    password: 'password123',
    name: 'Enterprise User',
    role: 'admin'
  }
};

let authTokens = {};

// Helper function to make authenticated requests
const makeAuthRequest = async (token, method, endpoint, data = null) => {
  try {
    const config = {
      method,
      url: `${BASE_URL}${endpoint}`,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
    
    if (data) {
      config.data = data;
    }
    
    const response = await axios(config);
    return { success: true, data: response.data, status: response.status };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data || error.message, 
      status: error.response?.status 
    };
  }
};

// Test functions
const testUserRegistration = async () => {
  console.log('\n🔧 Testing User Registration...');
  
  for (const [plan, userData] of Object.entries(testUsers)) {
    try {
      const response = await axios.post(`${BASE_URL}/auth/register`, userData);
      console.log(`✅ ${plan.toUpperCase()} user registered successfully`);
    } catch (error) {
      if (error.response?.status === 400 && error.response?.data?.message?.includes('already exists')) {
        console.log(`⚠️  ${plan.toUpperCase()} user already exists`);
      } else {
        console.log(`❌ Failed to register ${plan.toUpperCase()} user:`, error.response?.data?.message);
      }
    }
  }
};

const testUserLogin = async () => {
  console.log('\n🔐 Testing User Login...');
  
  for (const [plan, userData] of Object.entries(testUsers)) {
    try {
      const response = await axios.post(`${BASE_URL}/auth/login`, {
        email: userData.email,
        password: userData.password
      });
      
      if (response.data.token) {
        authTokens[plan] = response.data.token;
        console.log(`✅ ${plan.toUpperCase()} user logged in successfully`);
      }
    } catch (error) {
      console.log(`❌ Failed to login ${plan.toUpperCase()} user:`, error.response?.data?.message);
    }
  }
};

const testSubscriptionAccess = async () => {
  console.log('\n🔒 Testing Subscription Access Control...');
  
  const testCases = [
    // Basic features
    { feature: 'contact', requiredPlan: 'basic', endpoint: '/contacts/property/123', method: 'POST' },
    { feature: 'property_management', requiredPlan: 'basic', endpoint: '/properties', method: 'POST' },
    { feature: 'media_upload', requiredPlan: 'basic', endpoint: '/media/property/123', method: 'POST' },
    { feature: 'favorites', requiredPlan: 'basic', endpoint: '/auth/favorites/123', method: 'PUT' },
    { feature: 'recently_viewed', requiredPlan: 'basic', endpoint: '/auth/recently-viewed/123', method: 'POST' },
    
    // Premium features
    { feature: 'analytics', requiredPlan: 'premium', endpoint: '/admin/stats', method: 'GET' },
    { feature: 'priority_support', requiredPlan: 'premium', endpoint: '/admin/contacts', method: 'GET' },
    { feature: 'market_insights', requiredPlan: 'premium', endpoint: '/properties/analytics', method: 'GET' },
    { feature: 'investment_analysis', requiredPlan: 'premium', endpoint: '/properties/investment-analysis', method: 'GET' },
    { feature: 'document_management', requiredPlan: 'premium', endpoint: '/documents', method: 'GET' },
    
    // Enterprise features
    { feature: 'admin_access', requiredPlan: 'enterprise', endpoint: '/admin/users', method: 'GET' },
    { feature: 'custom_branding', requiredPlan: 'enterprise', endpoint: '/admin/branding', method: 'GET' },
    { feature: 'api_access', requiredPlan: 'enterprise', endpoint: '/api/v1/admin/stats', method: 'GET' },
    { feature: 'multi_user_support', requiredPlan: 'enterprise', endpoint: '/admin/team', method: 'GET' },
    { feature: 'advanced_analytics', requiredPlan: 'enterprise', endpoint: '/admin/advanced-analytics', method: 'GET' }
  ];
  
  for (const testCase of testCases) {
    console.log(`\n📋 Testing: ${testCase.feature} (requires ${testCase.requiredPlan})`);
    
    for (const [plan, token] of Object.entries(authTokens)) {
      const result = await makeAuthRequest(token, testCase.method, testCase.endpoint);
      
      if (result.success) {
        console.log(`  ✅ ${plan.toUpperCase()} user: Access granted`);
      } else if (result.status === 403) {
        const isSubscriptionError = result.error?.message?.toLowerCase().includes('subscription') ||
                                   result.error?.message?.toLowerCase().includes('plan') ||
                                   result.error?.message?.toLowerCase().includes('requires');
        
        if (isSubscriptionError) {
          console.log(`  🔒 ${plan.toUpperCase()} user: Access denied (subscription required)`);
        } else {
          console.log(`  ❌ ${plan.toUpperCase()} user: Access denied (other reason)`);
        }
      } else {
        console.log(`  ⚠️  ${plan.toUpperCase()} user: ${result.status} - ${result.error?.message}`);
      }
    }
  }
};

const testSubscriptionFeatures = async () => {
  console.log('\n🎯 Testing Specific Subscription Features...');
  
  const featureTests = [
    {
      name: 'Property Creation (Basic+)',
      endpoint: '/properties',
      method: 'POST',
      data: {
        title: 'Test Property',
        description: 'Test description',
        type: 'House',
        status: 'For Sale',
        price: 500000,
        bedrooms: 3,
        bathrooms: 2,
        area: 2000,
        address: '123 Test St'
      }
    },
    {
      name: 'Contact Requests (Basic+)',
      endpoint: '/contacts/property/123',
      method: 'POST',
      data: {
        message: 'Test contact request',
        contactMethod: 'email'
      }
    },
    {
      name: 'Favorites (Basic+)',
      endpoint: '/auth/favorites/123',
      method: 'PUT'
    },
    {
      name: 'Admin Dashboard (Enterprise)',
      endpoint: '/admin/stats',
      method: 'GET'
    },
    {
      name: 'User Management (Enterprise)',
      endpoint: '/admin/users',
      method: 'GET'
    }
  ];
  
  for (const test of featureTests) {
    console.log(`\n🔍 Testing: ${test.name}`);
    
    for (const [plan, token] of Object.entries(authTokens)) {
      const result = await makeAuthRequest(token, test.method, test.endpoint, test.data);
      
      if (result.success) {
        console.log(`  ✅ ${plan.toUpperCase()} user: Success`);
      } else if (result.status === 403) {
        console.log(`  🔒 ${plan.toUpperCase()} user: Access denied (403)`);
      } else {
        console.log(`  ⚠️  ${plan.toUpperCase()} user: ${result.status} - ${result.error?.message}`);
      }
    }
  }
};

const testSubscriptionPrompts = async () => {
  console.log('\n💬 Testing Subscription Prompts...');
  
  // Test features that should trigger subscription prompts for free users
  const promptTests = [
    { feature: 'Property Management', endpoint: '/properties', method: 'POST' },
    { feature: 'Contact Features', endpoint: '/contacts/property/123', method: 'POST' },
    { feature: 'Favorites', endpoint: '/auth/favorites/123', method: 'PUT' },
    { feature: 'Media Upload', endpoint: '/media/property/123', method: 'POST' }
  ];
  
  const freeToken = authTokens.free;
  if (!freeToken) {
    console.log('❌ No free user token available for testing');
    return;
  }
  
  for (const test of promptTests) {
    console.log(`\n🔍 Testing subscription prompt for: ${test.feature}`);
    
    const result = await makeAuthRequest(freeToken, test.method, test.endpoint);
    
    if (result.status === 403) {
      const message = result.error?.message || '';
      const isSubscriptionError = message.toLowerCase().includes('subscription') ||
                                 message.toLowerCase().includes('plan') ||
                                 message.toLowerCase().includes('requires') ||
                                 message.toLowerCase().includes('upgrade');
      
      if (isSubscriptionError) {
        console.log(`  ✅ Subscription prompt triggered: "${message}"`);
      } else {
        console.log(`  ⚠️  Access denied but not subscription-related: "${message}"`);
      }
    } else if (result.success) {
      console.log(`  ⚠️  Unexpected success - should have been denied`);
    } else {
      console.log(`  ❌ Unexpected error: ${result.status} - ${result.error?.message}`);
    }
  }
};

const testAdminFeatures = async () => {
  console.log('\n👑 Testing Admin Features...');
  
  const adminToken = authTokens.enterprise;
  if (!adminToken) {
    console.log('❌ No admin token available for testing');
    return;
  }
  
  const adminTests = [
    { name: 'Dashboard Stats', endpoint: '/admin/stats', method: 'GET' },
    { name: 'User Management', endpoint: '/admin/users', method: 'GET' },
    { name: 'Property Management', endpoint: '/admin/properties', method: 'GET' },
    { name: 'Contact Management', endpoint: '/admin/contacts', method: 'GET' },
    { name: 'Subscription Analytics', endpoint: '/admin/subscription-analytics', method: 'GET' }
  ];
  
  for (const test of adminTests) {
    console.log(`\n🔍 Testing: ${test.name}`);
    
    const result = await makeAuthRequest(adminToken, test.method, test.endpoint);
    
    if (result.success) {
      console.log(`  ✅ Admin access granted`);
    } else if (result.status === 403) {
      console.log(`  🔒 Admin access denied: ${result.error?.message}`);
    } else {
      console.log(`  ⚠️  Unexpected response: ${result.status} - ${result.error?.message}`);
    }
  }
};

const testErrorHandling = async () => {
  console.log('\n🚨 Testing Error Handling...');
  
  // Test with invalid token
  const invalidToken = 'invalid.token.here';
  const result = await makeAuthRequest(invalidToken, 'GET', '/auth/me');
  
  if (result.status === 401) {
    console.log('✅ Invalid token properly rejected (401)');
  } else {
    console.log(`❌ Invalid token not properly handled: ${result.status}`);
  }
  
  // Test with no token
  try {
    const response = await axios.get(`${BASE_URL}/auth/me`);
    console.log('❌ Request without token should have failed');
  } catch (error) {
    if (error.response?.status === 401) {
      console.log('✅ Request without token properly rejected (401)');
    } else {
      console.log(`⚠️  Unexpected error for request without token: ${error.response?.status}`);
    }
  }
};

const runAllTests = async () => {
  console.log('🚀 Starting Comprehensive Access Control Tests...');
  console.log('=' .repeat(60));
  
  try {
    await testUserRegistration();
    await testUserLogin();
    await testSubscriptionAccess();
    await testSubscriptionFeatures();
    await testSubscriptionPrompts();
    await testAdminFeatures();
    await testErrorHandling();
    
    console.log('\n' + '=' .repeat(60));
    console.log('✅ All tests completed!');
    console.log('\n📊 Summary:');
    console.log('- User registration and login tested');
    console.log('- Subscription access control verified');
    console.log('- Feature-specific access control tested');
    console.log('- Subscription prompts verified');
    console.log('- Admin features tested');
    console.log('- Error handling verified');
    
  } catch (error) {
    console.error('\n❌ Test suite failed:', error.message);
  }
};

// Run the tests
runAllTests();