#!/usr/bin/env node

/**
 * Local Railway Build Simulation Test for Squarefooot
 * 
 * This script simulates a Railway build environment locally to test our fixes
 */

const { spawn } = require('child_process');
const path = require('path');

console.log('🚂 Railway Build Simulation Test for Squarefooot\n');

// Set Railway-like environment variables
process.env.NODE_ENV = 'production';
process.env.RAILWAY_ENVIRONMENT = 'production';
process.env.RAILWAY_PROJECT_ID = 'test-project';
process.env.NEXT_TELEMETRY_DISABLED = '1';
process.env.SKIP_ENV_VALIDATION = 'true';

// Set the required environment variables from your Railway setup
process.env.NEXT_PUBLIC_API_URL = 'https://urban-realty-production.up.railway.app/api/v1';
process.env.NEXT_PUBLIC_BASE_URL = 'https://urban-realty-production.up.railway.app';
process.env.MONGODB_URI = 'mongodb+srv://tanmay:1234@urbanrealty.rbqbb.mongodb.net/?retryWrites=true&w=majority&appName=UrbanRealty';
process.env.JWT_SECRET = 'ajlfncljbhvlaxbz.bziyglkbzkgt8pcgslfdkva@$%^&^@!$%^&*^%$*&^%$ugua9p7gtfklAURuifaJLgdciotefib';

console.log('Environment variables set:');
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`RAILWAY_ENVIRONMENT: ${process.env.RAILWAY_ENVIRONMENT}`);
console.log(`NEXT_PUBLIC_API_URL: ${process.env.NEXT_PUBLIC_API_URL}`);
console.log(`NEXT_PUBLIC_BASE_URL: ${process.env.NEXT_PUBLIC_BASE_URL}`);

const nextjsAppPath = path.join(__dirname, 'new-nextjs-app');

console.log(`\n📁 Building from: ${nextjsAppPath}`);
console.log('🏗️ Starting Railway build simulation...\n');

// Run the optimized build
const buildProcess = spawn('npm', ['run', 'build:railway'], {
  cwd: nextjsAppPath,
  stdio: 'inherit',
  env: process.env,
  shell: true
});

buildProcess.on('close', (code) => {
  if (code === 0) {
    console.log('\n✅ Railway build simulation successful!');
    console.log('🎉 The fixes should work on Railway deployment.');
    console.log('\n📝 Key fixes that resolved the issues:');
    console.log('  1. ✅ Web vitals: onFID → onINP');
    console.log('  2. ✅ Static generation: Skip during Railway build');
    console.log('  3. ✅ API config: Railway environment detection');
    console.log('  4. ✅ Build process: Optimized for Railway');
  } else {
    console.log(`\n❌ Build failed with exit code ${code}`);
    console.log('🔧 Check the error messages above for issues to fix.');
    process.exit(code);
  }
});

buildProcess.on('error', (error) => {
  console.error('❌ Failed to start build process:', error);
  process.exit(1);
});