const config = require('../environment');

// Test-specific configuration overrides
const testConfig = {
  ...config,
  
  // Use test database
  database: {
    ...config.database,
    uri: config.database.uri.replace('urban-realty', 'urban-realty-test'),
    options: {
      ...config.database.options,
      // Fast timeouts for tests
      serverSelectionTimeoutMS: 2000,
      socketTimeoutMS: 10000,
    }
  },
  
  // Minimal logging for tests
  logging: {
    ...config.logging,
    level: 'error'
  },
  
  // Disable features that might interfere with tests
  features: {
    ...config.features,
    swagger: false,
    metrics: false
  },
  
  // Test-specific security settings
  security: {
    ...config.security,
    rateLimit: {
      windowMs: 15 * 60 * 1000,
      max: 10000 // Very lenient for tests
    }
  },
  
  // Test JWT settings
  jwt: {
    ...config.jwt,
    expire: '1h' // Shorter expiry for tests
  }
};

module.exports = testConfig;