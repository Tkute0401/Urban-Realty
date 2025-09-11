// Shared configuration across all platforms

import { API_CONFIG, THEME_CONFIG } from '../constants/index.js';

/**
 * Shared application configuration
 */
export const AppConfig = {
  // Application metadata
  app: {
    name: 'Urban Realty',
    version: '1.0.0',
    description: 'Comprehensive real estate platform',
    author: 'Urban Realty Team'
  },
  
  // API configuration
  api: {
    baseUrl: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    retryAttempts: API_CONFIG.RETRY_ATTEMPTS,
    retryDelay: API_CONFIG.RETRY_DELAY,
    endpoints: {
      auth: '/auth',
      properties: '/properties',
      users: '/users',
      subscriptions: '/subscriptions',
      admin: '/admin'
    }
  },
  
  // Theme configuration
  theme: {
    colors: THEME_CONFIG.COLORS,
    breakpoints: THEME_CONFIG.BREAKPOINTS,
    typography: {
      fontFamily: {
        primary: 'Inter, system-ui, sans-serif',
        secondary: 'Georgia, serif'
      },
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem'
      }
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
      '2xl': '3rem',
      '3xl': '4rem'
    }
  },
  
  // Feature flags
  features: {
    enableAnalytics: true,
    enableNotifications: true,
    enableChat: true,
    enableVideoCalls: false,
    enableAdvancedSearch: true,
    enablePropertyComparison: true,
    enableWishlist: true,
    enableSocialSharing: true
  },
  
  // Validation configuration
  validation: {
    password: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true
    },
    fileUpload: {
      maxSize: 10 * 1024 * 1024, // 10MB
      allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp'],
      allowedDocumentTypes: ['application/pdf', 'application/msword']
    }
  },
  
  // Pagination configuration
  pagination: {
    defaultPageSize: 10,
    maxPageSize: 100,
    pageSizeOptions: [10, 20, 50, 100]
  },
  
  // Cache configuration
  cache: {
    defaultTTL: 300, // 5 minutes
    maxTTL: 3600, // 1 hour
    userProfileTTL: 1800, // 30 minutes
    propertyListTTL: 600, // 10 minutes
    propertyDetailsTTL: 1800 // 30 minutes
  },
  
  // Social media configuration
  social: {
    facebook: {
      appId: process.env.FACEBOOK_APP_ID || '',
      enabled: false
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      enabled: false
    },
    twitter: {
      apiKey: process.env.TWITTER_API_KEY || '',
      enabled: false
    }
  },
  
  // Analytics configuration
  analytics: {
    googleAnalytics: {
      trackingId: process.env.GA_TRACKING_ID || '',
      enabled: process.env.NODE_ENV === 'production'
    },
    mixpanel: {
      token: process.env.MIXPANEL_TOKEN || '',
      enabled: false
    }
  },
  
  // Error tracking
  errorTracking: {
    sentry: {
      dsn: process.env.SENTRY_DSN || '',
      enabled: process.env.NODE_ENV === 'production'
    }
  }
};

/**
 * Environment-specific configuration
 */
export const getEnvironmentConfig = (env = process.env.NODE_ENV) => {
  const baseConfig = AppConfig;
  
  switch (env) {
    case 'development':
      return {
        ...baseConfig,
        api: {
          ...baseConfig.api,
          baseUrl: 'http://localhost:5000/api/v1',
          timeout: 10000
        },
        features: {
          ...baseConfig.features,
          enableAnalytics: false
        }
      };
      
    case 'staging':
      return {
        ...baseConfig,
        api: {
          ...baseConfig.api,
          baseUrl: 'https://urban-realty-staging.up.railway.app/api/v1'
        }
      };
      
    case 'production':
      return {
        ...baseConfig,
        api: {
          ...baseConfig.api,
          baseUrl: 'https://urban-realty-production.up.railway.app/api/v1'
        }
      };
      
    default:
      return baseConfig;
  }
};

/**
 * Get configuration for specific platform
 */
export const getPlatformConfig = (platform, env = process.env.NODE_ENV) => {
  const config = getEnvironmentConfig(env);
  
  switch (platform) {
    case 'web':
      return {
        ...config,
        features: {
          ...config.features,
          enableNotifications: 'Notification' in window,
          enableGeolocation: 'geolocation' in navigator
        }
      };
      
    case 'mobile':
      return {
        ...config,
        features: {
          ...config.features,
          enablePushNotifications: true,
          enableBiometricAuth: true,
          enableOfflineMode: true
        }
      };
      
    case 'server':
      return {
        ...config,
        features: {
          ...config.features,
          enableFileUpload: true,
          enableEmailService: true,
          enablePaymentProcessing: true
        }
      };
      
    default:
      return config;
  }
};