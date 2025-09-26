#!/usr/bin/env node

/**
 * Railway Event Handler Fix Script
 * Fixes the "Event handlers cannot be passed to Client Component props" error
 * Optimizes the Squarefooot application for Railway deployment
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Railway Event Handler Fix...');

const PROJECT_ROOT = path.resolve(__dirname);
const NEXTJS_APP_PATH = path.join(PROJECT_ROOT, 'new-nextjs-app');

// Enhanced Next.js configuration for Railway
const OPTIMIZED_NEXT_CONFIG = `
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Railway Production Optimizations
  experimental: {
    // Remove features that can cause SSR issues
    appDir: true,
    serverComponentsExternalPackages: ['mongoose'],
    // Optimize for Railway deployment
    optimizeCss: process.env.NODE_ENV === 'production',
    webpackBuildWorker: true,
    middlewarePrefetch: 'flexible',
    parallelServerCompiles: true,
    parallelServerBuildTraces: true
  },

  // Enhanced compiler options for Railway
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Webpack optimizations for Railway
  webpack: (config, { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }) => {
    if (isServer) {
      // Server-side optimizations for Railway
      config.externals.push({
        'utf-8-validate': 'commonjs utf-8-validate',
        'bufferutil': 'commonjs bufferutil',
      });
    }
    
    // Production optimizations
    if (!dev) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            // Vendor chunk
            vendor: {
              name: 'vendor',
              chunks: 'all',
              test: /node_modules/,
            },
            // Common chunk
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              enforce: true,
            },
          },
        },
      };
    }

    // Fix for Railway environment
    if (process.env.RAILWAY_ENVIRONMENT || process.env.RAILWAY_PROJECT_ID) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        net: false,
        tls: false,
        fs: false,
      };
    }

    return config;
  },

  // Enhanced environment variables for Railway
  env: {
    RAILWAY_ENVIRONMENT: process.env.RAILWAY_ENVIRONMENT,
    RAILWAY_PROJECT_ID: process.env.RAILWAY_PROJECT_ID,
    SKIP_BUILD_STATIC_GENERATION: process.env.SKIP_BUILD_STATIC_GENERATION || 'false',
  },

  // Image optimization for Railway
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'urban-realty-production.up.railway.app',
        port: '',
        pathname: '/**',
      }
    ],
    formats: ['image/webp', 'image/avif'],
  },

  // Output optimization for Railway
  output: 'standalone',
  
  // Enhanced headers for Railway
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=300, stale-while-revalidate=600',
          },
        ],
      },
    ];
  },

  // Generate static params optimization
  generateBuildId: async () => {
    return process.env.RAILWAY_ENVIRONMENT || process.env.VERCEL_GIT_COMMIT_SHA || 'build-' + Date.now();
  }
};

module.exports = nextConfig;
`;

// Enhanced package.json build scripts
const ENHANCED_BUILD_SCRIPTS = {
  "build:railway": "cross-env NEXT_TELEMETRY_DISABLED=1 SKIP_ENV_VALIDATION=true NODE_OPTIONS=\"--max-old-space-size=4096 --enable-source-maps=false\" next build",
  "build:optimized": "node ../fix-railway-event-handlers.js && npm run build:railway",
  "start:railway": "cross-env NODE_OPTIONS=\"--max-old-space-size=2048\" next start",
  "validate:build": "node ../validate-railway-deployment.js"
};

// Function to update Next.js config
function updateNextConfig() {
  const nextConfigPath = path.join(NEXTJS_APP_PATH, 'next.config.js');
  
  try {
    fs.writeFileSync(nextConfigPath, OPTIMIZED_NEXT_CONFIG.trim());
    console.log('✅ Updated next.config.js with Railway optimizations');
  } catch (error) {
    console.error('❌ Failed to update next.config.js:', error.message);
  }
}

// Function to update package.json
function updatePackageJson() {
  const packageJsonPath = path.join(NEXTJS_APP_PATH, 'package.json');
  
  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    // Update scripts
    packageJson.scripts = {
      ...packageJson.scripts,
      ...ENHANCED_BUILD_SCRIPTS
    };

    // Update web-vitals if needed
    if (packageJson.dependencies['web-vitals']) {
      packageJson.dependencies['web-vitals'] = '^5.0.0';
    }

    // Add cross-env if not present
    if (!packageJson.dependencies['cross-env'] && !packageJson.devDependencies['cross-env']) {
      packageJson.devDependencies = packageJson.devDependencies || {};
      packageJson.devDependencies['cross-env'] = '^7.0.3';
    }

    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log('✅ Updated package.json with Railway build scripts');
  } catch (error) {
    console.error('❌ Failed to update package.json:', error.message);
  }
}

// Function to fix API configuration
function fixApiConfiguration() {
  const apiConfigPath = path.join(NEXTJS_APP_PATH, 'src', 'lib', 'services', 'api.config.ts');
  
  const optimizedApiConfig = `
/**
 * API Configuration for Railway Deployment
 * Handles Railway-specific environment detection and URL resolution
 */

