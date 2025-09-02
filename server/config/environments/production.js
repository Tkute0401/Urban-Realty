const config = require('../environment');

// Production-specific configuration overrides
const productionConfig = {
  ...config,
  
  // Production database options
  database: {
    ...config.database,
    options: {
      ...config.database.options,
      // Stricter timeouts for production
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 30000,
      // Enable connection pooling
      maxPoolSize: 20,
      minPoolSize: 5,
      // Enable SSL in production
      ssl: true,
      sslValidate: true
    }
  },
  
  // Production logging
  logging: {
    ...config.logging,
    level: 'warn'
  },
  
  // Disable Swagger in production
  features: {
    ...config.features,
    swagger: false
  },
  
  // Strict CORS for production
  cors: {
    origin: config.frontend.url
  },
  
  // Production security settings
  security: {
    ...config.security,
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100 // Stricter rate limiting
    }
  },
  
  // Production file upload settings
  upload: {
    ...config.upload,
    maxFileSize: 10 * 1024 * 1024, // 10MB for production
  }
};

module.exports = productionConfig;