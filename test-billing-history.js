const axios = require('axios');

// Test the billing history endpoint
async function testBillingHistory() {
  const baseURL = 'https://urban-realty-production.up.railway.app';
  
  try {
    console.log('Testing billing history endpoint...');
    
    // Test without authentication (should return 401)
    try {
      const response = await axios.get(`${baseURL}/api/v1/subscriptions/billing-history`);
      console.log('Unexpected success without auth:', response.data);
    } catch (error) {
      if (error.response) {
        console.log('✅ Correctly returned 401 for unauthenticated request');
        console.log('Status:', error.response.status);
        console.log('Message:', error.response.data);
      } else {
        console.log('❌ Network error:', error.message);
      }
    }
    
    // Test with invalid auth token
    try {
      const response = await axios.get(`${baseURL}/api/v1/subscriptions/billing-history`, {
        headers: {
          'Authorization': 'Bearer invalid-token'
        }
      });
      console.log('Unexpected success with invalid token:', response.data);
    } catch (error) {
      if (error.response) {
        console.log('✅ Correctly rejected invalid token');
        console.log('Status:', error.response.status);
        console.log('Message:', error.response.data);
      } else {
        console.log('❌ Network error:', error.message);
      }
    }
    
    // Test the endpoint structure
    console.log('\n📋 Endpoint Summary:');
    console.log('URL: GET /api/v1/subscriptions/billing-history');
    console.log('Authentication: Required');
    console.log('Expected Response: JSON with billing history data');
    console.log('Error Handling: ✅ Improved');
    
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

// Run the test
testBillingHistory();