const axios = require('axios');

// Test configuration
const BASE_URL = 'https://urban-realty-production.up.railway.app/api/v1';
const TEST_USER_EMAIL = 'test@example.com';
const TEST_USER_PASSWORD = 'password123';

// Test cases for different subscription levels
const testCases = [
  {
    name: 'Free Plan - Property Creation (Should Fail)',
    endpoint: '/properties',
    method: 'POST',
    data: {
      title: 'Test Property',
      description: 'Test Description',
      type: 'House',
      status: 'For Sale',
      price: 500000,
      bedrooms: 3,
      bathrooms: 2,
      area: 2000,
      address: '123 Test St'
    },
    expectedStatus: 403,
    expectedMessage: 'subscription'
  },
  {
    name: 'Free Plan - Contact Request (Should Fail)',
    endpoint: '/properties/123/contact',
    method: 'POST',
    data: {
      message: 'Test contact request',
      contactMethod: 'email'
    },
    expectedStatus: 403,
    expectedMessage: 'subscription'
  },
  {
    name: 'Free Plan - Media Upload (Should Fail)',
    endpoint: '/media/property/123',
    method: 'POST',
    data: new FormData(),
    expectedStatus: 403,
    expectedMessage: 'subscription'
  },
  {
    name: 'Free Plan - Developer Creation (Should Fail)',
    endpoint: '/developers',
    method: 'POST',
    data: {
      name: 'Test Developer',
      description: 'Test Developer Description'
    },
    expectedStatus: 403,
    expectedMessage: 'subscription'
  },
  {
    name: 'Free Plan - Admin Features (Should Fail)',
    endpoint: '/admin/users',
    method: 'GET',
    expectedStatus: 403,
    expectedMessage: 'subscription'
  },
  {
    name: 'Free Plan - CRM Features (Should Fail)',
    endpoint: '/admin/contacts',
    method: 'GET',
    expectedStatus: 403,
    expectedMessage: 'subscription'
  },
  {
    name: 'Free Plan - Analytics (Should Fail)',
    endpoint: '/admin/stats',
    method: 'GET',
    expectedStatus: 403,
    expectedMessage: 'subscription'
  },
  {
    name: 'Free Plan - Customization (Should Fail)',
    endpoint: '/admin/fields',
    method: 'GET',
    expectedStatus: 403,
    expectedMessage: 'subscription'
  }
];

async function loginUser() {
  try {
    console.log('🔐 Logging in test user...');
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email: TEST_USER_EMAIL,
      password: TEST_USER_PASSWORD
    });
    
    const token = response.data.token;
    console.log('✅ Login successful');
    return token;
  } catch (error) {
    console.error('❌ Login failed:', error.response?.data?.message || error.message);
    return null;
  }
}

async function testEndpoint(testCase, token) {
  try {
    console.log(`\n🧪 Testing: ${testCase.name}`);
    
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };

    let response;
    if (testCase.method === 'GET') {
      response = await axios.get(`${BASE_URL}${testCase.endpoint}`, config);
    } else if (testCase.method === 'POST') {
      response = await axios.post(`${BASE_URL}${testCase.endpoint}`, testCase.data, config);
    } else if (testCase.method === 'PUT') {
      response = await axios.put(`${BASE_URL}${testCase.endpoint}`, testCase.data, config);
    } else if (testCase.method === 'DELETE') {
      response = await axios.delete(`${BASE_URL}${testCase.endpoint}`, config);
    }

    // If we get here, the request succeeded (which might be unexpected)
    console.log(`⚠️  Unexpected success: ${testCase.name}`);
    console.log(`   Status: ${response.status}`);
    return false;
  } catch (error) {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message;
    
    console.log(`   Status: ${status}`);
    console.log(`   Message: ${message}`);
    
    // Check if the error matches our expectations
    const isExpectedStatus = status === testCase.expectedStatus;
    const isExpectedMessage = message.toLowerCase().includes(testCase.expectedMessage.toLowerCase());
    
    if (isExpectedStatus && isExpectedMessage) {
      console.log(`✅ Test passed: Access correctly denied`);
      return true;
    } else {
      console.log(`❌ Test failed: Unexpected error`);
      console.log(`   Expected status: ${testCase.expectedStatus}, got: ${status}`);
      console.log(`   Expected message to contain: "${testCase.expectedMessage}"`);
      return false;
    }
  }
}

