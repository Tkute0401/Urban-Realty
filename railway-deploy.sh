#!/bin/bash
# Railway deployment optimization script

set -e

echo "=== Railway Deployment Optimization ==="

# Ensure we're using the correct Node.js version
echo "Checking Node.js version..."
node --version

# Clean npm cache to avoid version conflicts
echo "Cleaning npm cache..."
npm cache clean --force

# Remove node_modules to ensure clean install
echo "Removing existing node_modules..."
rm -rf node_modules
rm -rf new-nextjs-app/node_modules
rm -rf server/node_modules

# Install with exact versions and production optimizations
echo "Installing root dependencies..."
npm ci --only=production --no-audit --no-fund --silent

# Install Next.js dependencies
echo "Installing Next.js dependencies..."
cd new-nextjs-app
npm ci --only=production --no-audit --no-fund --silent
npm ci --no-audit --no-fund --silent
cd ..

# Install server dependencies
echo "Installing server dependencies..."
cd server
npm ci --only=production --no-audit --no-fund --silent
cd ..

# Build Next.js with optimizations
echo "Building Next.js application..."
cd new-nextjs-app
NEXT_TELEMETRY_DISABLED=1 NODE_ENV=production npm run build
cd ..

# Install PM2 globally
echo "Installing PM2..."
npm install pm2@latest -g --no-audit --no-fund --silent

# Create necessary directories
echo "Creating application directories..."
mkdir -p uploads logs

# Set proper permissions
echo "Setting permissions..."
chmod -R 755 uploads logs

echo "=== Deployment preparation complete ==="
echo "Node.js version: $(node --version)"
echo "NPM version: $(npm --version)"
echo "PM2 version: $(pm2 --version)"

# Validate the build
if [ -d "new-nextjs-app/.next" ]; then
    echo "✅ Next.js build successful"
else
    echo "❌ Next.js build failed"
    exit 1
fi

if [ -f "ecosystem.config.js" ]; then
    echo "✅ PM2 ecosystem config found"
else
    echo "❌ PM2 ecosystem config missing"
    exit 1
fi

echo "=== Ready for deployment ==="