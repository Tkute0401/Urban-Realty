#!/usr/bin/env node

/**
 * Railway Deployment Optimization Script for Squarefooot
 * Ensures optimal build, deployment, and runtime performance
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Railway deployment optimization for Squarefooot...');

// Set optimization environment variables
const envVars = {
  NODE_ENV: 'production',
  NEXT_TELEMETRY_DISABLED: '1',
  NEXT_SHARP: '0',
  NPM_CONFIG_PRODUCTION: 'true',
  NODE_OPTIONS: '--max-old-space-size=4096 --enable-source-maps=false',
  UV_THREADPOOL_SIZE: '128'
};

// Apply environment variables
Object.entries(envVars).forEach(([key, value]) => {
  process.env[key] = value;
  console.log(`✓ Set ${key}=${value}`);
});

try {
  // Clean up previous builds
  console.log('🧹 Cleaning up previous builds...');
  const cleanupPaths = [
    'new-nextjs-app/.next',
    'new-nextjs-app/out',
    'node_modules/.cache',
    '.next',
    'out'
  ];
  
  cleanupPaths.forEach(p => {
    if (fs.existsSync(p)) {
      fs.rmSync(p, { recursive: true, force: true });
      console.log(`✓ Removed ${p}`);
    }
  });

  // Verify package.json and package-lock.json sync
  console.log('📋 Verifying package dependencies...');
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  if (!fs.existsSync('package-lock.json')) {
    console.log('⚠️  package-lock.json missing, regenerating...');
    execSync('npm install', { stdio: 'inherit' });
  }

  // Install root dependencies with optimization
  console.log('📦 Installing root dependencies...');
  execSync('npm ci --omit=dev --no-audit --no-fund', { stdio: 'inherit' });

  // Build Next.js app
  console.log('🏗️  Building Next.js application...');
  process.chdir('new-nextjs-app');
  
  // Install Next.js dependencies
  execSync('npm ci --no-audit --no-fund', { stdio: 'inherit' });
  
  // Build with optimization
  execSync('npm run build', { stdio: 'inherit' });
  
  process.chdir('..');

  // Create optimized ecosystem configuration
  console.log('⚡ Creating optimized PM2 ecosystem...');
  const optimizedEcosystem = {
    apps: [
      {
        name: 'nextjs-frontend',
        script: './nextjs/server.js',
        cwd: './',
        instances: process.env.NODE_ENV === 'production' ? 'max' : 1,
        exec_mode: 'cluster',
        max_memory_restart: '1G',
        node_args: '--max-old-space-size=1024 --enable-source-maps=false',
        env: {
          NODE_ENV: 'production',
          PORT: process.env.PORT || 3000,
          HOSTNAME: '0.0.0.0',
          NEXT_SHARP: '0',
          NEXT_TELEMETRY_DISABLED: '1',
          UV_THREADPOOL_SIZE: '128'
        },
        error_file: './logs/nextjs-error.log',
        out_file: './logs/nextjs-out.log',
        log_file: './logs/nextjs-combined.log',
        log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
        time: true,
        autorestart: true,
        watch: false,
        max_restarts: 3,
        min_uptime: '10s',
        kill_timeout: 5000,
        listen_timeout: 3000
      },
      {
        name: 'express-backend',
        script: './server/server.js',
        cwd: './',
        instances: 2,
        exec_mode: 'cluster',
        max_memory_restart: '1G',
        node_args: '--max-old-space-size=1024 --enable-source-maps=false',
        env: {
          NODE_ENV: 'production',
          PORT: process.env.BACKEND_PORT || 5000,
          UV_THREADPOOL_SIZE: '128'
        },
        error_file: './logs/server-error.log',
        out_file: './logs/server-out.log',
        log_file: './logs/server-combined.log',
        log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
        time: true,
        autorestart: true,
        watch: false,
        max_restarts: 3,
        min_uptime: '10s',
        kill_timeout: 5000,
        listen_timeout: 3000
      }
    ]
  };

  fs.writeFileSync('ecosystem.railway.config.js', 
    `module.exports = ${JSON.stringify(optimizedEcosystem, null, 2)};`
  );

  // Create optimized health check
  console.log('🩺 Creating optimized health check...');
  const optimizedHealthCheck = `
const http = require('http');

const checkServer = (port, path = '/', timeout = 3000) => {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: 'localhost',
      port: port,
      path: path,
      method: 'GET',
      timeout: timeout,
      headers: { 'User-Agent': 'Railway-HealthCheck/1.0' }
    }, (res) => {
      if (res.statusCode >= 200 && res.statusCode < 400) {
        resolve({ port, status: 'healthy' });
      } else {
        reject(new Error(\`Port \${port} returned \${res.statusCode}\`));
      }
    });

    req.on('error', (err) => reject(new Error(\`Port \${port}: \${err.message}\`)));
    req.on('timeout', () => {
      req.destroy();
      reject(new Error(\`Port \${port} timeout\`));
    });

    req.end();
  });
};

const healthCheck = async () => {
  try {
    const checks = await Promise.allSettled([
      checkServer(\${process.env.PORT || 3000}, '/'),
      checkServer(\${process.env.BACKEND_PORT || 5000}, '/api/v1/health')
    ]);
    
    const healthy = checks.some(check => check.status === 'fulfilled');
    
    if (healthy) {
      console.log('✅ Health check passed');
      process.exit(0);
    } else {
      throw new Error('All services are down');
    }
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
    process.exit(1);
  }
};

healthCheck();
`;

  fs.writeFileSync('healthcheck.railway.js', optimizedHealthCheck);

  // Create logs directory
  if (!fs.existsSync('logs')) {
    fs.mkdirSync('logs', { recursive: true });
    console.log('✓ Created logs directory');
  }

  console.log('✅ Railway deployment optimization complete!');
  console.log('🎯 Performance optimizations applied:');
  console.log('   • Next.js build optimized for production');
  console.log('   • PM2 clustering enabled');
  console.log('   • Memory limits set to 1GB per process');
  console.log('   • Source maps disabled for production');
  console.log('   • Thread pool optimized');
  console.log('   • Health check optimized');
  console.log('');
  console.log('🚀 Ready for Railway deployment!');
  console.log('💡 Use: pm2-runtime start ecosystem.railway.config.js');

} catch (error) {
  console.error('❌ Deployment optimization failed:', error.message);
  process.exit(1);
}