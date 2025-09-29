#!/usr/bin/env node

/**
 * Railway Deployment Test Script
 * This script tests the key endpoints to ensure the deployment is working correctly
 */

const https = require('https');
const http = require('http');

// Configuration
const RAILWAY_URL = process.env.RAILWAY_URL || 'https://urban-realty-production.up.railway.app';
const TIMEOUT = 10000; // 10 seconds

// Test cases
const tests = [
  {
    name: 'Health Check',
    path: '/api/v1/health',
    method: 'GET',
    expectedStatus: 200
  },
  {
    name: 'API Test',
    path: '/api/v1/test',
    method: 'GET',
    expectedStatus: 200
  },
  {
    name: 'Properties List',
    path: '/api/v1/properties',
    method: 'GET',
    expectedStatus: 200
  },
  {
    name: 'CORS Preflight',
    path: '/api/v1/auth/login',
    method: 'OPTIONS',
    expectedStatus: 200
  }
];

// Helper function to make HTTP requests
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const isHttps = url.startsWith('https://');
    const client = isHttps ? https : http;
    
    const requestOptions = {
      timeout: TIMEOUT,
      headers: {
        'User-Agent': 'Railway-Deployment-Test/1.0',
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    const req = client.request(url, requestOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const jsonData = data ? JSON.parse(data) : null;
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: jsonData,
            rawData: data
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: null,
            rawData: data
          });
        }
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    if (options.body) {
      req.write(JSON.stringify(options.body));
    }

    req.end();
  });
}

// Run a single test
async function runTest(test) {
  const url = `${RAILWAY_URL}${test.path}`;
  const options = {
    method: test.method,
    headers: test.headers || {}
  };

  try {
    console.log(`🧪 Testing: ${test.name}`);
    console.log(`   ${test.method} ${url}`);
    
    const response = await makeRequest(url, options);
    
    if (response.status === test.expectedStatus) {
      console.log(`   ✅ PASS - Status: ${response.status}`);
      
      // Log response data for debugging
      if (response.data) {
        console.log(`   📄 Response: ${JSON.stringify(response.data).substring(0, 100)}...`);
      }
      
      return { success: true, test, response };
    } else {
      console.log(`   ❌ FAIL - Expected: ${test.expectedStatus}, Got: ${response.status}`);
      console.log(`   📄 Response: ${response.rawData.substring(0, 200)}...`);
      return { success: false, test, response };
    }
  } catch (error) {
    console.log(`   ❌ ERROR - ${error.message}`);
    return { success: false, test, error };
  }
}

// Main test runner
async function runAllTests() {
  console.log('🚀 Starting Railway Deployment Tests');
  console.log(`🌐 Testing URL: ${RAILWAY_URL}`);
  console.log('');

  const results = [];
  
  for (const test of tests) {
    const result = await runTest(test);
    results.push(result);
    console.log('');
  }

  // Summary
  const passed = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log('📊 Test Summary:');
  console.log(`   ✅ Passed: ${passed}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log(`   📈 Success Rate: ${Math.round((passed / results.length) * 100)}%`);
  
  if (failed > 0) {
    console.log('');
    console.log('❌ Failed Tests:');
    results.filter(r => !r.success).forEach(result => {
      console.log(`   - ${result.test.name}: ${result.error?.message || `Status ${result.response?.status}`}`);
    });
  }

  // Exit with appropriate code
  process.exit(failed > 0 ? 1 : 0);
}

// Handle command line arguments
if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.includes('--help') || args.includes('-h')) {
    console.log('Railway Deployment Test Script');
    console.log('');
    console.log('Usage: node test-railway-deployment.js [options]');
    console.log('');
    console.log('Options:');
    console.log('  --url <url>    Railway app URL (default: https://urban-realty-production.up.railway.app)');
    console.log('  --help, -h     Show this help message');
    console.log('');
    console.log('Environment Variables:');
    console.log('  RAILWAY_URL    Railway app URL to test');
    process.exit(0);
  }

  const urlIndex = args.indexOf('--url');
  if (urlIndex !== -1 && args[urlIndex + 1]) {
    process.env.RAILWAY_URL = args[urlIndex + 1];
  }

  runAllTests().catch(error => {
    console.error('💥 Test runner failed:', error);
    process.exit(1);
  });
}

module.exports = { runAllTests, runTest, makeRequest };