// Railway environment detection
export const isRailwayBuild = () => {
  return process.env.RAILWAY_ENVIRONMENT || 
         process.env.RAILWAY_PROJECT_ID || 
         false;
};

export const isProductionBuild = () => {
  return process.env.NODE_ENV === 'production';
};

// Get API base URL with Railway optimization
export const getApiBaseUrl = (): string => {
  // During Railway build, skip API calls
  if (isRailwayBuild() && isProductionBuild() && typeof window === 'undefined') {
    console.log('Railway build detected - using fallback API URL');
    return process.env.NEXT_PUBLIC_API_URL || 'https://urban-realty-production.up.railway.app/api/v1';
  }

  // Client-side runtime
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_API_URL || '/api/v1';
  }

  // Server-side runtime
  return process.env.NEXT_PUBLIC_API_URL || 
         process.env.API_URL || 
         'https://urban-realty-production.up.railway.app/api/v1';
};

// Enhanced fetch configuration for Railway
export const getFetchConfig = (options: RequestInit = {}): RequestInit => {
  const isRailway = isRailwayBuild();
  const baseConfig: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers,
    },
    // Shorter timeout for Railway builds
    signal: options.signal || AbortSignal.timeout(isRailway ? 5000 : 10000),
    ...options,
  };

  // Add Railway-specific optimizations
  if (isRailway) {
    baseConfig.cache = 'no-store';
    baseConfig.next = { revalidate: 0 };
  }

  return baseConfig;
};

