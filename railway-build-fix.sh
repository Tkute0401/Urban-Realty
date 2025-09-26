#!/bin/bash

# Railway Build Fix Script for Squarefooot
# This script optimizes the build process for Railway deployment

set -e

echo "🚀 Starting Railway build optimization for Squarefooot..."

# Set environment variables for optimal builds
export NODE_ENV=production
export NEXT_TELEMETRY_DISABLED=1
export DISABLE_ESLINT_PLUGIN=true
export NODE_OPTIONS="--max-old-space-size=4096"
export SKIP_ENV_VALIDATION=true

# Change to Next.js app directory
cd new-nextjs-app

echo "📦 Installing dependencies..."
npm ci --no-audit --no-fund --silent

echo "🔍 Checking TypeScript paths..."
npx tsc --noEmit --skipLibCheck

echo "🏗️ Building Next.js application with optimizations..."
npm run build

echo "✅ Build completed successfully!"

# Return to root directory
cd ..

echo "🎉 Railway build optimization complete for Squarefooot!"