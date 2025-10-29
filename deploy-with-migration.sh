#!/bin/bash

# Deployment Script with Project Favorites Migration
# This script handles deployment and runs the necessary migrations

set -e  # Exit on any error

echo "🚀 Urban Realty - Deployment with Project Favorites Migration"
echo "============================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

print_status "Environment checks passed"

# Install dependencies
print_status "Installing dependencies..."
npm run install-all

if [ $? -ne 0 ]; then
    print_error "Failed to install dependencies"
    exit 1
fi

print_success "Dependencies installed successfully"

# Check if MongoDB URI is set
if [ -z "$MONGODB_URI" ] && [ -z "$DATABASE_URL" ]; then
    print_warning "MONGODB_URI or DATABASE_URL not set. Migration will use default local MongoDB."
    print_warning "Make sure MongoDB is running locally or set the environment variable."
fi

# Run migration test (optional)
if [ "$1" = "--test" ]; then
    print_status "Running migration test..."
    npm run test:migration
    
    if [ $? -ne 0 ]; then
        print_error "Migration test failed"
        exit 1
    fi
    
    print_success "Migration test passed"
fi

# Run the migration
print_status "Running project favorites migration..."
npm run migrate:project-favorites

if [ $? -ne 0 ]; then
    print_error "Migration failed"
    exit 1
fi

print_success "Migration completed successfully"

# Build the application
print_status "Building the application..."
npm run build

if [ $? -ne 0 ]; then
    print_error "Build failed"
    exit 1
fi

print_success "Application built successfully"

# Start the application (if not in CI/CD environment)
if [ "$1" != "--no-start" ] && [ -z "$CI" ]; then
    print_status "Starting the application..."
    print_warning "Press Ctrl+C to stop the application"
    
    # Start both server and client
    npm run dev
else
    print_success "Deployment completed successfully!"
    print_status "Application is ready to start with: npm run dev"
fi

echo ""
echo "🎉 Deployment Summary:"
echo "====================="
echo "✅ Dependencies installed"
echo "✅ Project favorites migration completed"
echo "✅ Application built"
echo "✅ Ready for production"
echo ""
echo "📋 Post-deployment checklist:"
echo "   - [ ] Test project favorites functionality"
echo "   - [ ] Verify user profile page shows 'Project Favorites' tab"
echo "   - [ ] Check that users can add/remove project favorites"
echo "   - [ ] Test the project favorites page"
echo ""
echo "🔧 Useful commands:"
echo "   npm run migrate:project-favorites:rollback  # Rollback migration"
echo "   npm run test:migration                      # Test migration"
echo "   npm run dev                                 # Start development server"
echo ""
