#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Railway Build Test - Verifying module resolution...\n');

const projectRoot = process.cwd();
const nextjsApp = path.join(projectRoot, 'new-nextjs-app');

// Check critical files
const criticalFiles = [
    'src/contexts/AuthContext.tsx',
    'src/lib/services/http.ts', 
    'src/app/properties/add/page.tsx',
    'src/app/admin/AdminAnalytics.tsx',
    'src/app/admin/AdminInquiries.tsx',
    'tsconfig.json',
    'next.config.js'
];

console.log('📁 Checking critical files:');
let allFilesExist = true;

criticalFiles.forEach(file => {
    const fullPath = path.join(nextjsApp, file);
    const exists = fs.existsSync(fullPath);
    console.log(`${exists ? '✅' : '❌'} ${file}`);
    if (!exists) allFilesExist = false;
});

if (!allFilesExist) {
    console.error('\n❌ Some critical files are missing!');
    process.exit(1);
}

// Check tsconfig.json paths
console.log('\n⚙️  Checking TypeScript configuration:');
const tsconfigPath = path.join(nextjsApp, 'tsconfig.json');
if (fs.existsSync(tsconfigPath)) {
    const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
    const paths = tsconfig.compilerOptions?.paths;
    
    if (paths && paths['@/*']) {
        console.log('✅ Path mapping "@/*" configured');
        console.log('✅ BaseURL:', tsconfig.compilerOptions.baseUrl);
    } else {
        console.log('❌ Path mappings not properly configured');
    }
} else {
    console.log('❌ tsconfig.json not found');
}

// Check package.json dependencies
console.log('\n📦 Checking package.json:');
const packagePath = path.join(nextjsApp, 'package.json');
if (fs.existsSync(packagePath)) {
    const package = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    const hasTypeScript = package.devDependencies?.typescript;
    const hasNext = package.dependencies?.next;
    
    console.log(`✅ Next.js version: ${package.dependencies?.next || 'Not found'}`);
    console.log(`✅ TypeScript: ${hasTypeScript ? 'Present' : 'Missing'}`);
    console.log(`✅ Build script: ${package.scripts?.build || 'Not found'}`);
    console.log(`✅ Railway build script: ${package.scripts?.['build:railway'] || 'Not found'}`);
} else {
    console.log('❌ package.json not found');
}

// Simulate import resolution
console.log('\n🔗 Simulating module resolution:');
const testImports = [
    '@/contexts/AuthContext',
    '@/lib/services/http', 
    '@/app/properties/add/page'
];

testImports.forEach(importPath => {
    const resolvedPath = importPath.replace('@/', 'src/');
    const fullPath = path.join(nextjsApp, resolvedPath + '.tsx');
    const altPath = path.join(nextjsApp, resolvedPath + '.ts');
    
    const exists = fs.existsSync(fullPath) || fs.existsSync(altPath);
    console.log(`${exists ? '✅' : '❌'} ${importPath} -> ${resolvedPath}`);
});

console.log('\n🚀 Railway Build Test Complete!');
console.log(allFilesExist ? '✅ Ready for Railway deployment' : '❌ Fix issues before deploying');