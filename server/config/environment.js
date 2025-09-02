const Joi = require('joi');

// Environment variable validation schema
const envSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test', 'staging')
    .default('development'),
  
  PORT: Joi.number()
    .port()
    .default(5000),
  
  // Database Configuration
  MONGODB_URI: Joi.string()
    .uri()
    .required()
    .description('MongoDB connection string'),
  
  // JWT Configuration
  JWT_SECRET: Joi.string()
    .min(32)
    .required()
    .description('JWT secret key for token signing'),
  
  JWT_EXPIRE: Joi.string()
    .default('7d')
    .description('JWT token expiration time'),
  
  JWT_COOKIE_EXPIRE: Joi.number()
    .default(7)
    .description('JWT cookie expiration in days'),
  
  // Email Configuration
  EMAIL_FROM: Joi.string()
    .email()
    .required()
    .description('Email address for sending emails'),
  
  EMAIL_HOST: Joi.string()
    .required()
    .description('SMTP host for email service'),
  
  EMAIL_PORT: Joi.number()
    .port()
    .default(587)
    .description('SMTP port for email service'),
  
  EMAIL_USER: Joi.string()
    .required()
    .description('SMTP username'),
  
  EMAIL_PASS: Joi.string()
    .required()
    .description('SMTP password'),
  
  // Cloudinary Configuration
  CLOUDINARY_CLOUD_NAME: Joi.string()
    .required()
    .description('Cloudinary cloud name'),
  
  CLOUDINARY_API_KEY: Joi.string()
    .required()
    .description('Cloudinary API key'),
  
  CLOUDINARY_API_SECRET: Joi.string()
    .required()
    .description('Cloudinary API secret'),
  
  // Razorpay Configuration
  RAZORPAY_KEY_ID: Joi.string()
    .required()
    .description('Razorpay key ID'),
  
  RAZORPAY_KEY_SECRET: Joi.string()
    .required()
    .description('Razorpay key secret'),
  
  // Frontend URL
  FRONTEND_URL: Joi.string()
    .uri()
    .default('http://localhost:3000')
    .description('Frontend application URL'),
  
  // CORS Configuration
  CORS_ORIGIN: Joi.string()
    .default('*')
    .description('CORS allowed origins'),
  
  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: Joi.number()
    .default(15 * 60 * 1000) // 15 minutes
    .description('Rate limiting window in milliseconds'),
  
  RATE_LIMIT_MAX_REQUESTS: Joi.number()
    .default(100)
    .description('Maximum requests per window'),
  
  // File Upload
  MAX_FILE_SIZE: Joi.number()
    .default(10 * 1024 * 1024) // 10MB
    .description('Maximum file upload size in bytes'),
  
  // Logging
  LOG_LEVEL: Joi.string()
    .valid('error', 'warn', 'info', 'debug')
    .default('info')
    .description('Logging level'),
  
  // Redis (for caching and sessions)
  REDIS_URL: Joi.string()
    .uri()
    .optional()
    .description('Redis connection URL for caching'),
  
  // Security
  BCRYPT_ROUNDS: Joi.number()
    .default(12)
    .description('BCrypt salt rounds for password hashing'),
  
  SESSION_SECRET: Joi.string()
    .min(32)
    .required()
    .description('Session secret for secure sessions'),
  
  // API Keys
  GOOGLE_MAPS_API_KEY: Joi.string()
    .optional()
    .description('Google Maps API key for location services'),
  
  // Monitoring
  SENTRY_DSN: Joi.string()
    .uri()
    .optional()
    .description('Sentry DSN for error tracking')
}).unknown();

// Validate environment variables
const { error, value: envVars } = envSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

// Export validated configuration
module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  
  // Database
  database: {
    uri: envVars.MONGODB_URI
  },
  
  // JWT
  jwt: {
    secret: envVars.JWT_SECRET,
    expire: envVars.JWT_EXPIRE,
    cookieExpire: envVars.JWT_COOKIE_EXPIRE
  },
  
  // Email
  email: {
    from: envVars.EMAIL_FROM,
    host: envVars.EMAIL_HOST,
    port: envVars.EMAIL_PORT,
    user: envVars.EMAIL_USER,
    pass: envVars.EMAIL_PASS
  },
  
  // Cloudinary
  cloudinary: {
    cloudName: envVars.CLOUDINARY_CLOUD_NAME,
    apiKey: envVars.CLOUDINARY_API_KEY,
    apiSecret: envVars.CLOUDINARY_API_SECRET
  },
  
  // Razorpay
  razorpay: {
    keyId: envVars.RAZORPAY_KEY_ID,
    keySecret: envVars.RAZORPAY_KEY_SECRET
  },
  
  // Frontend
  frontend: {
    url: envVars.FRONTEND_URL
  },
  
  // CORS
  cors: {
    origin: envVars.CORS_ORIGIN === '*' ? true : envVars.CORS_ORIGIN.split(',')
  },
  
  // Rate Limiting
  rateLimit: {
    windowMs: envVars.RATE_LIMIT_WINDOW_MS,
    max: envVars.RATE_LIMIT_MAX_REQUESTS
  },
  
  // File Upload
  upload: {
    maxFileSize: envVars.MAX_FILE_SIZE
  },
  
  // Logging
  logging: {
    level: envVars.LOG_LEVEL
  },
  
  // Redis
  redis: {
    url: envVars.REDIS_URL
  },
  
  // Security
  security: {
    bcryptRounds: envVars.BCRYPT_ROUNDS,
    sessionSecret: envVars.SESSION_SECRET
  },
  
  // API Keys
  apiKeys: {
    googleMaps: envVars.GOOGLE_MAPS_API_KEY
  },
  
  // Monitoring
  monitoring: {
    sentryDsn: envVars.SENTRY_DSN
  }
};
