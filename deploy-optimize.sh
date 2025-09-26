#!/bin/bash

echo "🚀 Starting optimized deployment for Squarefooot..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Check if Node.js 20+ is available
if ! node --version | grep -E "v(2[0-9]|[3-9][0-9])" > /dev/null; then
    print_error "Node.js 20+ is required for optimal performance"
    exit 1
fi

print_status "Node.js version check passed: $(node --version)"

# Clean up any existing builds
print_status "Cleaning previous builds..."
rm -rf new-nextjs-app/.next
rm -rf new-nextjs-app/out
rm -rf client/dist
rm -rf node_modules/.cache

# Install dependencies with optimizations
print_status "Installing root dependencies..."
npm ci --only=production --no-audit --no-fund

print_status "Installing Next.js dependencies..."
cd new-nextjs-app
npm ci --only=production --no-audit --no-fund
npm ci --no-audit --no-fund

# Build Next.js application with optimizations
print_status "Building Next.js application..."
export NODE_ENV=production
export NEXT_TELEMETRY_DISABLED=1
export NEXT_SHARP=0

npm run build

if [ $? -ne 0 ]; then
    print_error "Next.js build failed"
    exit 1
fi

cd ..

# Verify build outputs
if [ ! -d "new-nextjs-app/.next" ]; then
    print_error "Next.js build output not found"
    exit 1
fi

print_status "Build verification passed"

# Generate optimized ecosystem config if needed
print_status "Verifying PM2 configuration..."
if [ ! -f "ecosystem.config.js" ]; then
    print_error "PM2 ecosystem configuration not found"
    exit 1
fi

# Create logs directory if it doesn't exist
mkdir -p logs

print_status "Pre-deployment health checks..."

# Check if required environment variables are set (for local testing)
required_vars=("MONGO_URI" "JWT_SECRET" "CLOUDINARY_CLOUD_NAME")
for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        print_warning "Environment variable $var not set (should be configured in Railway)"
    fi
done

# Performance optimization summary
print_status "Deployment optimizations applied:"
echo "  • Node.js 20+ for better performance"
echo "  • Optimized npm installations (ci, no-audit, no-fund)"
echo "  • Next.js production build with standalone output"
echo "  • PM2 process management with clustering"
echo "  • Telemetry disabled for faster builds"
echo "  • Image optimization disabled (using Cloudinary)"
echo "  • Advanced caching headers configured"
echo "  • Web Vitals monitoring enabled"
echo "  • Performance observers active"

print_status "Ready for Railway deployment!"
print_status "Make sure to set environment variables in Railway dashboard"

echo ""
echo "🎯 Expected Railway Environment Variables:"
echo "   NODE_ENV=production"
echo "   MONGO_URI=<your-mongodb-connection>"
echo "   JWT_SECRET=<your-jwt-secret>"
echo "   CLOUDINARY_CLOUD_NAME=<your-cloudinary-name>"
echo "   CLOUDINARY_API_KEY=<your-cloudinary-key>"
echo "   CLOUDINARY_API_SECRET=<your-cloudinary-secret>"
echo "   NEXT_PUBLIC_API_URL=https://your-app.up.railway.app/api/v1"
echo "   NEXT_PUBLIC_BASE_URL=https://your-app.up.railway.app"
echo "   CORS_ORIGIN=https://your-app.up.railway.app"
echo ""

print_status "Deployment optimization complete! 🎉"