#!/bin/bash

# Squarefooot Railway Build Script - Optimized for Speed, SEO, and SSR

set -e

echo "🏠 Starting Squarefooot Railway deployment build..."

# Set optimization environment variables
export NODE_ENV=production
export NEXT_TELEMETRY_DISABLED=1
export DISABLE_ESLINT_PLUGIN=true
export CI=true
export HUSKY=0
export NODE_OPTIONS="--max-old-space-size=4096"

# Create necessary directories
mkdir -p logs uploads tmp

echo "📦 Installing dependencies with optimizations..."

# Configure npm for faster installs
npm config set cache /tmp/npm-cache --global
npm config set registry https://registry.npmjs.org/ --global
npm config set fetch-retries 3 --global
npm config set fetch-retry-mintimeout 10000 --global
npm config set fetch-retry-maxtimeout 60000 --global

# Install root dependencies (excluding husky in production)
npm ci --omit=dev --no-audit --no-fund --silent

echo "🏗️ Building Next.js frontend..."

# Build Next.js with optimizations
cd new-nextjs-app
npm ci --only=production --no-audit --no-fund --silent
npm run build

# Copy built assets to root for Docker
cd ..

echo "🚀 Build completed successfully!"
echo "📊 Build size optimization:"
du -sh new-nextjs-app/.next/

echo "✅ Squarefooot ready for Railway deployment!"