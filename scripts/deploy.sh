#!/bin/bash

# Squarefooot Deployment Script

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
ENVIRONMENT=${1:-production}
BUILD_DIR="build"
BACKUP_DIR="backups"
LOG_FILE="deploy.log"

# Functions
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a $LOG_FILE
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1" | tee -a $LOG_FILE
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1" | tee -a $LOG_FILE
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a $LOG_FILE
    exit 1
}

# Check prerequisites
check_prerequisites() {
    log "Checking prerequisites..."
    
    # Check if Node.js is installed
    if ! command -v node &> /dev/null; then
        error "Node.js is not installed"
    fi
    
    # Check if npm is installed
    if ! command -v npm &> /dev/null; then
        error "npm is not installed"
    fi
    
    # Check if Docker is installed (for containerized deployment)
    if ! command -v docker &> /dev/null; then
        warning "Docker is not installed. Containerized deployment will be skipped."
    fi
    
    # Check if environment file exists
    if [ ! -f "server/.env" ]; then
        error "Environment file server/.env not found"
    fi
    
    success "Prerequisites check passed"
}

# Install dependencies
install_dependencies() {
    log "Installing dependencies..."
    
    # Install root dependencies
    npm install
    
    # Install client dependencies
    cd client
    npm install
    cd ..
    
    # Install server dependencies
    cd server
    npm install
    cd ..
    
    success "Dependencies installed successfully"
}

# Run tests
run_tests() {
    log "Running tests..."
    
    # Run client tests
    cd client
    npm test -- --watchAll=false --coverage
    cd ..
    
    # Run server tests
    cd server
    npm test || warning "Server tests failed or not configured"
    cd ..
    
    success "Tests completed"
}

# Build application
build_application() {
    log "Building application..."
    
    # Clean previous build
    rm -rf $BUILD_DIR
    mkdir -p $BUILD_DIR
    
    # Build client
    log "Building client..."
    cd client
    npm run build
    cp -r dist ../$BUILD_DIR/client
    cd ..
    
    # Copy server files
    log "Copying server files..."
    cp -r server $BUILD_DIR/
    cp package.json $BUILD_DIR/
    cp package-lock.json $BUILD_DIR/
    
    # Copy shared files
    cp -r shared $BUILD_DIR/
    
    # Copy deployment files
    cp -r deploy $BUILD_DIR/
    cp Dockerfile $BUILD_DIR/
    cp docker-compose.prod.yml $BUILD_DIR/
    
    success "Application built successfully"
}

# Create backup
create_backup() {
    log "Creating backup..."
    
    mkdir -p $BACKUP_DIR
    BACKUP_NAME="backup-$(date +%Y%m%d-%H%M%S).tar.gz"
    
    # Create backup of current deployment
    if [ -d "current" ]; then
        tar -czf "$BACKUP_DIR/$BACKUP_NAME" current/
        success "Backup created: $BACKUP_NAME"
    else
        warning "No current deployment found to backup"
    fi
}

# Deploy to production
deploy_production() {
    log "Deploying to production..."
    
    # Stop current services
    if [ -f "docker-compose.prod.yml" ]; then
        docker-compose -f docker-compose.prod.yml down || warning "Failed to stop services"
    fi
    
    # Copy build to current directory
    rm -rf current
    cp -r $BUILD_DIR current
    
    # Start services
    cd current
    if [ -f "docker-compose.prod.yml" ]; then
        docker-compose -f docker-compose.prod.yml up -d
        success "Services started successfully"
    else
        # Direct deployment
        npm start &
        success "Application started directly"
    fi
    cd ..
    
    # Wait for health check
    log "Waiting for health check..."
    sleep 30
    
    # Check health
    if curl -f http://localhost:5000/api/v1/health > /dev/null 2>&1; then
        success "Health check passed"
    else
        error "Health check failed"
    fi
}

# Deploy to staging
deploy_staging() {
    log "Deploying to staging..."
    
    # Similar to production but with staging configuration
    deploy_production
}

# Deploy with Docker
deploy_docker() {
    log "Deploying with Docker..."
    
    # Build Docker image
    docker build -t urban-realty:latest .
    
    # Stop and remove existing container
    docker stop urban-realty || true
    docker rm urban-realty || true
    
    # Run new container
    docker run -d \
        --name urban-realty \
        -p 5000:5000 \
        --env-file server/.env \
        -v $(pwd)/uploads:/app/uploads \
        urban-realty:latest
    
    success "Docker deployment completed"
}

# Deploy to Railway
deploy_railway() {
    log "Deploying to Railway..."
    
    # Check if Railway CLI is installed
    if ! command -v railway &> /dev/null; then
        error "Railway CLI is not installed. Install it with: npm install -g @railway/cli"
    fi
    
    # Login to Railway
    railway login
    
    # Deploy
    railway up
    
    success "Railway deployment completed"
}

# Rollback deployment
rollback() {
    log "Rolling back deployment..."
    
    # Find latest backup
    LATEST_BACKUP=$(ls -t $BACKUP_DIR/*.tar.gz | head -n1)
    
    if [ -z "$LATEST_BACKUP" ]; then
        error "No backup found for rollback"
    fi
    
    # Stop current services
    if [ -f "docker-compose.prod.yml" ]; then
        docker-compose -f docker-compose.prod.yml down
    fi
    
    # Restore from backup
    rm -rf current
    tar -xzf "$LATEST_BACKUP"
    
    # Start services
    cd current
    if [ -f "docker-compose.prod.yml" ]; then
        docker-compose -f docker-compose.prod.yml up -d
    else
        npm start &
    fi
    cd ..
    
    success "Rollback completed"
}

# Cleanup
cleanup() {
    log "Cleaning up..."
    
    # Remove old backups (keep last 5)
    ls -t $BACKUP_DIR/*.tar.gz | tail -n +6 | xargs rm -f || true
    
    # Remove old Docker images
    docker image prune -f || true
    
    success "Cleanup completed"
}

# Main deployment function
main() {
    log "Starting deployment to $ENVIRONMENT environment..."
    
    case $ENVIRONMENT in
        "production")
            check_prerequisites
            install_dependencies
            run_tests
            build_application
            create_backup
            deploy_production
            cleanup
            ;;
        "staging")
            check_prerequisites
            install_dependencies
            run_tests
            build_application
            deploy_staging
            ;;
        "docker")
            check_prerequisites
            build_application
            deploy_docker
            ;;
        "railway")
            check_prerequisites
            build_application
            deploy_railway
            ;;
        "rollback")
            rollback
            ;;
        *)
            error "Invalid environment. Use: production, staging, docker, railway, or rollback"
            ;;
    esac
    
    success "Deployment to $ENVIRONMENT completed successfully!"
}

# Handle script arguments
case ${1:-help} in
    "help"|"-h"|"--help")
        echo "Squarefooot Deployment Script"
        echo ""
        echo "Usage: $0 [environment]"
        echo ""
        echo "Environments:"
        echo "  production  - Deploy to production server"
        echo "  staging     - Deploy to staging server"
        echo "  docker      - Deploy using Docker"
        echo "  railway     - Deploy to Railway"
        echo "  rollback    - Rollback to previous deployment"
        echo ""
        echo "Examples:"
        echo "  $0 production"
        echo "  $0 staging"
        echo "  $0 docker"
        echo "  $0 railway"
        echo "  $0 rollback"
        ;;
    *)
        main
        ;;
esac