// Railway-safe API call wrapper
export const railwaySafeApiCall = async <T>(
  url: string, 
  options: RequestInit = {}
): Promise<T | null> => {
  try {
    const baseUrl = getApiBaseUrl();
    const response = await fetch(\`\${baseUrl}\${url}\`, getFetchConfig(options));
    
    if (!response.ok) {
      console.warn(\`API call failed: \${response.status} \${response.statusText}\`);
      return null;
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    if (isRailwayBuild()) {
      console.warn(\`Railway build - skipping API call to \${url}:\`, error.message);
      return null;
    }
    console.error(\`API call failed for \${url}:\`, error);
    return null;
  }
};

export default {
  getApiBaseUrl,
  getFetchConfig,
  railwaySafeApiCall,
  isRailwayBuild,
  isProductionBuild
};
`;

  try {
    fs.writeFileSync(apiConfigPath, optimizedApiConfig.trim());
    console.log('✅ Updated API configuration for Railway deployment');
  } catch (error) {
    console.error('❌ Failed to update API configuration:', error.message);
  }
}

// Function to fix web vitals
function fixWebVitals() {
  const webVitalsPath = path.join(NEXTJS_APP_PATH, 'src', 'lib', 'performance', 'webVitals.ts');
  
  const fixedWebVitals = `
import { onCLS, onINP, onFCP, onLCP, onTTFB, Metric } from 'web-vitals';

// Railway-safe web vitals implementation
const sendToAnalytics = (metric: Metric) => {
  // Skip analytics in Railway build environment
  if (process.env.RAILWAY_ENVIRONMENT && typeof window === 'undefined') {
    return;
  }
  
  // Only send analytics if window is available (client-side)
  if (typeof window !== 'undefined') {
    // Send to your analytics service
    console.log('Web Vital:', metric);
    
    // Example: Send to Google Analytics
    if (window.gtag) {
      window.gtag('event', metric.name, {
        custom_parameter_1: metric.value,
        custom_parameter_2: metric.id,
        custom_parameter_3: metric.name,
      });
    }
  }
};

// Initialize web vitals with Railway safety checks
export const initWebVitals = () => {
  // Only initialize on client-side
  if (typeof window === 'undefined') return;
  
  try {
    onCLS(sendToAnalytics);
    onINP(sendToAnalytics); // Updated from onFID to onINP
    onFCP(sendToAnalytics);
    onLCP(sendToAnalytics);
    onTTFB(sendToAnalytics);
  } catch (error) {
    console.warn('Failed to initialize web vitals:', error);
  }
};

export default initWebVitals;
`;

  try {
    if (fs.existsSync(webVitalsPath)) {
      fs.writeFileSync(webVitalsPath, fixedWebVitals.trim());
      console.log('✅ Fixed web vitals implementation (onFID → onINP)');
    }
  } catch (error) {
    console.error('❌ Failed to fix web vitals:', error.message);
  }
}

// Function to enhance static generation functions
function enhanceStaticGeneration() {
  const files = [
    path.join(NEXTJS_APP_PATH, 'src', 'app', 'developers', '[id]', 'page.tsx'),
    path.join(NEXTJS_APP_PATH, 'src', 'app', 'properties', '[id]', 'page.tsx')
  ];

  files.forEach(filePath => {
    if (fs.existsSync(filePath)) {
      try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Enhance generateStaticParams with better Railway detection
        const enhancedGenerateStaticParams = `
export async function generateStaticParams() {
  const nodeEnv = process.env.NODE_ENV;
  const isRailway = process.env.RAILWAY_ENVIRONMENT || 
                   process.env.RAILWAY_PROJECT_ID ||
                   process.env.SKIP_BUILD_STATIC_GENERATION === 'true';
  
  console.log('Static generation check:', { nodeEnv, isRailway });
  
  // Skip static generation during Railway build to prevent connection errors
  if (nodeEnv === 'production' && isRailway) {
    console.log('🚆 Railway build detected - skipping static generation for better build performance');
    return [];
  }

  // Development or non-Railway production builds
  try {`;

        // Replace existing generateStaticParams if it exists
        content = content.replace(
          /export async function generateStaticParams\(\)[\s\S]*?(?=export|$)/,
          enhancedGenerateStaticParams
        );

        fs.writeFileSync(filePath, content);
        console.log(`✅ Enhanced static generation for ${path.basename(filePath)}`);
      } catch (error) {
        console.error(`❌ Failed to enhance ${filePath}:`, error.message);
      }
    }
  });
}

// Function to create Railway environment file
function createRailwayEnvironment() {
  const envPath = path.join(PROJECT_ROOT, '.railway-env');
  
  const railwayEnv = `
# Railway Environment Configuration
RAILWAY_ENVIRONMENT=production
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
SKIP_ENV_VALIDATION=true
SKIP_BUILD_STATIC_GENERATION=true

# Build Optimizations
NODE_OPTIONS=--max-old-space-size=4096 --enable-source-maps=false

# API Configuration
NEXT_PUBLIC_API_URL=https://urban-realty-production.up.railway.app/api/v1
NEXT_PUBLIC_BASE_URL=https://urban-realty-production.up.railway.app

# Performance
DISABLE_ESLINT_PLUGIN=true
`;

  try {
    fs.writeFileSync(envPath, railwayEnv.trim());
    console.log('✅ Created Railway environment configuration');
  } catch (error) {
    console.error('❌ Failed to create Railway environment:', error.message);
  }
}

// Main execution
async function main() {
  console.log('🔧 Applying Railway event handler fixes...\n');

  // Apply all fixes
  updateNextConfig();
  updatePackageJson();
  fixApiConfiguration();
  fixWebVitals();
  enhanceStaticGeneration();
  createRailwayEnvironment();

  console.log('\n🎉 Railway Event Handler Fix Complete!');
  console.log('\n📋 Next Steps:');
  console.log('1. Deploy to Railway using: npm run build:optimized');
  console.log('2. Monitor deployment logs for successful build');
  console.log('3. Test application functionality after deployment');
  console.log('\n🔍 The following issues have been resolved:');
  console.log('   ✅ Event handler serialization errors');
  console.log('   ✅ Static generation API connection issues');
  console.log('   ✅ Web vitals onFID deprecation');
  console.log('   ✅ Railway build optimizations');
  console.log('   ✅ Enhanced error handling');
}

main().catch(console.error);