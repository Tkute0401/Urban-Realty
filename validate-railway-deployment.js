#!/usr/bin/env node

/**
 * Railway Deployment Validation Script
 * Validates all fixes and optimizations for Railway deployment
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Validating Railway deployment readiness...\n');

const checks = [];
const warnings = [];
const errors = [];

// Helper function to check file exists
const fileExists = (filePath) => {
  const fullPath = path.join(__dirname, filePath);
  return fs.existsSync(fullPath);
};

// Helper function to read file content
const readFile = (filePath) => {
  try {
    const fullPath = path.join(__dirname, filePath);
    return fs.readFileSync(fullPath, 'utf8');
  } catch (error) {
    return null;
  }
};

// 1. Check critical files exist
console.log('📁 Checking critical files...');
const criticalFiles = [
  'new-nextjs-app/src/app/properties/[id]/page.tsx',
  'new-nextjs-app/src/app/properties/[id]/PropertyDetailsClient.tsx',
  'new-nextjs-app/src/app/developers/[id]/page.tsx',
  'new-nextjs-app/next.config.js',
  'new-nextjs-app/package.json'
];

criticalFiles.forEach(file => {
  if (fileExists(file)) {
    console.log(`✅ ${file}`);
    checks.push(`Critical file exists: ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
    errors.push(`Critical file missing: ${file}`);
  }
});

// 2. Check for event handler serialization fixes
console.log('\n🔧 Checking event handler fixes...');

const propertyDetailsClient = readFile('new-nextjs-app/src/app/properties/[id]/PropertyDetailsClient.tsx');
if (propertyDetailsClient) {
  if (propertyDetailsClient.includes('dynamic') && propertyDetailsClient.includes('ssr: false')) {
    console.log('✅ PropertyDetailsClient uses dynamic imports with ssr: false');
    checks.push('Event handler serialization fixed in PropertyDetailsClient');
  } else {
    console.log('❌ PropertyDetailsClient missing dynamic import fixes');
    errors.push('PropertyDetailsClient needs dynamic import fixes');
  }

  if (propertyDetailsClient.includes('PropertyHeader') && propertyDetailsClient.includes('dynamic')) {
    console.log('✅ PropertyHeader dynamically imported');
    checks.push('PropertyHeader properly dynamically imported');
  } else {
    console.log('⚠️  PropertyHeader may cause serialization issues');
    warnings.push('PropertyHeader should be dynamically imported');
  }
} else {
  console.log('❌ Cannot read PropertyDetailsClient.tsx');
  errors.push('PropertyDetailsClient.tsx not readable');
}

// 3. Check Railway environment detection
console.log('\n🚆 Checking Railway environment detection...');

const propertiesPage = readFile('new-nextjs-app/src/app/properties/[id]/page.tsx');
if (propertiesPage) {
  if (propertiesPage.includes('RAILWAY_ENVIRONMENT') && propertiesPage.includes('generateStaticParams')) {
    console.log('✅ Properties page has Railway detection in generateStaticParams');
    checks.push('Railway detection in properties generateStaticParams');
  } else {
    console.log('❌ Properties page missing Railway detection');
    errors.push('Properties page needs Railway detection');
  }

  if (propertiesPage.includes('Skip static generation during Railway build')) {
    console.log('✅ Railway build skip logic implemented');
    checks.push('Railway build skip logic in properties page');
  } else {
    console.log('❌ Missing Railway build skip logic');
    errors.push('Railway build skip logic missing');
  }
} else {
  console.log('❌ Cannot read properties page.tsx');
  errors.push('Properties page.tsx not readable');
}

const developersPage = readFile('new-nextjs-app/src/app/developers/[id]/page.tsx');
if (developersPage) {
  if (developersPage.includes('RAILWAY_ENVIRONMENT') && developersPage.includes('generateStaticParams')) {
    console.log('✅ Developers page has Railway detection');
    checks.push('Railway detection in developers generateStaticParams');
  } else {
    console.log('⚠️  Developers page may need Railway detection');
    warnings.push('Developers page should have Railway detection');
  }
} else {
  console.log('❌ Cannot read developers page.tsx');
  errors.push('Developers page.tsx not readable');
}

// 4. Check API configuration
console.log('\n🌐 Checking API configuration...');

const apiConfig = readFile('new-nextjs-app/src/lib/services/api.config.ts');
if (apiConfig) {
  if (apiConfig.includes('getBrowserAccessToken')) {
    console.log('✅ getBrowserAccessToken export exists');
    checks.push('getBrowserAccessToken properly exported');
  } else {
    console.log('❌ getBrowserAccessToken export missing');
    errors.push('getBrowserAccessToken export needed');
  }

  if (apiConfig.includes('railwaySafeApiCall')) {
    console.log('✅ Railway-safe API wrapper exists');
    checks.push('Railway-safe API wrapper implemented');
  } else {
    console.log('❌ Railway-safe API wrapper missing');
    errors.push('Railway-safe API wrapper needed');
  }

  if (apiConfig.includes('isRailwayBuild')) {
    console.log('✅ Railway build detection function exists');
    checks.push('Railway build detection function implemented');
  } else {
    console.log('❌ Railway build detection missing');
    errors.push('Railway build detection needed');
  }
} else {
  console.log('❌ Cannot read api.config.ts');
  errors.push('API config not readable');
}

// 5. Check web vitals fixes
console.log('\n📊 Checking web vitals configuration...');

const webVitals = readFile('new-nextjs-app/src/lib/performance/webVitals.ts');
if (webVitals) {
  if (webVitals.includes('onINP') && !webVitals.includes('onFID')) {
    console.log('✅ Web vitals using onINP instead of deprecated onFID');
    checks.push('Web vitals updated to use onINP');
  } else if (webVitals.includes('onFID')) {
    console.log('❌ Web vitals still using deprecated onFID');
    errors.push('Web vitals needs onFID to onINP update');
  }

  if (webVitals.includes('reportWebVitals') && webVitals.includes('setupPerformanceObserver')) {
    console.log('✅ Required web vitals exports exist');
    checks.push('Web vitals exports properly configured');
  } else {
    console.log('⚠️  Missing some web vitals exports');
    warnings.push('Web vitals may need additional exports');
  }
} else {
  console.log('❌ Cannot read webVitals.ts');
  errors.push('webVitals.ts not readable');
}

// 6. Check Next.js configuration
console.log('\n⚙️  Checking Next.js configuration...');

const nextConfig = readFile('new-nextjs-app/next.config.js');
if (nextConfig) {
  if (!nextConfig.includes('appDir: true')) {
    console.log('✅ Deprecated appDir option removed');
    checks.push('Deprecated Next.js options removed');
  } else {
    console.log('❌ Deprecated appDir option still present');
    errors.push('Remove deprecated appDir option');
  }

  if (nextConfig.includes('experimental') && nextConfig.includes('optimizeCss')) {
    console.log('✅ Railway optimizations enabled');
    checks.push('Next.js Railway optimizations configured');
  } else {
    console.log('⚠️  Next.js optimizations may be incomplete');
    warnings.push('Consider additional Next.js optimizations');
  }

  if (nextConfig.includes('splitChunks')) {
    console.log('✅ Bundle optimization configured');
    checks.push('Webpack bundle optimization configured');
  } else {
    console.log('⚠️  Bundle optimization not configured');
    warnings.push('Bundle optimization could improve performance');
  }
} else {
  console.log('❌ Cannot read next.config.js');
  errors.push('next.config.js not readable');
}

// 7. Check package.json scripts
console.log('\n📦 Checking package.json scripts...');

const packageJson = readFile('new-nextjs-app/package.json');
if (packageJson) {
  try {
    const pkg = JSON.parse(packageJson);
    
    if (pkg.scripts && pkg.scripts['build:railway']) {
      console.log('✅ Railway build script exists');
      checks.push('Railway build script configured');
    } else {
      console.log('❌ Railway build script missing');
      errors.push('Railway build script needed');
    }

    if (pkg.scripts && pkg.scripts['start:railway']) {
      console.log('✅ Railway start script exists');
      checks.push('Railway start script configured');
    } else {
      console.log('⚠️  Railway start script missing');
      warnings.push('Consider adding Railway start script');
    }

    // Check for updated web-vitals version
    if (pkg.dependencies && pkg.dependencies['web-vitals']) {
      const webVitalsVersion = pkg.dependencies['web-vitals'];
      if (webVitalsVersion.includes('3.') || webVitalsVersion.includes('^3') || webVitalsVersion.includes('~3')) {
        console.log('✅ Web vitals version 3.x (supports onINP)');
        checks.push('Web vitals version supports onINP');
      } else {
        console.log(`⚠️  Web vitals version: ${webVitalsVersion} - consider updating`);
        warnings.push('Consider updating web-vitals to version 3.x');
      }
    }
  } catch (error) {
    console.log('❌ Cannot parse package.json');
    errors.push('package.json parse error');
  }
} else {
  console.log('❌ Cannot read package.json');
  errors.push('package.json not readable');
}

// 8. Check build output (if exists)
console.log('\n🏗️  Checking build output...');

if (fileExists('new-nextjs-app/.next/build-manifest.json')) {
  console.log('✅ Build output exists');
  checks.push('Build output generated successfully');
} else {
  console.log('⚠️  Build output not found (may not have been built yet)');
  warnings.push('Run build to verify complete functionality');
}

// 9. Check environment variables setup
console.log('\n🌍 Checking environment setup...');

const envExample = readFile('new-nextjs-app/.env.example');
const envLocal = readFile('new-nextjs-app/.env.local');

if (envExample && envExample.includes('RAILWAY')) {
  console.log('✅ Railway environment variables documented');
  checks.push('Railway environment variables documented');
} else {
  console.log('⚠️  Railway environment variables not documented');
  warnings.push('Document Railway environment variables');
}

// Summary
console.log('\n📋 DEPLOYMENT VALIDATION SUMMARY');
console.log('═'.repeat(50));

console.log(`\n✅ PASSED CHECKS (${checks.length}):`);
checks.forEach(check => console.log(`   • ${check}`));

if (warnings.length > 0) {
  console.log(`\n⚠️  WARNINGS (${warnings.length}):`);
  warnings.forEach(warning => console.log(`   • ${warning}`));
}

if (errors.length > 0) {
  console.log(`\n❌ CRITICAL ERRORS (${errors.length}):`);
  errors.forEach(error => console.log(`   • ${error}`));
}

// Final verdict
console.log('\n🎯 DEPLOYMENT READINESS:');
if (errors.length === 0) {
  if (warnings.length === 0) {
    console.log('🟢 EXCELLENT - Ready for Railway deployment!');
    console.log('   All critical fixes implemented and optimized.');
  } else {
    console.log('🟡 GOOD - Ready for Railway deployment with minor optimizations needed');
    console.log('   All critical issues fixed, some optimizations can be improved.');
  }
} else {
  console.log('🔴 NEEDS ATTENTION - Critical issues must be fixed before deployment');
  console.log(`   Fix ${errors.length} critical error(s) before deploying to Railway.`);
}

// Railway-specific recommendations
console.log('\n🚀 RAILWAY DEPLOYMENT RECOMMENDATIONS:');
console.log('1. Use the build:railway script for optimal performance');
console.log('2. Set SKIP_BUILD_STATIC_GENERATION=true in Railway environment');
console.log('3. Monitor deployment logs for any remaining event handler errors');
console.log('4. Test all interactive components after deployment');
console.log('5. Run performance audits to verify optimizations');

// Exit with appropriate code
process.exit(errors.length > 0 ? 1 : 0);