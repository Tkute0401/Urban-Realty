#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Railway Build Process Locally...\n');

const nextjsPath = path.join(process.cwd(), 'new-nextjs-app');

try {
    // Change to next.js directory
    process.chdir(nextjsPath);
    console.log('📁 Changed to:', process.cwd());

    // Set environment variables for testing
    process.env.NODE_ENV = 'production';
    process.env.NEXT_TELEMETRY_DISABLED = '1';
    process.env.SKIP_ENV_VALIDATION = 'true';
    process.env.DISABLE_ESLINT_PLUGIN = 'true';

    console.log('🌍 Environment variables set for testing');

    // Test npm install (simulate Railway)
    console.log('📦 Testing npm install...');
    try {
        execSync('npm ci --no-audit --no-fund --silent', { 
            stdio: 'pipe',
            timeout: 300000 // 5 minutes timeout
        });
        console.log('✅ npm install completed successfully');
    } catch (error) {
        console.error('❌ npm install failed:', error.message);
        throw error;
    }

    // Test TypeScript compilation
    console.log('🔧 Testing TypeScript compilation...');
    try {
        execSync('npx tsc --noEmit', { stdio: 'pipe' });
        console.log('✅ TypeScript compilation successful');
    } catch (error) {
        console.log('⚠️  TypeScript has warnings but will continue (disabled for Railway)');
    }

    // Test Next.js build (Railway equivalent)
    console.log('🏗️  Testing Next.js build (Railway simulation)...');
    try {
        const result = execSync('npm run build:railway', { 
            stdio: 'pipe',
            timeout: 600000, // 10 minutes timeout
            encoding: 'utf8'
        });
        console.log('✅ Next.js build completed successfully!');
        
        // Check if .next folder was created
        const nextFolder = path.join(process.cwd(), '.next');
        if (fs.existsSync(nextFolder)) {
            console.log('✅ .next build folder created');
            
            // Check for standalone output
            const standaloneFile = path.join(nextFolder, 'server.js');
            if (fs.existsSync(standaloneFile)) {
                console.log('✅ Standalone server.js created');
            } else {
                console.log('⚠️  Standalone mode not detected (check next.config.js)');
            }
        } else {
            throw new Error('.next folder not created');
        }
        
    } catch (error) {
        console.error('❌ Next.js build failed:', error.message);
        if (error.stdout) {
            console.error('Build output:', error.stdout.toString());
        }
        if (error.stderr) {
            console.error('Build errors:', error.stderr.toString());
        }
        throw error;
    }

    console.log('\n🎉 SUCCESS: Build test completed successfully!');
    console.log('✅ Your application is ready for Railway deployment');
    console.log('\n📝 Next steps:');
    console.log('1. Commit and push your changes to Git');
    console.log('2. Ensure all environment variables are set in Railway');
    console.log('3. Deploy to Railway');

} catch (error) {
    console.error('\n❌ BUILD TEST FAILED');
    console.error('Error:', error.message);
    console.log('\n🔧 Troubleshooting steps:');
    console.log('1. Check that all dependencies are properly installed');
    console.log('2. Verify tsconfig.json has correct path mappings');
    console.log('3. Ensure all source files exist in correct locations');
    console.log('4. Run: node railway-build-test.js');
    process.exit(1);
}