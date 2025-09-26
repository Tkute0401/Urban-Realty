/** @type {import('next').NextConfig} */
const nextConfig = {
  // Railway Production Optimizations
  experimental: {
    // Remove features that can cause SSR issues
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