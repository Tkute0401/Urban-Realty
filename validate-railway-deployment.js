#!/usr/bin/env node

/**
 * Railway Deployment Validation Script
 * Tests the deployment without starting local servers
 */

const https = require('https');
const http = require('http');

const baseUrl = 'https://urban-realty-production.up.railway.app';
const apiUrl = 'https://urban-realty-production.up.railway.app/api/v1';

console.log('🚀 Validating Railway deployment for Squarefooot...\n');

// Helper function to make HTTP requests
function makeRequest(url, timeout = 10000) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const startTime = Date.now();
    
    const req = client.request(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Deployment-Validator/1.0',
        'Accept': 'text/html,application/json,*/*'
      },
      timeout
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const responseTime = Date.now() - startTime;
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data,
          responseTime
        });
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error(`Request timeout after ${timeout}ms`));
    });

    req.end();
  });
}

async function validateHomepage() {
  console.log('🏠 Testing homepage...');
  try {
    const response = await makeRequest(baseUrl);
    
    if (response.statusCode === 200) {
      console.log(`✅ Homepage loaded successfully (${response.responseTime}ms)`);
      
      // Check for SEO elements
      const hasTitle = response.data.includes('<title>') && response.data.includes('Squarefooot');
      const hasMeta = response.data.includes('meta name="description"');
      
      console.log(`   📄 Title tag: ${hasTitle ? '✅' : '❌'}`);
      console.log(`   🏷️  Meta description: ${hasMeta ? '✅' : '❌'}`);
      
      // Check performance
      if (response.responseTime < 3000) {
        console.log(`   ⚡ Performance: ✅ (${response.responseTime}ms < 3000ms)`);
      } else {
        console.log(`   ⚡ Performance: ⚠️ (${response.responseTime}ms > 3000ms)`);
      }
      
      return true;
    } else {
      console.log(`❌ Homepage failed with status ${response.statusCode}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Homepage test failed: ${error.message}`);
    return false;
  }
}

async function validateAPI() {
  console.log('\n🔌 Testing API endpoints...');
  
  const endpoints = [
    { path: '/health', name: 'Health Check' },
    { path: '/properties', name: 'Properties API' },
  ];
  
  let successCount = 0;
  
  for (const endpoint of endpoints) {
    try {
      console.log(`   Testing ${endpoint.name}...`);
      const response = await makeRequest(`${apiUrl}${endpoint.path}`);
      
      if (response.statusCode === 200) {
        console.log(`   ✅ ${endpoint.name} working (${response.responseTime}ms)`);
        
        // Try to parse JSON if possible
        try {
          const json = JSON.parse(response.data);
          if (json.success || json.status === 'ok') {
            console.log(`      📊 Response structure: ✅`);
          }
        } catch (e) {
          // Not JSON, that's okay for some endpoints
        }
        
        successCount++;
      } else {
        console.log(`   ❌ ${endpoint.name} failed with status ${response.statusCode}`);
      }
    } catch (error) {
      console.log(`   ❌ ${endpoint.name} failed: ${error.message}`);
    }
  }
  
  return successCount === endpoints.length;
}

async function validateSecurity() {
  console.log('\n🔒 Testing security headers...');
  
  try {
    const response = await makeRequest(baseUrl);
    const headers = response.headers;
    
    const securityChecks = [
      { header: 'x-frame-options', name: 'X-Frame-Options' },
      { header: 'x-content-type-options', name: 'X-Content-Type-Options' },
      { header: 'x-xss-protection', name: 'X-XSS-Protection' },
      { header: 'referrer-policy', name: 'Referrer-Policy' }
    ];
    
    let secureHeaders = 0;
    
    securityChecks.forEach(check => {
      if (headers[check.header]) {
        console.log(`   ✅ ${check.name}: ${headers[check.header]}`);
        secureHeaders++;
      } else {
        console.log(`   ❌ ${check.name}: Not set`);
      }
    });
    
    console.log(`   🛡️  Security score: ${secureHeaders}/${securityChecks.length}`);
    return secureHeaders > 0;
    
  } catch (error) {
    console.log(`   ❌ Security test failed: ${error.message}`);
    return false;
  }
}

async function validatePerformance() {
  console.log('\n⚡ Testing performance...');
  
  const tests = [];
  
  for (let i = 0; i < 3; i++) {
    try {
      const response = await makeRequest(baseUrl);
      if (response.statusCode === 200) {
        tests.push(response.responseTime);
      }
    } catch (error) {
      console.log(`   ⚠️ Performance test ${i + 1} failed: ${error.message}`);
    }
  }
  
  if (tests.length > 0) {
    const avgTime = tests.reduce((sum, time) => sum + time, 0) / tests.length;
    const minTime = Math.min(...tests);
    const maxTime = Math.max(...tests);
    
    console.log(`   📊 Average response time: ${Math.round(avgTime)}ms`);
    console.log(`   📊 Fastest response: ${minTime}ms`);
    console.log(`   📊 Slowest response: ${maxTime}ms`);
    
    if (avgTime < 2000) {
      console.log(`   ✅ Performance excellent (< 2s)`);
      return true;
    } else if (avgTime < 3000) {
      console.log(`   ✅ Performance good (< 3s)`);
      return true;
    } else {
      console.log(`   ⚠️ Performance needs improvement (> 3s)`);
      return false;
    }
  } else {
    console.log(`   ❌ Performance tests failed`);
    return false;
  }
}

async function runValidation() {
  console.log(`Target URL: ${baseUrl}`);
  console.log(`API URL: ${apiUrl}\n`);
  
  const results = {
    homepage: await validateHomepage(),
    api: await validateAPI(),
    security: await validateSecurity(),
    performance: await validatePerformance()
  };
  
  console.log('\n📋 Validation Summary:');
  console.log(`   🏠 Homepage: ${results.homepage ? '✅' : '❌'}`);
  console.log(`   🔌 API: ${results.api ? '✅' : '❌'}`);
  console.log(`   🔒 Security: ${results.security ? '✅' : '❌'}`);
  console.log(`   ⚡ Performance: ${results.performance ? '✅' : '❌'}`);
  
  const passed = Object.values(results).filter(Boolean).length;
  const total = Object.values(results).length;
  
  console.log(`\n🎯 Overall Score: ${passed}/${total}`);
  
  if (passed === total) {
    console.log('🎉 All deployment validations passed!');
    process.exit(0);
  } else if (passed >= 2) {
    console.log('⚠️ Deployment working but has some issues');
    process.exit(0);
  } else {
    console.log('❌ Deployment has critical issues');
    process.exit(1);
  }
}

// Run validation
runValidation().catch(error => {
  console.error('💥 Validation script failed:', error);
  process.exit(1);
});