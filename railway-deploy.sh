#!/bin/bash

# Railway Deployment Script for Urban Realty
# This script helps prepare and deploy the application to Railway

echo "🚀 Starting Railway deployment process..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the Next.js application
echo "🏗️  Building Next.js application..."
cd new-nextjs-app
npm install
npm run build
cd ..

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully!"
else
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi

# Create uploads directory if it doesn't exist
echo "📁 Creating uploads directory..."
mkdir -p uploads

# Set proper permissions
chmod 755 uploads

echo "✅ Railway deployment preparation complete!"
echo ""
echo "📝 Next steps:"
echo "1. Make sure all environment variables are set in Railway dashboard"
echo "2. Deploy to Railway using: railway up"
echo "3. Check the logs for any issues: railway logs"
echo ""
echo "🔧 Required environment variables:"
echo "   - MONGODB_URI"
echo "   - JWT_SECRET"
echo "   - NODE_ENV=production"
echo ""
echo "💡 Optional environment variables:"
echo "   - FRONTEND_URL"
echo "   - CORS_ORIGIN"
echo "   - CLOUDINARY_* (for image uploads)"
echo "   - RAZORPAY_* (for payments)"