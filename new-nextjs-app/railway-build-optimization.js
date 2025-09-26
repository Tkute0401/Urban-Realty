#!/usr/bin/env node

/**
 * Railway Build Optimization Script for Squarefooot
 * 
 * This script optimizes the Next.js build process for Railway deployment by:
 * 1. Setting appropriate environment variables for build time
 * 2. Skipping static generation during build when API is not available
 * 3. Optimizing bundle size and performance
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Railway build environment detection
const isRailwayBuild = process.env.RAILWAY_ENVIRONMENT || process.env.RAILWAY_PROJECT_ID;
const nodeEnv = process.env.NODE_ENV || 'production';

console.log('🚂 Railway Build Optimization for Squarefooot');
console.log(`Environment: ${nodeEnv}`);
console.log(`Railway Build: ${isRailwayBuild ? 'Yes' : 'No'}`);

// Set build-time environment variables for optimal Railway deployment
process.env.NEXT_TELEMETRY_DISABLED = '1';
process.env.SKIP_ENV_VALIDATION = 'true';
process.env.DISABLE_ESLINT_PLUGIN = 'true';

// Optimize memory usage for Railway
process.env.NODE_OPTIONS = '--max-old-space-size=4096 --enable-source-maps=false';

// Set fallback API URL if not provided (Railway build optimization)
if (!process.env.NEXT_PUBLIC_API_URL && isRailwayBuild) {
  process.env.NEXT_PUBLIC_API_URL = 'https://urban-realty-production.up.railway.app/api/v1';
  console.log('✅ Set fallback API URL for Railway build');
}

// Ensure build output is optimized for Railway
if (!process.env.NEXT_PUBLIC_BASE_URL && isRailwayBuild) {
  process.env.NEXT_PUBLIC_BASE_URL = 'https://urban-realty-production.up.railway.app';
  console.log('✅ Set fallback base URL for Railway build');
}

try {
  console.log('🏗️ Starting optimized build process...');
  
  // Run the build with optimizations
  if (isRailwayBuild) {
    // Railway-specific build command
    execSync('npm run build:railway', { stdio: 'inherit' });
  } else {
    // Standard build
    execSync('npm run build', { stdio: 'inherit' });
  }
  
  console.log('✅ Build completed successfully!');
  
  // Post-build optimizations
  console.log('🔧 Running post-build optimizations...');
  
  // Check if .next directory exists
  const nextDir = path.join(__dirname, '.next');
  if (fs.existsSync(nextDir)) {
    // Get build stats
    const buildId = fs.readFileSync(path.join(nextDir, 'BUILD_ID'), 'utf8').trim();
    console.log(`📦 Build ID: ${buildId}`);
    
    // Check bundle sizes
    const staticDir = path.join(nextDir, 'static');
    if (fs.existsSync(staticDir)) {
      const stats = fs.statSync(staticDir);
      console.log(`📊 Static assets size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
    }
  }
  
  console.log('🎉 Railway optimization complete!');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  
  // Provide helpful debugging information
  console.log('\n🔍 Build Environment Debug Info:');
  console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
  console.log(`NEXT_PUBLIC_API_URL: ${process.env.NEXT_PUBLIC_API_URL}`);
  console.log(`NEXT_PUBLIC_BASE_URL: ${process.env.NEXT_PUBLIC_BASE_URL}`);
  console.log(`RAILWAY_ENVIRONMENT: ${process.env.RAILWAY_ENVIRONMENT}`);
  console.log(`RAILWAY_PROJECT_ID: ${process.env.RAILWAY_PROJECT_ID}`);
  
  process.exit(1);
}