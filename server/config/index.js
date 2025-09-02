const path = require('path');

// Load base configuration
const baseConfig = require('./environment');

// Load environment-specific configuration
let envConfig = {};
const env = baseConfig.env;

try {
  switch (env) {
    case 'development':
      envConfig = require('./environments/development');
      break;
    case 'production':
      envConfig = require('./environments/production');
      break;
    case 'test':
      envConfig = require('./environments/test');
      break;
    case 'staging':
      // Staging can use production config with some overrides
      envConfig = require('./environments/production');
      break;
    default:
      console.warn(`Unknown environment: ${env}, using development config`);
      envConfig = require('./environments/development');
  }
} catch (error) {
  console.warn(`Failed to load environment config for ${env}:`, error.message);
  console.warn('Using base configuration');
  envConfig = baseConfig;
}

// Merge configurations
const config = {
  ...baseConfig,
  ...envConfig
};

// Add utility functions
config.getDatabaseUri = () => {
  return config.database.uri;
};

config.getJwtSecret = () => {
  return config.jwt.secret;
};

config.getCorsOrigin = () => {
  return config.cors.origin;
};

config.isFeatureEnabled = (feature) => {
  return config.features[feature] === true;
};

config.getLogLevel = () => {
  return config.logging.level;
};

config.getUploadConfig = () => {
  return config.upload;
};

config.getSecurityConfig = () => {
  return config.security;
};

// Validate configuration
const validateConfig = () => {
  const requiredFields = [
    'database.uri',
    'jwt.secret',
    'email.host',
    'email.user',
    'email.pass',
    'cloudinary.cloudName',
    'cloudinary.apiKey',
    'cloudinary.apiSecret',
    'razorpay.keyId',
    'razorpay.keySecret'
  ];

  const missingFields = requiredFields.filter(field => {
    const keys = field.split('.');
    let value = config;
    for (const key of keys) {
      if (!value || !value[key]) {
        return true;
      }
      value = value[key];
    }
    return false;
  });

  if (missingFields.length > 0) {
    throw new Error(`Missing required configuration fields: ${missingFields.join(', ')}`);
  }
};

// Validate configuration on load
try {
  validateConfig();
  console.log(`✅ Configuration loaded successfully for environment: ${config.env}`);
} catch (error) {
  console.error('❌ Configuration validation failed:', error.message);
  if (config.isProduction) {
    process.exit(1);
  } else {
    console.warn('⚠️  Continuing with incomplete configuration in non-production environment');
  }
}

module.exports = config;