async function testPublicEndpoints() {
  console.log('\n🌐 Testing public endpoints (should work without subscription)...');
  
  const publicEndpoints = [
    { name: 'Get Properties', endpoint: '/properties', method: 'GET' },
    { name: 'Get Featured Properties', endpoint: '/properties/featured', method: 'GET' },
    { name: 'Get Subscriptions', endpoint: '/subscriptions', method: 'GET' },
    { name: 'Get Developers', endpoint: '/developers', method: 'GET' }
  ];

  let passed = 0;
  let total = publicEndpoints.length;

  for (const endpoint of publicEndpoints) {
    try {
      console.log(`\n🧪 Testing: ${endpoint.name}`);
      const response = await axios.get(`${BASE_URL}${endpoint.endpoint}`);
      console.log(`   Status: ${response.status}`);
      console.log(`✅ Test passed: Public endpoint accessible`);
      passed++;
    } catch (error) {
      console.log(`   Status: ${error.response?.status}`);
      console.log(`   Message: ${error.response?.data?.message || error.message}`);
      console.log(`❌ Test failed: Public endpoint should be accessible`);
    }
  }

  console.log(`\n📊 Public endpoints summary: ${passed}/${total} passed`);
  return passed === total;
}

async function testSubscriptionEndpoints(token) {
  console.log('\n🔒 Testing subscription endpoints...');
  
  const subscriptionEndpoints = [
    { name: 'Get My Subscription', endpoint: '/subscriptions/my-subscription', method: 'GET' },
    { name: 'Check Feature Access', endpoint: '/subscriptions/check-feature/contact', method: 'GET' },
    { name: 'Check Listing Limit', endpoint: '/subscriptions/listing-limit', method: 'GET' },
    { name: 'Get Billing History', endpoint: '/subscriptions/billing-history', method: 'GET' }
  ];

  let passed = 0;
  let total = subscriptionEndpoints.length;

  for (const endpoint of subscriptionEndpoints) {
    try {
      console.log(`\n🧪 Testing: ${endpoint.name}`);
      const response = await axios.get(`${BASE_URL}${endpoint.endpoint}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      console.log(`   Status: ${response.status}`);
      console.log(`   Data:`, response.data);
      console.log(`✅ Test passed: Subscription endpoint accessible`);
      passed++;
    } catch (error) {
      console.log(`   Status: ${error.response?.status}`);
      console.log(`   Message: ${error.response?.data?.message || error.message}`);
      console.log(`❌ Test failed: Subscription endpoint should be accessible for authenticated users`);
    }
  }

  console.log(`\n📊 Subscription endpoints summary: ${passed}/${total} passed`);
  return passed === total;
}

async function runTests() {
  console.log('🚀 Starting Access Control Tests...\n');
  
  // Test public endpoints first
  const publicTestsPassed = await testPublicEndpoints();
  
  // Login to test protected endpoints
  const token = await loginUser();
  if (!token) {
    console.log('❌ Cannot proceed with tests without authentication');
    return;
  }

  // Test subscription endpoints
  const subscriptionTestsPassed = await testSubscriptionEndpoints(token);
  
  // Test access control
  console.log('\n🔐 Testing Access Control...');
  let passed = 0;
  let total = testCases.length;

  for (const testCase of testCases) {
    const result = await testEndpoint(testCase, token);
    if (result) passed++;
  }

  console.log(`\n📊 Access Control Tests Summary:`);
  console.log(`   Public endpoints: ${publicTestsPassed ? '✅ PASSED' : '❌ FAILED'}`);
  console.log(`   Subscription endpoints: ${subscriptionTestsPassed ? '✅ PASSED' : '❌ FAILED'}`);
  console.log(`   Access control: ${passed}/${total} passed`);
  
  const overallSuccess = publicTestsPassed && subscriptionTestsPassed && passed === total;
  console.log(`\n🎯 Overall Result: ${overallSuccess ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);
  
  if (overallSuccess) {
    console.log('\n🎉 Access control system is working correctly!');
    console.log('   - Public endpoints are accessible');
    console.log('   - Subscription endpoints work for authenticated users');
    console.log('   - Protected features correctly require subscription upgrades');
  } else {
    console.log('\n⚠️  Some issues detected with the access control system');
  }
}

// Run the tests
runTests().catch(console.error);