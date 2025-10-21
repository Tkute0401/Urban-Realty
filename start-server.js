#!/usr/bin/env node

/**
 * Railway Production Startup Script
 * Ensures Next.js is built before starting the Express server
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 Starting Urban Realty Server...');

// Check if we're in production
const isProduction = process.env.NODE_ENV === 'production';

if (isProduction) {
  console.log('📦 Production mode detected, building Next.js...');
  
  try {
    // Use the build script
    console.log('🔨 Running Next.js build script...');
    execSync('node build-nextjs.js', { 
      cwd: __dirname, 
      stdio: 'inherit' 
    });
    
    console.log('✅ Next.js build completed successfully');
  } catch (error) {
    console.error('❌ Failed to build Next.js:', error.message);
    console.log('⚠️  Continuing with server startup (some features may not work)');
  }
} else {
  console.log('🔧 Development mode detected, skipping Next.js build');
}

// Start the Express server
console.log('🚀 Starting Express server...');
require('./server.js');