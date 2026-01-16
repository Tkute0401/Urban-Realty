#!/usr/bin/env node

/**
 * Local SEO, AEO, and GEO Testing Script
 * Tests the website running on localhost
 * 
 * Usage:
 *   1. Start your dev server: npm run dev
 *   2. Run this script: node scripts/test-seo-aeo-geo-local.js
 */

const { execSync } = require('child_process');
const http = require('http');

const LOCAL_URL = 'http://localhost:3000';
const TEST_PAGES = [
  '/',
  '/properties',
  '/properties/buy',
  '/properties/rent',
  '/about',
  '/contact',
  '/blog',
  '/developers',
  '/emi-calculator',
  '/career',
  '/how-we-work',
];

console.log('🔍 Local SEO, AEO, and GEO Testing');
console.log('='.repeat(60));
console.log(`📍 Testing: ${LOCAL_URL}`);
console.log('⚠️  Make sure your dev server is running (npm run dev)');
console.log('='.repeat(60));
console.log('');

// Check if server is running
function checkServer() {
  return new Promise((resolve) => {
    const req = http.request(`${LOCAL_URL}/`, { timeout: 2000 }, (res) => {
      resolve(res.statusCode === 200);
    });
    
    req.on('error', () => resolve(false));
    req.on('timeout', () => {
      req.destroy();
      resolve(false);
    });
    
    req.end();
  });
}

async function main() {
  console.log('Checking if server is running...');
  const isRunning = await checkServer();
  
  if (!isRunning) {
    console.log('❌ Server is not running!');
    console.log('');
    console.log('Please start your development server first:');
    console.log('  npm run dev');
    console.log('');
    console.log('Then run this script again.');
    process.exit(1);
  }
  
  console.log('✅ Server is running!');
  console.log('');
  console.log('Now running full SEO/AEO/GEO tests...');
  console.log('');
  
  // Set environment variable and run main test script
  process.env.TEST_BASE_URL = LOCAL_URL;
  
  try {
    require('./test-seo-aeo-geo.js');
  } catch (error) {
    console.error('Error running tests:', error.message);
    process.exit(1);
  }
}

main();



