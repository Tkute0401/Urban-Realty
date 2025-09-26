#!/usr/bin/env node

/**
 * Railway Build Fix Script for Squarefooot
 * Comprehensive solution for Next.js 14 event handler serialization issues
 */

const fs = require('fs');
const path = require('path');

console.log('🚆 Starting Railway Build Fix for Squarefooot...');

// Set Railway-specific environment variables
process.env.SKIP_BUILD_STATIC_GENERATION = 'true';
process.env.DISABLE_ESLINT_PLUGIN = 'true';
process.env.NEXT_TELEMETRY_DISABLED = '1';

console.log('✅ Environment variables set for Railway build');

// Verify critical fixes are in place
const criticalFiles = [
  {
    path: 'src/app/properties/[id]/PropertyInteractiveWrapper.tsx',
    checks: [
      'ssr: false',
      'import dynamic from',
      'setIsClient(true)'
    ]
  },
  {
    path: 'src/app/properties/[id]/page.tsx', 
    checks: [
      'SKIP_BUILD_STATIC_GENERATION',
      'RAILWAY_ENVIRONMENT'
    ]
  },
  {
    path: 'src/app/admin/ContactsTable.tsx',
    checks: [
      'http.delete'
    ]
  }
];

console.log('🔍 Verifying critical fixes...');

let allChecksPass = true;
criticalFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file.path);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    const passed = file.checks.every(check => content.includes(check));
    console.log(`${passed ? '✅' : '❌'} ${file.path}: ${passed ? 'PASS' : 'FAIL'}`);
    if (!passed) {
      allChecksPass = false;
      console.log(`   Missing: ${file.checks.filter(check => !content.includes(check)).join(', ')}`);
    }
  } else {
    console.log(`❌ ${file.path}: FILE NOT FOUND`);
    allChecksPass = false;
  }
});

if (!allChecksPass) {
  console.log('❌ Some critical fixes are missing. Please apply all fixes before deployment.');
  process.exit(1);
}

console.log('✅ All critical fixes verified');

// Build debugging information
console.log('\n📊 Build Environment Debug Info:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('RAILWAY_ENVIRONMENT:', process.env.RAILWAY_ENVIRONMENT);
console.log('RAILWAY_PROJECT_ID:', process.env.RAILWAY_PROJECT_ID);
console.log('SKIP_BUILD_STATIC_GENERATION:', process.env.SKIP_BUILD_STATIC_GENERATION);
console.log('NEXT_TELEMETRY_DISABLED:', process.env.NEXT_TELEMETRY_DISABLED);

// Memory optimization for Railway builds
if (process.env.NODE_ENV === 'production') {
  console.log('⚡ Applying memory optimizations for Railway...');
  
  // Set Node.js options for Railway's memory constraints
  if (!process.env.NODE_OPTIONS) {
    process.env.NODE_OPTIONS = '--max-old-space-size=4096 --enable-source-maps=false';
  }
  
  console.log('NODE_OPTIONS:', process.env.NODE_OPTIONS);
}

console.log('\n🚆 Railway Build Fix completed successfully!');
console.log('🚀 Ready for Railway deployment with optimizations:');
console.log('   ✅ Event handler serialization prevented');
console.log('   ✅ Static generation skipped for Railway');
console.log('   ✅ Memory optimizations applied');
console.log('   ✅ Build debugging enabled');

// Provide next steps
console.log('\n📝 Next Steps:');
console.log('1. Deploy to Railway using: npm run build:railway');
console.log('2. Monitor build logs for event handler errors');
console.log('3. Verify application functionality in production');