#!/usr/bin/env node

/**
 * Deployment Configuration Validator
 * Validates Railway and Docker deployment setup for Next.js + Express architecture
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Validating Urban Realty Deployment Configuration...\n');

// Check if required files exist
const requiredFiles = [
  'Dockerfile',
  'Railway.toml',
  'ecosystem.config.js',
  'package.json',
  '.env.example',
  'new-nextjs-app/package.json',
  'new-nextjs-app/.env.example',
  'server/server.js'
];

let allFilesExist = true;

console.log('📁 Checking required files:');
requiredFiles.forEach(file => {
  const exists = fs.existsSync(path.join(__dirname, file));
  console.log(`   ${exists ? '✅' : '❌'} ${file}`);
  if (!exists) allFilesExist = false;
});

if (!allFilesExist) {
  console.log('\n❌ Some required files are missing. Please ensure all files are present.');
  process.exit(1);
}

// Validate package.json scripts
console.log('\n📦 Checking root package.json scripts:');
const rootPackage = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const requiredScripts = {
  'start': 'pm2-runtime start ecosystem.config.js',
  'build': 'cd new-nextjs-app && npm install && npm run build',
  'dev': 'concurrently "npm run server" "npm run nextjs"'
};

let scriptsValid = true;
Object.entries(requiredScripts).forEach(([script, expectedValue]) => {
  const exists = rootPackage.scripts && rootPackage.scripts[script];
  const matches = exists && rootPackage.scripts[script].includes(expectedValue.split(' ')[0]);
  console.log(`   ${matches ? '✅' : '❌'} ${script}: ${exists ? rootPackage.scripts[script] : 'missing'}`);
  if (!matches) scriptsValid = false;
});

// Validate Next.js package.json
console.log('\n🔧 Checking Next.js package.json:');
const nextjsPackage = JSON.parse(fs.readFileSync('new-nextjs-app/package.json', 'utf8'));
const nextjsScripts = ['dev', 'build', 'start'];
nextjsScripts.forEach(script => {
  const exists = nextjsPackage.scripts && nextjsPackage.scripts[script];
  console.log(`   ${exists ? '✅' : '❌'} ${script}: ${exists ? nextjsPackage.scripts[script] : 'missing'}`);
});

// Validate PM2 ecosystem config
console.log('\n⚙️  Checking PM2 ecosystem configuration:');
try {
  const ecosystem = require('./ecosystem.config.js');
  const hasNextJs = ecosystem.apps.some(app => app.name === 'nextjs-frontend');
  const hasExpress = ecosystem.apps.some(app => app.name === 'express-backend');
  
  console.log(`   ${hasNextJs ? '✅' : '❌'} Next.js frontend app configured`);
  console.log(`   ${hasExpress ? '✅' : '❌'} Express backend app configured`);
  
  if (hasNextJs) {
    const nextjsApp = ecosystem.apps.find(app => app.name === 'nextjs-frontend');
    const correctCwd = nextjsApp.cwd === './new-nextjs-app';
    const correctPort = nextjsApp.env && nextjsApp.env.PORT === 3000;
    console.log(`   ${correctCwd ? '✅' : '❌'} Next.js app directory: ${nextjsApp.cwd}`);
    console.log(`   ${correctPort ? '✅' : '❌'} Next.js app port: ${nextjsApp.env?.PORT || 'not set'}`);
  }
} catch (error) {
  console.log('   ❌ Error reading ecosystem.config.js:', error.message);
}

// Check environment variables
console.log('\n🌍 Checking environment configuration:');
const envExample = fs.readFileSync('.env.example', 'utf8');
const nextjsEnvExample = fs.readFileSync('new-nextjs-app/.env.example', 'utf8');

const hasApiUrl = envExample.includes('NEXT_PUBLIC_API_URL');
const hasCorrectPort = envExample.includes('PORT=5000');
const hasCorsOrigin = envExample.includes('CORS_ORIGIN=http://localhost:3000');

console.log(`   ${hasApiUrl ? '✅' : '❌'} NEXT_PUBLIC_API_URL configured`);
console.log(`   ${hasCorrectPort ? '✅' : '❌'} Server PORT set to 5000`);
console.log(`   ${hasCorsOrigin ? '✅' : '❌'} CORS_ORIGIN set for Next.js`);

// Check Railway configuration
console.log('\n🚂 Checking Railway configuration:');
if (fs.existsSync('Railway.toml')) {
  const railwayConfig = fs.readFileSync('Railway.toml', 'utf8');
  const hasStartCommand = railwayConfig.includes('start');
  const hasHealthCheck = railwayConfig.includes('healthcheckTimeout');
  
  console.log(`   ${hasStartCommand ? '✅' : '❌'} Start command configured`);
  console.log(`   ${hasHealthCheck ? '✅' : '❌'} Health check timeout set`);
}

// Check Docker configuration
console.log('\n🐳 Checking Docker configuration:');
if (fs.existsSync('Dockerfile')) {
  const dockerfile = fs.readFileSync('Dockerfile', 'utf8');
  const hasMultiStage = dockerfile.includes('FROM node:') && dockerfile.includes('AS');
  const hasNextjsBuild = dockerfile.includes('new-nextjs-app');
  const hasPm2 = dockerfile.includes('pm2');
  
  console.log(`   ${hasMultiStage ? '✅' : '❌'} Multi-stage build setup`);
  console.log(`   ${hasNextjsBuild ? '✅' : '❌'} Next.js app build configured`);
  console.log(`   ${hasPm2 ? '✅' : '❌'} PM2 process manager included`);
}

console.log('\n🎯 Deployment Architecture Summary:');
console.log('   Frontend: Next.js app (port 3000) with SSR/ISR');
console.log('   Backend: Express API server (port 5000)');
console.log('   Process Manager: PM2 for production deployment');
console.log('   Deployment: Railway + Docker containerization');

console.log('\n🚀 Configuration validation complete!');
console.log('\nNext steps:');
console.log('1. Set up environment variables: cp .env.example .env');
console.log('2. Install dependencies: npm run install-all');
console.log('3. Test locally: npm run dev');
console.log('4. Build for production: npm run build');
console.log('5. Deploy to Railway with the configured setup');

console.log('\n📚 For detailed deployment instructions, see RAILWAY_DEPLOYMENT_GUIDE.md');