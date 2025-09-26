#!/usr/bin/env node

/**
 * Squarefooot Railway Production Validation Script
 * Validates deployment for optimal speed, SEO, and SSR performance
 */

const https = require('https');
const http = require('http');

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://urban-realty-production.up.railway.app';
const API_URL = process.env.NEXT_PUBLIC_API_URL || `${BASE_URL}/api/v1`;

console.log('🚀 Starting Squarefooot Railway Production Validation...\n');

// Color codes for better output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(type, message) {
  const timestamp = new Date().toISOString();
  let color = colors.cyan;
  let prefix = 'INFO';
  
  switch (type) {
    case 'success':
      color = colors.green;
      prefix = 'SUCCESS';
      break;
    case 'error':
      color = colors.red;
      prefix = 'ERROR';
      break;
    case 'warning':
      color = colors.yellow;
      prefix = 'WARNING';
      break;
  }
  
  console.log(`${color}[${prefix}]${colors.reset} ${message}`);
}

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const protocol = url.startsWith('https://') ? https : http;
    
    const req = protocol.get(url, {
      timeout: 15000,
      headers: {
        'User-Agent': 'Squarefooot-Validation-Bot/1.0',
        'Accept': 'text/html,application/json,*/*',
        'Accept-Encoding': 'gzip, deflate, br',
        ...options.headers
      }
    }, (res) => {
      const duration = Date.now() - start;
      let data = '';
      
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data,
          duration,
          url
        });
      });
    });
    
    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

