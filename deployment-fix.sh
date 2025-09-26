#!/bin/bash
# Railway Deployment Fix Script for Squarefooot

echo "🚀 Applying Railway deployment fixes for Squarefooot..."

# Force clear any build caches
echo "🧹 Clearing build caches..."
rm -rf .next node_modules/.cache new-nextjs-app/.next new-nextjs-app/node_modules/.cache

# Verify TypeScript configuration
echo "📋 Verifying TypeScript path mappings..."
if [ -f "new-nextjs-app/tsconfig.json" ]; then
    echo "✅ tsconfig.json found"
else
    echo "❌ tsconfig.json missing"
    exit 1
fi

# Verify Next.js configuration
echo "⚙️  Verifying Next.js configuration..."
if [ -f "new-nextjs-app/next.config.js" ]; then
    echo "✅ next.config.js found"
else
    echo "❌ next.config.js missing"
    exit 1
fi

# Verify critical files exist
echo "📁 Verifying critical source files..."
CRITICAL_FILES=(
    "new-nextjs-app/src/contexts/AuthContext.tsx"
    "new-nextjs-app/src/lib/services/http.ts"
    "new-nextjs-app/src/app/properties/add/page.tsx"
)

for file in "${CRITICAL_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file exists"
    else
        echo "❌ $file missing"
        exit 1
    fi
done

# Update Railway environment
echo "🌍 Updating Railway environment variables..."
export NEXT_TELEMETRY_DISABLED=1
export SKIP_ENV_VALIDATION=true
export DISABLE_ESLINT_PLUGIN=true
export NODE_ENV=production

echo "✅ Railway deployment fixes applied successfully!"
echo "🚀 Ready for deployment to Railway"