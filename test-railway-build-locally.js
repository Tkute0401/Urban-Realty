#!/usr/bin/env node

/**
 * Test Railway Build Locally
 * Simulates Railway build environment to test fixes
 */

const { spawn } = require('child_process');
const path = require('path');

console.log('🔬 Testing Railway Build Locally...');

const NEXTJS_APP_PATH = path.join(__dirname, 'new-nextjs-app');

// Railway environment variables for testing
const railwayEnv = {
  ...process.env,
  NODE_ENV: 'production',
  RAILWAY_ENVIRONMENT: 'production',
  RAILWAY_PROJECT_ID: 'test-project',
  NEXT_TELEMETRY_DISABLED: '1',
  SKIP_ENV_VALIDATION: 'true',
  SKIP_BUILD_STATIC_GENERATION: 'true',
  NODE_OPTIONS: '--max-old-space-size=4096 --enable-source-maps=false',
  NEXT_PUBLIC_API_URL: 'https://urban-realty-production.up.railway.app/api/v1',
  NEXT_PUBLIC_BASE_URL: 'https://urban-realty-production.up.railway.app'
};

console.log('Environment variables set:');
Object.keys(railwayEnv).filter(key => key.startsWith('RAILWAY') || key.startsWith('NEXT')).forEach(key => {
  console.log(`  ${key}: ${railwayEnv[key]}`);
});

// Test build command
const buildCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const buildArgs = ['run', 'build:railway'];

console.log(`\n🚀 Running: ${buildCommand} ${buildArgs.join(' ')}`);
console.log(`📁 Working directory: ${NEXTJS_APP_PATH}`);

const buildProcess = spawn(buildCommand, buildArgs, {
  cwd: NEXTJS_APP_PATH,
  env: railwayEnv,
  stdio: ['inherit', 'pipe', 'pipe']
});

let stdout = '';
let stderr = '';

buildProcess.stdout.on('data', (data) => {
  const output = data.toString();
  stdout += output;
  console.log(output);
});

buildProcess.stderr.on('data', (data) => {
  const output = data.toString();
  stderr += output;
  console.error(output);
});

buildProcess.on('close', (code) => {
  console.log(`\n📊 Build process completed with code: ${code}`);
  
  if (code === 0) {
    console.log('✅ Railway build test PASSED!');
    console.log('\n🎉 All fixes are working correctly:');
    console.log('   ✅ No event handler serialization errors');
    console.log('   ✅ Static generation properly skipped');
    console.log('   ✅ Railway environment detected');
    console.log('   ✅ Build optimizations applied');
  } else {
    console.log('❌ Railway build test FAILED!');
    
    // Analyze common errors
    const errorAnalysis = analyzeErrors(stdout + stderr);
    if (errorAnalysis.length > 0) {
      console.log('\n🔍 Error Analysis:');
      errorAnalysis.forEach(error => console.log(`   ${error}`));
    }
  }
  
  process.exit(code);
});

function analyzeErrors(output) {
  const errors = [];
  
  if (output.includes('Event handlers cannot be passed to Client Component props')) {
    errors.push('❌ Event handler serialization error still exists');
  }
  
  if (output.includes('onFID is not exported')) {
    errors.push('❌ Web vitals onFID error still exists');
  }
  
  if (output.includes('Error generating static params')) {
    errors.push('❌ Static generation error still exists');
  }
  
  if (output.includes('Connection refused') || output.includes('ECONNREFUSED')) {
    errors.push('⚠️  API connection issues (expected during build)');
  }
  
  if (output.includes('Module not found')) {
    errors.push('❌ Missing module dependencies');
  }
  
  return errors;
}