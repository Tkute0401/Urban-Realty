#!/usr/bin/env node

/**
 * Test script to verify frontend API proxy is working
 */

const https = require('https');

const testUrl = 'https://urban-realty-production.up.railway.app';

async function testEndpoint(endpoint, description) {
  return new Promise((resolve) => {
    const url = `${testUrl}${endpoint}`;
    console.log(`\n🧪 Testing: ${description}`);
    console.log(`   GET ${url}`);
    
    const req = https.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          console.log(`   ✅ PASS - Status: ${res.statusCode}`);
          console.log(`   📄 Response: ${JSON.stringify(jsonData).substring(0, 200)}...`);
          resolve({ success: true, status: res.statusCode, data: jsonData });
        } catch (error) {
          console.log(`   ❌ FAIL - Invalid JSON: ${error.message}`);
          console.log(`   📄 Response: ${data.substring(0, 200)}...`);
          resolve({ success: false, status: res.statusCode, error: error.message });
        }
      });
    });
    
    req.on('error', (error) => {
      console.log(`   ❌ FAIL - Network Error: ${error.message}`);
      resolve({ success: false, error: error.message });
    });
    
    req.setTimeout(10000, () => {
      console.log(`   ❌ FAIL - Timeout`);
      req.destroy();
      resolve({ success: false, error: 'Timeout' });
    });
  });
}

async function runTests() {
  console.log('🚀 Starting Frontend API Tests');
  console.log(`🌐 Testing URL: ${testUrl}`);
  
  const tests = [
    { endpoint: '/api/v1/health', description: 'Health Check' },
    { endpoint: '/api/v1/properties', description: 'Properties List' },
    { endpoint: '/api/v1/properties/featured', description: 'Featured Properties' }
  ];
  
  const results = [];
  
  for (const test of tests) {
    const result = await testEndpoint(test.endpoint, test.description);
    results.push({ ...test, ...result });
  }
  
  // Summary
  const passed = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log('\n📊 Test Summary:');
  console.log(`   ✅ Passed: ${passed}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log(`   📈 Success Rate: ${Math.round((passed / results.length) * 100)}%`);
  
  if (failed > 0) {
    console.log('\n❌ Failed Tests:');
    results.filter(r => !r.success).forEach(test => {
      console.log(`   - ${test.description}: ${test.error || 'Unknown error'}`);
    });
  }
  
  // Test specific property details
  if (results[1]?.success && results[1].data?.data?.length > 0) {
    const firstProperty = results[1].data.data[0];
    console.log(`\n🔍 Testing Property Details for: ${firstProperty._id}`);
    const propertyResult = await testEndpoint(`/api/v1/properties/${firstProperty._id}`, 'Property Details');
    results.push({ 
      endpoint: `/api/v1/properties/${firstProperty._id}`, 
      description: 'Property Details',
      ...propertyResult 
    });
  }
  
  console.log('\n✅ Frontend API tests completed!');
}

runTests().catch(console.error);