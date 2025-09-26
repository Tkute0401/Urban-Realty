#!/usr/bin/env node

/**
 * Railway Deployment Fixes Validation Test for Squarefooot
 * 
 * This script validates that all Railway deployment issues have been resolved:
 * 1. Web vitals import errors
 * 2. Static generation connection failures
 * 3. API configuration optimization
 * 4. Build process optimization
 */

const fs = require('fs');
const path = require('path');

console.log('🚂 Railway Deployment Fixes Validation for Squarefooot\n');

const issues = [];
const fixes = [];

// Test 1: Check web-vitals import fix
console.log('1. Testing web-vitals import fix...');
try {
  const webVitalsPath = path.join(__dirname, 'new-nextjs-app/src/lib/performance/webVitals.ts');
  const webVitalsContent = fs.readFileSync(webVitalsPath, 'utf8');
  
  if (webVitalsContent.includes('onFID')) {
    issues.push('❌ webVitals.ts still imports deprecated onFID');
  } else if (webVitalsContent.includes('onINP')) {
    fixes.push('✅ webVitals.ts correctly imports onINP instead of onFID');
  } else {
    issues.push('❌ webVitals.ts missing web vitals imports');
  }
} catch (error) {
  issues.push(`❌ Could not read webVitals.ts: ${error.message}`);
}

// Test 2: Check developer page Railway optimization
console.log('2. Testing developer page Railway optimization...');
try {
  const developerPagePath = path.join(__dirname, 'new-nextjs-app/src/app/developers/[id]/page.tsx');
  const developerPageContent = fs.readFileSync(developerPagePath, 'utf8');
  
  if (developerPageContent.includes('isRailwayBuild') && 
      developerPageContent.includes('getApiBaseUrl') &&
      developerPageContent.includes('AbortSignal.timeout')) {
    fixes.push('✅ Developer page has Railway optimization');
  } else {
    issues.push('❌ Developer page missing Railway optimization');
  }
} catch (error) {
  issues.push(`❌ Could not read developer page: ${error.message}`);
}

// Test 3: Check property page Railway optimization
console.log('3. Testing property page Railway optimization...');
try {
  const propertyPagePath = path.join(__dirname, 'new-nextjs-app/src/app/properties/[id]/page.tsx');
  const propertyPageContent = fs.readFileSync(propertyPagePath, 'utf8');
  
  if (propertyPageContent.includes('isRailwayBuild') && 
      propertyPageContent.includes('getApiBaseUrl') &&
      propertyPageContent.includes('AbortSignal.timeout')) {
    fixes.push('✅ Property page has Railway optimization');
  } else {
    issues.push('❌ Property page missing Railway optimization');
  }
} catch (error) {
  issues.push(`❌ Could not read property page: ${error.message}`);
}

// Test 4: Check API configuration optimization
console.log('4. Testing API configuration optimization...');
try {
  const apiConfigPath = path.join(__dirname, 'new-nextjs-app/src/lib/services/api.config.ts');
  const apiConfigContent = fs.readFileSync(apiConfigPath, 'utf8');
  
  if (apiConfigContent.includes('isRailwayBuild') && 
      apiConfigContent.includes('RAILWAY_PRIVATE_DOMAIN') &&
      apiConfigContent.includes('urban-realty-production.up.railway.app')) {
    fixes.push('✅ API configuration has Railway optimization');
  } else {
    issues.push('❌ API configuration missing Railway optimization');
  }
} catch (error) {
  issues.push(`❌ Could not read API configuration: ${error.message}`);
}

// Test 5: Check Next.js configuration
console.log('5. Testing Next.js configuration...');
try {
  const nextConfigPath = path.join(__dirname, 'new-nextjs-app/next.config.js');
  const nextConfigContent = fs.readFileSync(nextConfigPath, 'utf8');
  
  if (nextConfigContent.includes('RAILWAY_ENVIRONMENT') && 
      nextConfigContent.includes('RAILWAY_PROJECT_ID') &&
      nextConfigContent.includes('ignoreBuildErrors: true')) {
    fixes.push('✅ Next.js config has Railway optimization');
  } else {
    issues.push('❌ Next.js config missing Railway optimization');
  }
} catch (error) {
  issues.push(`❌ Could not read Next.js config: ${error.message}`);
}

// Test 6: Check Railway build optimization script
console.log('6. Testing Railway build optimization script...');
try {
  const buildScriptPath = path.join(__dirname, 'new-nextjs-app/railway-build-optimization.js');
  if (fs.existsSync(buildScriptPath)) {
    const buildScriptContent = fs.readFileSync(buildScriptPath, 'utf8');
    if (buildScriptContent.includes('RAILWAY_ENVIRONMENT') && 
        buildScriptContent.includes('NEXT_TELEMETRY_DISABLED') &&
        buildScriptContent.includes('max-old-space-size=4096')) {
      fixes.push('✅ Railway build optimization script created');
    } else {
      issues.push('❌ Railway build optimization script incomplete');
    }
  } else {
    issues.push('❌ Railway build optimization script not found');
  }
} catch (error) {
  issues.push(`❌ Could not read build optimization script: ${error.message}`);
}

// Test 7: Check package.json build scripts
console.log('7. Testing package.json build scripts...');
try {
  const packageJsonPath = path.join(__dirname, 'new-nextjs-app/package.json');
  const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf8');
  const packageJson = JSON.parse(packageJsonContent);
  
  if (packageJson.scripts['build:optimized'] && 
      packageJson.scripts['build:railway'] &&
      packageJson.dependencies['web-vitals']) {
    fixes.push('✅ Package.json has optimized build scripts');
  } else {
    issues.push('❌ Package.json missing optimized build scripts');
  }
} catch (error) {
  issues.push(`❌ Could not read package.json: ${error.message}`);
}

// Test 8: Check environment variable handling
console.log('8. Testing environment variable handling...');
const requiredEnvVars = [
  'NEXT_PUBLIC_API_URL',
  'NEXT_PUBLIC_BASE_URL',
  'NODE_ENV',
  'MONGODB_URI',
  'JWT_SECRET'
];

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
if (missingEnvVars.length === 0) {
  fixes.push('✅ All required environment variables are set');
} else {
  issues.push(`❌ Missing environment variables: ${missingEnvVars.join(', ')}`);
}

// Display results
console.log('\n📊 Validation Results:\n');

console.log('🎉 Fixes Applied:');
fixes.forEach(fix => console.log(`  ${fix}`));

if (issues.length > 0) {
  console.log('\n⚠️  Remaining Issues:');
  issues.forEach(issue => console.log(`  ${issue}`));
} else {
  console.log('\n🎉 No issues found!');
}

// Summary
console.log('\n📋 Summary:');
console.log(`✅ Fixes: ${fixes.length}`);
console.log(`❌ Issues: ${issues.length}`);

if (issues.length === 0) {
  console.log('\n🚀 Railway deployment should now work correctly!');
  console.log('\n📝 Deployment checklist:');
  console.log('  1. ✅ Web vitals import fixed (onFID → onINP)');
  console.log('  2. ✅ Static generation optimized for Railway');
  console.log('  3. ✅ API configuration handles Railway builds');
  console.log('  4. ✅ Build process optimized for Railway');
  console.log('  5. ✅ Environment variables configured');
  console.log('\n🎯 Next steps:');
  console.log('  - Commit and push changes to trigger Railway deployment');
  console.log('  - Monitor Railway deployment logs for successful build');
  console.log('  - Test application functionality after deployment');
} else {
  console.log('\n🔧 Please fix remaining issues before deploying to Railway.');
  process.exit(1);
}

console.log('\n🏁 Validation complete!');