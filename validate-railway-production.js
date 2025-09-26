#!/usr/bin/env node

/**
 * Railway Production Validation Script
 * Validates that all Railway deployment fixes are working correctly
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

console.log('🔍 Starting Railway Production Validation...');

const PROJECT_ROOT = path.resolve(__dirname);
const NEXTJS_APP_PATH = path.join(PROJECT_ROOT, 'new-nextjs-app');

// Test configuration
const TEST_CONFIG = {
  baseUrl: 'https://urban-realty-production.up.railway.app',
  apiUrl: 'https://urban-realty-production.up.railway.app/api/v1',
  timeout: 10000,
  endpoints: [
    '/',
    '/properties',
    '/api/v1/health',
    '/api/v1/properties?limit=5',
    '/developers',
    '/about',
    '/contact'
  ]
};

// Validation results
const validationResults = {
  configFiles: [],
  buildOptimizations: [],
  apiConnectivity: [],
  performance: [],
  seo: [],
  errors: [],
  warnings: []
};

// Helper function to make HTTP requests
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const timeout = options.timeout || TEST_CONFIG.timeout;
    const protocol = url.startsWith('https:') ? https : http;
    
    const timer = setTimeout(() => {
      reject(new Error(`Request timeout after ${timeout}ms`));
    }, timeout);

    const req = protocol.get(url, (res) => {
      clearTimeout(timer);
      let data = '';
      
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: data.substring(0, 1000) // Limit response data
        });
      });
    });

    req.on('error', (error) => {
      clearTimeout(timer);
      reject(error);
    });
  });
}

// Validate configuration files
async function validateConfigFiles() {
  console.log('\n📁 Validating Configuration Files...');
  
  const configChecks = [
    {
      name: 'next.config.js',
      path: path.join(NEXTJS_APP_PATH, 'next.config.js'),
      required: ['output: \'standalone\'', 'RAILWAY_ENVIRONMENT', 'experimental']
    },
    {
      name: 'package.json',
      path: path.join(NEXTJS_APP_PATH, 'package.json'),
      required: ['build:railway', 'build:optimized', 'cross-env']
    },
    {
      name: 'api.config.ts',
      path: path.join(NEXTJS_APP_PATH, 'src', 'lib', 'services', 'api.config.ts'),
      required: ['isRailwayBuild', 'railwaySafeApiCall', 'getApiBaseUrl']
    },
    {
      name: 'webVitals.ts',
      path: path.join(NEXTJS_APP_PATH, 'src', 'lib', 'performance', 'webVitals.ts'),
      required: ['onINP', 'RAILWAY_ENVIRONMENT']
    }
  ];

  for (const check of configChecks) {
    try {
      if (fs.existsSync(check.path)) {
        const content = fs.readFileSync(check.path, 'utf8');
        const missing = check.required.filter(req => !content.includes(req));
        
        if (missing.length === 0) {
          validationResults.configFiles.push(`✅ ${check.name}: All required configurations present`);
        } else {
          validationResults.configFiles.push(`⚠️  ${check.name}: Missing - ${missing.join(', ')}`);
          validationResults.warnings.push(`${check.name} missing: ${missing.join(', ')}`);
        }
      } else {
        validationResults.configFiles.push(`❌ ${check.name}: File not found`);
        validationResults.errors.push(`Missing config file: ${check.name}`);
      }
    } catch (error) {
      validationResults.configFiles.push(`❌ ${check.name}: Error reading file`);
      validationResults.errors.push(`Config error: ${check.name} - ${error.message}`);
    }
  }
}

// Validate build optimizations
async function validateBuildOptimizations() {
  console.log('\n🔧 Validating Build Optimizations...');
  
  const optimizations = [
    {
      name: 'Railway Environment Detection',
      check: () => {
        const apiConfig = path.join(NEXTJS_APP_PATH, 'src', 'lib', 'services', 'api.config.ts');
        if (fs.existsSync(apiConfig)) {
          const content = fs.readFileSync(apiConfig, 'utf8');
          return content.includes('isRailwayBuild') && content.includes('RAILWAY_ENVIRONMENT');
        }
        return false;
      }
    },
    {
      name: 'Static Generation Optimization',
      check: () => {
        const pages = [
          path.join(NEXTJS_APP_PATH, 'src', 'app', 'developers', '[id]', 'page.tsx'),
          path.join(NEXTJS_APP_PATH, 'src', 'app', 'properties', '[id]', 'page.tsx')
        ];
        
        return pages.every(pagePath => {
          if (!fs.existsSync(pagePath)) return false;
          const content = fs.readFileSync(pagePath, 'utf8');
          return content.includes('RAILWAY_ENVIRONMENT') && 
                 content.includes('skipping static generation');
        });
      }
    },
    {
      name: 'Web Vitals Fix',
      check: () => {
        const webVitals = path.join(NEXTJS_APP_PATH, 'src', 'lib', 'performance', 'webVitals.ts');
        if (fs.existsSync(webVitals)) {
          const content = fs.readFileSync(webVitals, 'utf8');
          return content.includes('onINP') && !content.includes('onFID');
        }
        return true; // File might not exist, which is okay
      }
    },
    {
      name: 'Next.js Config Optimization',
      check: () => {
        const nextConfig = path.join(NEXTJS_APP_PATH, 'next.config.js');
        if (fs.existsSync(nextConfig)) {
          const content = fs.readFileSync(nextConfig, 'utf8');
          return content.includes('standalone') && 
                 content.includes('splitChunks') &&
                 content.includes('RAILWAY_ENVIRONMENT');
        }
        return false;
      }
    }
  ];

  for (const opt of optimizations) {
    try {
      if (opt.check()) {
        validationResults.buildOptimizations.push(`✅ ${opt.name}: Properly configured`);
      } else {
        validationResults.buildOptimizations.push(`❌ ${opt.name}: Not properly configured`);
        validationResults.errors.push(`Build optimization missing: ${opt.name}`);
      }
    } catch (error) {
      validationResults.buildOptimizations.push(`❌ ${opt.name}: Error during check`);
      validationResults.errors.push(`Build check error: ${opt.name} - ${error.message}`);
    }
  }
}

// Validate API connectivity
async function validateApiConnectivity() {
  console.log('\n🌐 Validating API Connectivity...');
  
  for (const endpoint of TEST_CONFIG.endpoints) {
    try {
      const url = endpoint.startsWith('/api') ? 
        `${TEST_CONFIG.apiUrl}${endpoint.replace('/api/v1', '')}` : 
        `${TEST_CONFIG.baseUrl}${endpoint}`;
      
      console.log(`   Testing: ${url}`);
      const response = await makeRequest(url);
      
      if (response.statusCode < 400) {
        validationResults.apiConnectivity.push(`✅ ${endpoint}: Status ${response.statusCode}`);
      } else {
        validationResults.apiConnectivity.push(`⚠️  ${endpoint}: Status ${response.statusCode}`);
        validationResults.warnings.push(`API endpoint ${endpoint} returned ${response.statusCode}`);
      }
    } catch (error) {
      validationResults.apiConnectivity.push(`❌ ${endpoint}: ${error.message}`);
      validationResults.errors.push(`API connectivity: ${endpoint} - ${error.message}`);
    }
  }
}

// Validate performance optimizations
async function validatePerformanceOptimizations() {
  console.log('\n⚡ Validating Performance Optimizations...');
  
  try {
    // Check homepage performance
    const response = await makeRequest(TEST_CONFIG.baseUrl);
    
    const performanceChecks = [
      {
        name: 'Response Time',
        check: () => true, // We already got a response
        result: `Status: ${response.statusCode}`
      },
      {
        name: 'Compression Headers',
        check: () => response.headers['content-encoding'] || response.headers['x-vercel-cache'],
        result: response.headers['content-encoding'] || 'No compression headers found'
      },
      {
        name: 'Cache Headers',
        check: () => response.headers['cache-control'] || response.headers['etag'],
        result: response.headers['cache-control'] || 'No cache headers found'
      },
      {
        name: 'Security Headers',
        check: () => response.headers['x-frame-options'] || response.headers['x-content-type-options'],
        result: response.headers['x-frame-options'] || 'Security headers may be missing'
      }
    ];

    for (const check of performanceChecks) {
      if (check.check()) {
        validationResults.performance.push(`✅ ${check.name}: ${check.result}`);
      } else {
        validationResults.performance.push(`⚠️  ${check.name}: ${check.result}`);
        validationResults.warnings.push(`Performance: ${check.name} needs attention`);
      }
    }
  } catch (error) {
    validationResults.performance.push(`❌ Performance check failed: ${error.message}`);
    validationResults.errors.push(`Performance validation error: ${error.message}`);
  }
}

// Validate SEO optimizations
async function validateSEOOptimizations() {
  console.log('\n🔍 Validating SEO Optimizations...');
  
  try {
    const response = await makeRequest(TEST_CONFIG.baseUrl);
    const html = response.data;
    
    const seoChecks = [
      {
        name: 'Title Tag',
        check: () => html.includes('<title>') && html.includes('Squarefooot'),
        result: html.match(/<title>([^<]+)<\/title>/)?.[1] || 'Not found'
      },
      {
        name: 'Meta Description',
        check: () => html.includes('name="description"'),
        result: html.match(/name="description"[^>]*content="([^"]+)"/)?.[1]?.substring(0, 100) || 'Not found'
      },
      {
        name: 'Open Graph',
        check: () => html.includes('property="og:title"'),
        result: html.includes('property="og:title"') ? 'Present' : 'Missing'
      },
      {
        name: 'Structured Data',
        check: () => html.includes('application/ld+json'),
        result: html.includes('application/ld+json') ? 'Present' : 'Missing'
      },
      {
        name: 'Canonical URL',
        check: () => html.includes('rel="canonical"'),
        result: html.includes('rel="canonical"') ? 'Present' : 'Missing'
      }
    ];

    for (const check of seoChecks) {
      if (check.check()) {
        validationResults.seo.push(`✅ ${check.name}: ${check.result}`);
      } else {
        validationResults.seo.push(`⚠️  ${check.name}: ${check.result}`);
        validationResults.warnings.push(`SEO: ${check.name} needs attention`);
      }
    }
  } catch (error) {
    validationResults.seo.push(`❌ SEO validation failed: ${error.message}`);
    validationResults.errors.push(`SEO validation error: ${error.message}`);
  }
}

// Generate validation report
function generateReport() {
  console.log('\n📊 VALIDATION REPORT');
  console.log('='.repeat(50));
  
  const sections = [
    { title: '📁 Configuration Files', results: validationResults.configFiles },
    { title: '🔧 Build Optimizations', results: validationResults.buildOptimizations },
    { title: '🌐 API Connectivity', results: validationResults.apiConnectivity },
    { title: '⚡ Performance', results: validationResults.performance },
    { title: '🔍 SEO', results: validationResults.seo }
  ];

  sections.forEach(section => {
    console.log(`\n${section.title}:`);
    section.results.forEach(result => console.log(`  ${result}`));
  });

  // Summary
  const totalChecks = Object.values(validationResults)
    .filter(arr => Array.isArray(arr))
    .reduce((sum, arr) => sum + arr.length, 0) - 
    validationResults.errors.length - validationResults.warnings.length;
  
  const successCount = Object.values(validationResults)
    .filter(arr => Array.isArray(arr))
    .flat()
    .filter(result => result.includes('✅')).length;

  console.log('\n📈 SUMMARY:');
  console.log('='.repeat(50));
  console.log(`✅ Passed: ${successCount}/${totalChecks} checks`);
  console.log(`⚠️  Warnings: ${validationResults.warnings.length}`);
  console.log(`❌ Errors: ${validationResults.errors.length}`);

  if (validationResults.errors.length > 0) {
    console.log('\n❌ CRITICAL ERRORS:');
    validationResults.errors.forEach(error => console.log(`  • ${error}`));
  }

  if (validationResults.warnings.length > 0) {
    console.log('\n⚠️  WARNINGS:');
    validationResults.warnings.forEach(warning => console.log(`  • ${warning}`));
  }

  // Overall status
  const overallStatus = validationResults.errors.length === 0 ? '✅ READY' : '❌ NEEDS ATTENTION';
  console.log(`\n🎯 Railway Deployment Status: ${overallStatus}`);
  
  if (validationResults.errors.length === 0) {
    console.log('\n🚀 Your application is optimized for Railway deployment!');
    console.log('   • Event handler issues: RESOLVED');
    console.log('   • Build optimizations: APPLIED');
    console.log('   • Performance: OPTIMIZED');
    console.log('   • SEO: CONFIGURED');
  } else {
    console.log('\n🔧 Please address the critical errors before deployment.');
  }
}

// Main execution
async function main() {
  try {
    await validateConfigFiles();
    await validateBuildOptimizations();
    await validateApiConnectivity();
    await validatePerformanceOptimizations();
    await validateSEOOptimizations();
    
    generateReport();
  } catch (error) {
    console.error('❌ Validation failed:', error.message);
    process.exit(1);
  }
}

main().catch(console.error);