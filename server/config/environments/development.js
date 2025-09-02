const config = require('../environment');

// Development-specific configuration overrides
const developmentConfig = {
  ...config,
  
  // Override database options for development
  database: {
    ...config.database,
    options: {
      ...config.database.options,
      // More lenient timeouts for development
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 60000,
    }
  },
  
  // Enable detailed logging in development
  logging: {
    ...config.logging,
    level: 'debug'
  },
  
  // Enable Swagger in development
  features: {
    ...config.features,
    swagger: true
  },
  
  // More lenient CORS for development
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:3000']
  },
  
  // Development-specific security settings
  security: {
    ...config.security,
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 1000 // More lenient for development
    }
  }
};

module.exports = developmentConfig;