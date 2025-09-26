#!/usr/bin/env node

// Railway-specific build optimization script for Squarefooot
// This ensures optimal build performance and resolves module issues

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Starting Railway build optimization for Squarefooot...');

// Verify critical files exist
const criticalFiles = [
  'new-nextjs-app/src/contexts/AuthContext.tsx',
  'new-nextjs-app/src/lib/services/http.ts',
  'new-nextjs-app/src/app/properties/add/page.tsx',
  'new-nextjs-app/tsconfig.json',
  'new-nextjs-app/next.config.js'
];

console.log('🔍 Verifying critical files...');
criticalFiles.forEach(file => {
  if (!fs.existsSync(file)) {
    console.error(`❌ Critical file missing: ${file}`);
    process.exit(1);
  } else {
    console.log(`✅ Found: ${file}`);
  }
});

// Set Railway-specific environment variables
process.env.NODE_ENV = 'production';
process.env.NEXT_TELEMETRY_DISABLED = '1';
process.env.SKIP_ENV_VALIDATION = 'true';
process.env.DISABLE_ESLINT_PLUGIN = 'true';

console.log('🔧 Environment variables configured for Railway deployment');

// Verify TypeScript configuration
console.log('🔧 Verifying TypeScript configuration...');
const tsConfigPath = 'new-nextjs-app/tsconfig.json';
const tsConfig = JSON.parse(fs.readFileSync(tsConfigPath, 'utf8'));

if (!tsConfig.compilerOptions.paths || !tsConfig.compilerOptions.paths['@/*']) {
  console.error('❌ TypeScript path mapping for @/* is missing');
  process.exit(1);
}

console.log('✅ TypeScript configuration verified');

// Verify Next.js configuration
console.log('🔧 Verifying Next.js configuration...');
const nextConfigPath = 'new-nextjs-app/next.config.js';

if (!fs.existsSync(nextConfigPath)) {
  console.error('❌ next.config.js is missing');
  process.exit(1);
}

console.log('✅ Next.js configuration verified');

// Test build locally first (optional - only if NODE_ENV !== 'production')
if (process.env.TEST_BUILD === 'true') {
  console.log('🧪 Running test build...');
  try {
    process.chdir('new-nextjs-app');
    execSync('npm run build', { stdio: 'inherit' });
    console.log('✅ Test build successful');
  } catch (error) {
    console.error('❌ Test build failed:', error.message);
    process.exit(1);
  }
}

console.log('🎉 Railway build optimization complete!');
console.log('✅ All systems ready for deployment');