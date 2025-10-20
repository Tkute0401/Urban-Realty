#!/bin/bash

# Urban Realty Mobile - Build Script
# This script automates the build process for different environments

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Functions
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

# Check Flutter installation
check_flutter() {
    if ! command -v flutter &> /dev/null; then
        print_error "Flutter is not installed"
        exit 1
    fi
    print_success "Flutter is installed"
}

# Clean build
clean_build() {
    print_info "Cleaning build..."
    flutter clean
    flutter pub get
    print_success "Build cleaned"
}

# Run tests
run_tests() {
    print_info "Running tests..."
    flutter test
    print_success "Tests passed"
}

# Build Android
build_android() {
    local flavor=$1
    local build_type=$2
    
    print_info "Building Android ($flavor - $build_type)..."
    
    if [ "$build_type" == "apk" ]; then
        flutter build apk --release --flavor $flavor --split-per-abi
    else
        flutter build appbundle --release --flavor $flavor
    fi
    
    print_success "Android build completed"
}

# Build iOS
build_ios() {
    local flavor=$1
    
    print_info "Building iOS ($flavor)..."
    flutter build ios --release --flavor $flavor --no-codesign
    print_success "iOS build completed"
}

# Main script
main() {
    local platform=$1
    local flavor=${2:-production}
    local build_type=${3:-appbundle}
    
    print_info "Starting build process..."
    print_info "Platform: $platform"
    print_info "Flavor: $flavor"
    
    check_flutter
    clean_build
    run_tests
    
    case $platform in
        android)
            build_android $flavor $build_type
            ;;
        ios)
            build_ios $flavor
            ;;
        all)
            build_android $flavor $build_type
            build_ios $flavor
            ;;
        *)
            print_error "Invalid platform: $platform"
            echo "Usage: ./build.sh [android|ios|all] [development|staging|production] [apk|appbundle]"
            exit 1
            ;;
    esac
    
    print_success "Build process completed successfully!"
}

# Run main function
main "$@"



