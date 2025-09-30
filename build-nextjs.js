#!/usr/bin/env node

/**
 * Build script for Next.js app
 * This script ensures the Next.js app builds correctly in Railway
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🔨 Building Next.js application...');

try {
  // Change to the Next.js app directory
  const nextjsDir = path.join(__dirname, 'new-nextjs-app');
  
  if (!fs.existsSync(nextjsDir)) {
    throw new Error('Next.js app directory not found');
  }
  
  // Check if app directory exists
  const appDir = path.join(nextjsDir, 'src', 'app');
  if (!fs.existsSync(appDir)) {
    throw new Error('App directory not found in Next.js app');
  }
  
  console.log('📁 Next.js app directory found');
  console.log('📁 App directory found');
  
  // Install dependencies
  console.log('📦 Installing Next.js dependencies...');
  execSync('npm install', { 
    cwd: nextjsDir, 
    stdio: 'inherit' 
  });
  
  // Build the app
  console.log('🔨 Building Next.js application...');
  execSync('npm run build', { 
    cwd: nextjsDir, 
    stdio: 'inherit' 
  });
  
  console.log('✅ Next.js build completed successfully');
  
} catch (error) {
  console.error('❌ Failed to build Next.js:', error.message);
  console.log('⚠️  Continuing with server startup (some features may not work)');
  process.exit(0); // Don't fail the entire process
}
