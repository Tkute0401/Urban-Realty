#!/bin/bash

# Build script for Urban Realty application
set -e

echo "🚀 Starting build process..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Install server dependencies
echo "📦 Installing server dependencies..."
npm install

# Install client dependencies
echo "📦 Installing client dependencies..."
cd client
npm install

# Check if dist.zip exists and extract it, otherwise build
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

echo "✅ Build process completed successfully!"
echo ""
echo "To start the server, run:"
echo "  npm start"
echo ""
echo "Or for development:"
echo "  npm run dev"