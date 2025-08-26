#!/bin/bash

# Railway build script for Urban Realty
set -e

echo "🚀 Starting Railway build process..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Install server dependencies
echo "📦 Installing server dependencies..."
npm install --production=false

# Install client dependencies
echo "📦 Installing client dependencies..."
cd client
npm install --production=false

# Build frontend or extract from zip
if [ -f "dist.zip" ]; then
    echo "📦 Extracting existing build from dist.zip..."
    unzip -o dist.zip
    echo "✅ Build extracted successfully"
else
    echo "🔨 Building frontend..."
    npm run build
    echo "✅ Frontend built successfully"
fi

cd ..

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p server/uploads
mkdir -p logs

# Verify frontend build
echo "🔍 Verifying frontend build..."
if [ -f "client/dist/index.html" ]; then
    echo "✅ Frontend build verified successfully"
    ls -la client/dist/
else
    echo "❌ Frontend build verification failed"
    exit 1
fi

echo "✅ Railway build process completed successfully!"