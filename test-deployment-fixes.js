#!/usr/bin/env node

/**
 * Test script to verify deployment fixes
 * This script tests the API endpoints to ensure they're working correctly
 */

const https = require('https');
const http = require('http');

const BASE_URL = process.env.TEST_URL || 'https://www.squarefooot.com';
const TIMEOUT = 10000;

// Helper function to make HTTP requests
function makeRequest(url, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === 'https:';
    const client = isHttps ? https : http;
    
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Deployment-Test-Script/1.0'
      },
      timeout: TIMEOUT
    };

    const req = client.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: jsonData
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: data
          });
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

// Test functions
async function testHealthEndpoint() {
  console.log('🔍 Testing health endpoint...');
  try {
    const response = await makeRequest(`${BASE_URL}/api/v1/health`);
    console.log('✅ Health endpoint:', response.status, response.data);
    return response.status === 200;
  } catch (error) {
    console.error('❌ Health endpoint failed:', error.message);
    return false;
  }
}

async function testDebugEndpoint() {
  console.log('🔍 Testing debug endpoint...');
  try {
    const response = await makeRequest(`${BASE_URL}/api/v1/debug`);
    console.log('✅ Debug endpoint:', response.status, response.data);
    return response.status === 200;
  } catch (error) {
    console.error('❌ Debug endpoint failed:', error.message);
    return false;
  }
}

async function testPropertiesEndpoint() {
  console.log('🔍 Testing properties endpoint...');
  try {
    const response = await makeRequest(`${BASE_URL}/api/v1/properties`);
    console.log('✅ Properties endpoint:', response.status, response.data);
    return response.status === 200;
  } catch (error) {
    console.error('❌ Properties endpoint failed:', error.message);
    return false;
  }
}

async function testFeaturedPropertiesEndpoint() {
  console.log('🔍 Testing featured properties endpoint...');
  try {
    const response = await makeRequest(`${BASE_URL}/api/v1/properties/featured`);
    console.log('✅ Featured properties endpoint:', response.status, response.data);
    return response.status === 200;
  } catch (error) {
    console.error('❌ Featured properties endpoint failed:', error.message);
    return false;
  }
}

async function testAuthLoginEndpoint() {
  console.log('🔍 Testing auth login endpoint...');
  try {
    const response = await makeRequest(`${BASE_URL}/api/v1/auth/login`, 'POST', {
      email: 'test@example.com',
      password: 'testpassword'
    });
    console.log('✅ Auth login endpoint:', response.status, response.data);
    // We expect 401 for invalid credentials, which is fine
    return response.status === 401 || response.status === 200;
  } catch (error) {
    console.error('❌ Auth login endpoint failed:', error.message);
    return false;
  }
}

async function testPropertyById() {
  console.log('🔍 Testing property by ID endpoint...');
  try {
    // Test with a valid ObjectId format
    const testId = '507f1f77bcf86cd799439011';
    const response = await makeRequest(`${BASE_URL}/api/v1/properties/${testId}`);
    console.log('✅ Property by ID endpoint:', response.status, response.data);
    // We expect 404 for non-existent property, which is fine
    return response.status === 404 || response.status === 200;
  } catch (error) {
    console.error('❌ Property by ID endpoint failed:', error.message);
    return false;
  }
}

// Main test function
async function runTests() {
  console.log('🚀 Starting deployment tests...');
  console.log(`📍 Testing URL: ${BASE_URL}`);
  console.log('');

  const tests = [
    { name: 'Health Endpoint', fn: testHealthEndpoint },
    { name: 'Debug Endpoint', fn: testDebugEndpoint },
    { name: 'Properties Endpoint', fn: testPropertiesEndpoint },
    { name: 'Featured Properties Endpoint', fn: testFeaturedPropertiesEndpoint },
    { name: 'Auth Login Endpoint', fn: testAuthLoginEndpoint },
    { name: 'Property by ID Endpoint', fn: testPropertyById }
  ];

  const results = [];
  
  for (const test of tests) {
    try {
      const passed = await test.fn();
      results.push({ name: test.name, passed });
      console.log('');
    } catch (error) {
      console.error(`❌ ${test.name} crashed:`, error.message);
      results.push({ name: test.name, passed: false });
      console.log('');
    }
  }

  // Summary
  console.log('📊 Test Results Summary:');
  console.log('========================');
  
  const passed = results.filter(r => r.passed).length;
  const total = results.length;
  
  results.forEach(result => {
    const status = result.passed ? '✅ PASS' : '❌ FAIL';
    console.log(`${status} ${result.name}`);
  });
  
  console.log('');
  console.log(`🎯 Overall: ${passed}/${total} tests passed`);
  
  if (passed === total) {
    console.log('🎉 All tests passed! Deployment fixes are working correctly.');
    process.exit(0);
  } else {
    console.log('⚠️  Some tests failed. Please check the logs above.');
    process.exit(1);
  }
}

// Run tests
runTests().catch(error => {
  console.error('💥 Test suite crashed:', error);
  process.exit(1);
});
