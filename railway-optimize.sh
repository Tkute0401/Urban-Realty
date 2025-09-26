#!/bin/bash

# Railway Optimization Script for Squarefooot Urban Realty
# Optimizes deployment for speed, SEO, and SSR

echo "🚀 Starting Railway optimization for Squarefooot..."

# Set environment variables for optimization
export NODE_ENV=production
export NEXT_TELEMETRY_DISABLED=1
export NEXT_SHARP=0
export NPM_CONFIG_PRODUCTION=true
export NODE_OPTIONS="--max-old-space-size=4096"

# Clean up any existing build artifacts
echo "🧹 Cleaning up build artifacts..."
rm -rf new-nextjs-app/.next
rm -rf new-nextjs-app/out
rm -rf node_modules/.cache

# Install dependencies with optimization
echo "📦 Installing optimized dependencies..."
npm ci --omit=dev --no-audit --no-fund

# Build Next.js app with optimization
echo "🏗️  Building Next.js app with optimizations..."
cd new-nextjs-app
npm ci --no-audit --no-fund
npm run build

# Create optimized PM2 ecosystem
echo "⚡ Creating optimized PM2 configuration..."
cd ..

cat > ecosystem.optimized.config.js << 'EOF'
module.exports = {
  apps: [
    {
      name: 'nextjs-frontend',
      script: './nextjs/server.js',
      cwd: './',
      instances: 'max',
      exec_mode: 'cluster',
      max_memory_restart: '1G',
      node_args: '--max-old-space-size=1024 --enable-source-maps=false',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
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
      max_restarts: 5,
      min_uptime: '10s',
      kill_timeout: 5000,
      listen_timeout: 3000,
      instance_var: 'INSTANCE_ID'
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
        PORT: 5000,
        UV_THREADPOOL_SIZE: '128'
      },
      error_file: './logs/server-error.log',
      out_file: './logs/server-out.log',
      log_file: './logs/server-combined.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      time: true,
      autorestart: true,
      watch: false,
      max_restarts: 5,
      min_uptime: '10s',
      kill_timeout: 5000,
      listen_timeout: 3000,
      instance_var: 'INSTANCE_ID'
    }
  ]
};
EOF

# Create optimized health check
echo "🩺 Creating optimized health check..."
cat > healthcheck.optimized.js << 'EOF'
const http = require('http');

const checkServer = (port, path = '/', timeout = 3000) => {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: 'localhost',
      port: port,
      path: path,
      method: 'GET',
      timeout: timeout,
      headers: {
        'User-Agent': 'Railway-HealthCheck/1.0'
      }
    }, (res) => {
      if (res.statusCode >= 200 && res.statusCode < 400) {
        resolve({ port, status: 'healthy', statusCode: res.statusCode });
      } else {
        reject(new Error(`Port ${port} returned ${res.statusCode}`));
      }
    });

    req.on('error', (err) => reject(new Error(`Port ${port}: ${err.message}`)));
    req.on('timeout', () => {
      req.destroy();
      reject(new Error(`Port ${port} timeout`));
    });

    req.end();
  });
};

const healthCheck = async () => {
  try {
    const [nextjs, backend] = await Promise.all([
      checkServer(3000, '/').catch(() => ({ port: 3000, status: 'down' })),
      checkServer(5000, '/api/v1/health').catch(() => ({ port: 5000, status: 'down' }))
    ]);
    
    if (nextjs.status === 'healthy' || backend.status === 'healthy') {
      console.log('✅ Health check passed');
      process.exit(0);
    } else {
      throw new Error('Both services are down');
    }
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
    process.exit(1);
  }
};

healthCheck();
EOF

echo "✅ Railway optimization complete!"
echo "🔍 Run with: pm2-runtime start ecosystem.optimized.config.js"