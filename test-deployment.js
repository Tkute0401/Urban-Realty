#!/usr/bin/env node

/**
 * Deployment Test Script
 * Tests the Next.js + Express configuration locally
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Urban Realty Deployment Configuration\n');

// Test 1: Check required files
console.log('📁 Checking required files...');
const requiredFiles = [
  'ecosystem.config.js',
  'Dockerfile',
  'Railway.toml',
  'new-nextjs-app/package.json',
  'server/server.js'
];

let allFilesExist = true;
requiredFiles.forEach(file => {
  if (fs.existsSync(path.join(__dirname, file))) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
    allFilesExist = false;
  }
});

if (!allFilesExist) {
  console.log('\n❌ Some required files are missing. Please check your configuration.');
  process.exit(1);
}

// Test 2: Check package.json scripts
console.log('\n📦 Checking package.json scripts...');
const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
const requiredScripts = ['start', 'dev', 'build', 'nextjs'];

requiredScripts.forEach(script => {
  if (packageJson.scripts[script]) {
    console.log(`✅ ${script}: ${packageJson.scripts[script]}`);
  } else {
    console.log(`❌ ${script} - MISSING`);
  }
});

// Test 3: Check Next.js configuration
console.log('\n⚛️ Checking Next.js configuration...');
const nextConfigPath = path.join(__dirname, 'new-nextjs-app', 'next.config.js');
if (fs.existsSync(nextConfigPath)) {
  const nextConfig = fs.readFileSync(nextConfigPath, 'utf8');
  if (nextConfig.includes("output: 'standalone'")) {
    console.log('✅ Next.js standalone output configured');
  } else {
    console.log('❌ Next.js standalone output not configured');
  }
} else {
  console.log('❌ Next.js config file not found');
}

// Test 4: Check PM2 configuration
console.log('\n🔄 Checking PM2 configuration...');
const ecosystemPath = path.join(__dirname, 'ecosystem.config.js');
if (fs.existsSync(ecosystemPath)) {
  try {
    const ecosystem = require(ecosystemPath);
    if (ecosystem.apps && ecosystem.apps.length >= 2) {
      console.log(`✅ PM2 configured with ${ecosystem.apps.length} apps`);
      ecosystem.apps.forEach(app => {
        console.log(`   - ${app.name}: ${app.script}`);
      });
    } else {
      console.log('❌ PM2 configuration incomplete');
    }
  } catch (error) {
    console.log('❌ PM2 configuration invalid:', error.message);
  }
}

// Test 5: Check environment variables
console.log('\n🌍 Checking environment configuration...');
const envExample = path.join(__dirname, '.env.example');
if (fs.existsSync(envExample)) {
  const envContent = fs.readFileSync(envExample, 'utf8');
  const requiredEnvVars = [
    'NEXT_PUBLIC_API_URL',
    'NEXT_PUBLIC_GOOGLE_MAPS_API_KEY',
    'MONGO_URI',
    'JWT_SECRET'
  ];
  
  requiredEnvVars.forEach(envVar => {
    if (envContent.includes(envVar)) {
      console.log(`✅ ${envVar}`);
    } else {
      console.log(`❌ ${envVar} - MISSING from .env.example`);
    }
  });
}

console.log('\n🎉 Configuration test completed!');
console.log('\n📋 Next steps:');
console.log('1. Set up environment variables');
console.log('2. Install dependencies: npm run install-all');
console.log('3. Test locally: npm run dev');
console.log('4. Build for production: npm run build');
console.log('5. Deploy to Railway');

console.log('\n📖 See RAILWAY_DEPLOYMENT_GUIDE.md for detailed instructions');