#!/usr/bin/env node

/**
 * Pre-deployment validation script for Railway
 * Checks for common issues that cause deployment failures
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Railway Deployment Validation\n');

// Check Node.js version
const nodeVersion = process.version;
console.log(`Node.js version: ${nodeVersion}`);

const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
if (majorVersion < 20) {
    console.error('❌ Node.js 20+ required, found:', nodeVersion);
    process.exit(1);
} else {
    console.log('✅ Node.js version compatible');
}

// Check critical files
const criticalFiles = [
    'Dockerfile',
    'Railway.toml',
    'ecosystem.config.js',
    'package.json',
    'new-nextjs-app/package.json',
    'new-nextjs-app/next.config.js'
];

let missingFiles = [];
criticalFiles.forEach(file => {
    const filePath = path.resolve(__dirname, file);
    if (fs.existsSync(filePath)) {
        console.log(`✅ ${file}`);
    } else {
        console.log(`❌ ${file} - MISSING`);
        missingFiles.push(file);
    }
});

// Check for conflicting railway configs
const conflictingFiles = [
    'new-nextjs-app/railway.json',
    'railway.json'
];

let foundConflicts = [];
conflictingFiles.forEach(file => {
    const filePath = path.resolve(__dirname, file);
    if (fs.existsSync(filePath)) {
        console.log(`⚠️  ${file} - CONFLICT (should be removed)`);
        foundConflicts.push(file);
    }
});

// Check package.json engines
try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const engines = packageJson.engines;
    
    if (engines && engines.node) {
        console.log(`✅ Node.js engine requirement: ${engines.node}`);
    } else {
        console.log('⚠️  No Node.js engine specified in package.json');
    }
} catch (error) {
    console.error('❌ Error reading package.json:', error.message);
    missingFiles.push('package.json');
}

// Check Next.js config
try {
    const nextConfigPath = 'new-nextjs-app/next.config.js';
    if (fs.existsSync(nextConfigPath)) {
        const nextConfig = fs.readFileSync(nextConfigPath, 'utf8');
        
        // Check for important optimizations
        const optimizations = [
            { key: 'output: "standalone"', patterns: ['output: "standalone"', "output: 'standalone'"] },
            { key: 'experimental', patterns: ['experimental'] },
            { key: 'compress: true', patterns: ['compress: true'] }
        ];
        
        optimizations.forEach(opt => {
            const found = opt.patterns.some(pattern => nextConfig.includes(pattern));
            if (found) {
                console.log(`✅ Next.js optimization: ${opt.key}`);
            } else {
                console.log(`⚠️  Missing Next.js optimization: ${opt.key}`);
            }
        });
    }
} catch (error) {
    console.log('⚠️  Could not validate Next.js config:', error.message);
}

// Check Railway.toml configuration
try {
    const railwayConfig = fs.readFileSync('Railway.toml', 'utf8');
    
    if (railwayConfig.includes('builder = "docker"')) {
        console.log('✅ Railway configured for Docker build');
    } else {
        console.log('❌ Railway not configured for Docker build');
    }
    
    if (railwayConfig.includes('dockerfilePath = "Dockerfile"')) {
        console.log('✅ Dockerfile path specified');
    } else {
        console.log('⚠️  Dockerfile path not specified');
    }
} catch (error) {
    console.log('❌ Could not read Railway.toml:', error.message);
}

// Check environment variables (basic validation)
const requiredEnvVars = [
    'NODE_ENV',
    'NEXT_PUBLIC_API_URL',
    'NEXT_PUBLIC_BASE_URL'
];

console.log('\n📋 Environment Variables:');
requiredEnvVars.forEach(envVar => {
    if (process.env[envVar]) {
        console.log(`✅ ${envVar}: ${process.env[envVar]}`);
    } else {
        console.log(`⚠️  ${envVar}: Not set (should be set in Railway)`);
    }
});

// Final validation
console.log('\n📊 Deployment Validation Summary:');
console.log('================================');

if (missingFiles.length === 0) {
    console.log('✅ All critical files present');
} else {
    console.log(`❌ Missing files: ${missingFiles.join(', ')}`);
}

if (foundConflicts.length === 0) {
    console.log('✅ No conflicting configurations');
} else {
    console.log(`⚠️  Conflicting configs found: ${foundConflicts.join(', ')}`);
    console.log('   Remove these files to avoid deployment issues');
}

const hasErrors = missingFiles.length > 0 || majorVersion < 20;
const hasWarnings = foundConflicts.length > 0;

if (hasErrors) {
    console.log('\n❌ DEPLOYMENT WILL FAIL - Fix errors above');
    process.exit(1);
} else if (hasWarnings) {
    console.log('\n⚠️  DEPLOYMENT MAY HAVE ISSUES - Review warnings above');
    process.exit(0);
} else {
    console.log('\n🎉 DEPLOYMENT READY - All checks passed!');
    process.exit(0);
}