async function testEndpoint(name, url, expectedStatus = 200) {
  try {
    const response = await makeRequest(url);
    
    if (response.statusCode === expectedStatus) {
      log('success', `${name}: ✓ Status ${response.statusCode} (${response.duration}ms)`);
      return { success: true, duration: response.duration, response };
    } else {
      log('error', `${name}: ✗ Expected ${expectedStatus}, got ${response.statusCode}`);
      return { success: false, duration: response.duration, response };
    }
  } catch (error) {
    log('error', `${name}: ✗ ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function validateSSR() {
  log('info', '🖥️  Validating Server-Side Rendering...');
  
  try {
    const response = await makeRequest(BASE_URL);
    const html = response.data;
    
    // Check for SSR indicators
    const checks = [
      { name: 'HTML Structure', test: html.includes('<!DOCTYPE html>') },
      { name: 'Meta Tags', test: html.includes('<meta') && html.includes('name="description"') },
      { name: 'Title Tag', test: html.includes('<title>') },
      { name: 'Next.js SSR', test: html.includes('__NEXT_DATA__') },
      { name: 'Schema Markup', test: html.includes('application/ld+json') },
      { name: 'Open Graph', test: html.includes('og:title') || html.includes('property="og:') }
    ];
    
    const passed = checks.filter(check => check.test).length;
    const total = checks.length;
    
    if (passed === total) {
      log('success', `SSR Validation: ✓ All ${total} checks passed`);
    } else {
      log('warning', `SSR Validation: ⚠ ${passed}/${total} checks passed`);
      checks.forEach(check => {
        if (!check.test) {
          log('warning', `  - ${check.name}: Failed`);
        }
      });
    }
    
    return passed === total;
  } catch (error) {
    log('error', `SSR Validation: ✗ ${error.message}`);
    return false;
  }
}

async function validateSEO() {
  log('info', '🔍 Validating SEO Configuration...');
  
  const seoTests = [
    { name: 'Sitemap', url: `${BASE_URL}/sitemap.xml` },
    { name: 'Robots.txt', url: `${BASE_URL}/robots.txt` }
  ];
  
  const results = await Promise.all(
    seoTests.map(test => testEndpoint(test.name, test.url))
  );
  
  const passed = results.filter(r => r.success).length;
  log(passed === seoTests.length ? 'success' : 'warning', 
      `SEO Configuration: ${passed}/${seoTests.length} checks passed`);
  
  return passed === seoTests.length;
}

async function validateAPI() {
  log('info', '🔌 Validating API Endpoints...');
  
  const apiTests = [
    { name: 'Health Check', url: `${API_URL}/health` },
    { name: 'Properties Endpoint', url: `${API_URL}/properties?limit=1` },
    { name: 'Developers Endpoint', url: `${API_URL}/developers?limit=1` }
  ];
  
  const results = await Promise.all(
    apiTests.map(test => testEndpoint(test.name, test.url))
  );
  
  const passed = results.filter(r => r.success).length;
  log(passed === apiTests.length ? 'success' : 'warning', 
      `API Validation: ${passed}/${apiTests.length} endpoints working`);
  
  // Check API response times
  const slowEndpoints = results.filter(r => r.success && r.duration > 2000);
  if (slowEndpoints.length > 0) {
    log('warning', `⚠ Slow API endpoints detected:`);
    slowEndpoints.forEach(endpoint => {
      log('warning', `  - ${endpoint.response.url}: ${endpoint.duration}ms`);
    });
  }
  
  return passed === apiTests.length;
}

async function validatePerformance() {
  log('info', '⚡ Validating Performance...');
  
  const start = Date.now();
  const response = await makeRequest(BASE_URL);
  const loadTime = Date.now() - start;
  
  const performance = {
    loadTime,
    size: response.data.length,
    compression: response.headers['content-encoding'],
    caching: response.headers['cache-control']
  };
  
  // Performance checks
  const checks = [
    { name: 'Load Time < 3s', passed: loadTime < 3000 },
    { name: 'Compression Enabled', passed: !!performance.compression },
    { name: 'Caching Headers', passed: !!performance.caching },
    { name: 'Page Size < 500KB', passed: performance.size < 500000 }
  ];
  
  const passed = checks.filter(c => c.passed).length;
  
  log(passed === checks.length ? 'success' : 'warning', 
      `Performance: ${passed}/${checks.length} checks passed`);
  
  log('info', `  Load Time: ${loadTime}ms`);
  log('info', `  Page Size: ${(performance.size / 1024).toFixed(1)}KB`);
  log('info', `  Compression: ${performance.compression || 'None'}`);
  
  checks.forEach(check => {
    if (!check.passed) {
      log('warning', `  - ${check.name}: Failed`);
    }
  });
  
  return passed === checks.length;
}

async function validateSecurity() {
  log('info', '🔒 Validating Security Headers...');
  
  const response = await makeRequest(BASE_URL);
  const headers = response.headers;
  
  const securityChecks = [
    { name: 'X-Frame-Options', header: 'x-frame-options' },
    { name: 'X-Content-Type-Options', header: 'x-content-type-options' },
    { name: 'Content-Security-Policy', header: 'content-security-policy' },
    { name: 'X-XSS-Protection', header: 'x-xss-protection' },
    { name: 'Strict-Transport-Security', header: 'strict-transport-security' }
  ];
  
  const passed = securityChecks.filter(check => headers[check.header]).length;
  
  log(passed === securityChecks.length ? 'success' : 'warning', 
      `Security: ${passed}/${securityChecks.length} headers present`);
  
  securityChecks.forEach(check => {
    if (!headers[check.header]) {
      log('warning', `  - ${check.name}: Missing`);
    }
  });
  
  return passed === securityChecks.length;
}

async function main() {
  try {
    const validations = [
      { name: 'SSR', fn: validateSSR },
      { name: 'SEO', fn: validateSEO },
      { name: 'API', fn: validateAPI },
      { name: 'Performance', fn: validatePerformance },
      { name: 'Security', fn: validateSecurity }
    ];
    
    const results = [];
    
    for (const validation of validations) {
      const result = await validation.fn();
      results.push({ name: validation.name, passed: result });
      console.log(); // Add spacing
    }
    
    // Summary
    console.log('📊 Validation Summary:');
    console.log('='.repeat(50));
    
    const totalPassed = results.filter(r => r.passed).length;
    const totalTests = results.length;
    
    results.forEach(result => {
      const status = result.passed ? '✅ PASSED' : '❌ FAILED';
      log(result.passed ? 'success' : 'error', `${result.name}: ${status}`);
    });
    
    console.log();
    
    if (totalPassed === totalTests) {
      log('success', `🎉 All validations passed! Squarefooot is ready for production.`);
      log('success', `🚀 Application is optimized for speed, SEO, and SSR.`);
      process.exit(0);
    } else {
      log('warning', `⚠ ${totalPassed}/${totalTests} validations passed. Please review failed checks.`);
      process.exit(1);
    }
    
  } catch (error) {
    log('error', `Validation failed: ${error.message}`);
    process.exit(1);
  }
}

// Run validation
main().catch(console.error);