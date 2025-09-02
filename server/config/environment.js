const Joi = require('joi');
<<<<<<< HEAD

// Environment variable validation schema
const envSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  
  // Server Configuration
  PORT: Joi.number().default(5000),
  HOST: Joi.string().default('localhost'),
  
  // Database Configuration
  MONGO_URI: Joi.string().required(),
  MONGO_DB_NAME: Joi.string().default('urban_realty'),
  
  // JWT Configuration
  JWT_SECRET: Joi.string().required().min(32),
=======
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

// Environment variable validation schema
const envSchema = Joi.object({
  // Server Configuration
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test', 'staging')
    .default('development'),
  PORT: Joi.number().default(5000),
  
  // Database Configuration
  MONGO_URI: Joi.string().required(),
  MONGO_URI_TEST: Joi.string().when('NODE_ENV', {
    is: 'test',
    then: Joi.required(),
    otherwise: Joi.optional()
  }),
  
  // JWT Configuration
  JWT_SECRET: Joi.string().min(32).required(),
>>>>>>> 8996dbf766572af12f78cd9ad6ab9fbd165f3ace
  JWT_EXPIRE: Joi.string().default('30d'),
  JWT_COOKIE_EXPIRE: Joi.number().default(30),
  
  // Email Configuration
<<<<<<< HEAD
  SMTP_HOST: Joi.string().required(),
  SMTP_PORT: Joi.number().default(587),
  SMTP_USER: Joi.string().required(),
  SMTP_PASS: Joi.string().required(),
  FROM_EMAIL: Joi.string().email().required(),
  FROM_NAME: Joi.string().default('Urban Realty'),
=======
  EMAIL_HOST: Joi.string().required(),
  EMAIL_PORT: Joi.number().default(587),
  EMAIL_USER: Joi.string().email().required(),
  EMAIL_PASS: Joi.string().required(),
  EMAIL_FROM: Joi.string().email().required(),
>>>>>>> 8996dbf766572af12f78cd9ad6ab9fbd165f3ace
  
  // Cloudinary Configuration
  CLOUDINARY_CLOUD_NAME: Joi.string().required(),
  CLOUDINARY_API_KEY: Joi.string().required(),
  CLOUDINARY_API_SECRET: Joi.string().required(),
  
  // Razorpay Configuration
  RAZORPAY_KEY_ID: Joi.string().required(),
  RAZORPAY_KEY_SECRET: Joi.string().required(),
  
<<<<<<< HEAD
  // File Upload Configuration
  MAX_FILE_SIZE: Joi.number().default(5 * 1024 * 1024), // 5MB
  UPLOAD_PATH: Joi.string().default('./uploads'),
  
  // Security Configuration
  CORS_ORIGIN: Joi.string().default('http://localhost:3000'),
  RATE_LIMIT_WINDOW: Joi.number().default(15 * 60 * 1000), // 15 minutes
  RATE_LIMIT_MAX: Joi.number().default(100),
  
  // Logging Configuration
  LOG_LEVEL: Joi.string().valid('error', 'warn', 'info', 'debug').default('info'),
  LOG_FILE: Joi.string().default('./logs/app.log')
});

// Validate environment variables
const { error, value: envVars } = envSchema.validate(process.env, {
  allowUnknown: true,
  stripUnknown: true
});

if (error) {
  throw new Error(`Environment validation error: ${error.message}`);
}

// Export validated environment configuration
module.exports = {
  NODE_ENV: envVars.NODE_ENV,
  PORT: envVars.PORT,
  HOST: envVars.HOST,
  MONGO_URI: envVars.MONGO_URI,
  MONGO_DB_NAME: envVars.MONGO_DB_NAME,
  JWT_SECRET: envVars.JWT_SECRET,
  JWT_EXPIRE: envVars.JWT_EXPIRE,
  JWT_COOKIE_EXPIRE: envVars.JWT_COOKIE_EXPIRE,
  SMTP_HOST: envVars.SMTP_HOST,
  SMTP_PORT: envVars.SMTP_PORT,
  SMTP_USER: envVars.SMTP_USER,
  SMTP_PASS: envVars.SMTP_PASS,
  FROM_EMAIL: envVars.FROM_EMAIL,
  FROM_NAME: envVars.FROM_NAME,
  CLOUDINARY_CLOUD_NAME: envVars.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: envVars.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: envVars.CLOUDINARY_API_SECRET,
  RAZORPAY_KEY_ID: envVars.RAZORPAY_KEY_ID,
  RAZORPAY_KEY_SECRET: envVars.RAZORPAY_KEY_SECRET,
  MAX_FILE_SIZE: envVars.MAX_FILE_SIZE,
  UPLOAD_PATH: envVars.UPLOAD_PATH,
  CORS_ORIGIN: envVars.CORS_ORIGIN,
  RATE_LIMIT_WINDOW: envVars.RATE_LIMIT_WINDOW,
  RATE_LIMIT_MAX: envVars.RATE_LIMIT_MAX,
  LOG_LEVEL: envVars.LOG_LEVEL,
  LOG_FILE: envVars.LOG_FILE
};
=======
  // Frontend URL
  FRONTEND_URL: Joi.string().uri().default('http://localhost:3000'),
  
  // Security Configuration
  BCRYPT_ROUNDS: Joi.number().default(12),
  RATE_LIMIT_WINDOW_MS: Joi.number().default(15 * 60 * 1000), // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: Joi.number().default(100),
  
  // File Upload Configuration
  MAX_FILE_SIZE: Joi.number().default(5 * 1024 * 1024), // 5MB
  ALLOWED_FILE_TYPES: Joi.string().default('image/jpeg,image/png,image/gif,image/webp'),
  
  // Logging Configuration
  LOG_LEVEL: Joi.string()
    .valid('error', 'warn', 'info', 'debug')
    .default('info'),
  LOG_FILE: Joi.string().default('logs/app.log'),
  
  // CORS Configuration
  CORS_ORIGIN: Joi.string().default('http://localhost:3000'),
  
  // Redis Configuration (for caching)
  REDIS_URL: Joi.string().optional(),
  REDIS_PASSWORD: Joi.string().optional(),
  
  // Monitoring Configuration
  SENTRY_DSN: Joi.string().optional(),
  
  // Feature Flags
  ENABLE_SWAGGER: Joi.boolean().default(false),
  ENABLE_METRICS: Joi.boolean().default(false),
  
  // Mobile App Configuration
  MOBILE_APP_VERSION: Joi.string().default('1.0.0'),
  MOBILE_MIN_VERSION: Joi.string().default('1.0.0')
}).unknown();

// Validate environment variables
const { error, value: envVars } = envSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

// Export configuration object
const config = {
  // Server
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  isDevelopment: envVars.NODE_ENV === 'development',
  isProduction: envVars.NODE_ENV === 'production',
  isTest: envVars.NODE_ENV === 'test',
  
  // Database
  database: {
    uri: envVars.NODE_ENV === 'test' ? envVars.MONGO_URI_TEST : envVars.MONGO_URI,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    }
  },
  
  // JWT
  jwt: {
    secret: envVars.JWT_SECRET,
    expire: envVars.JWT_EXPIRE,
    cookieExpire: envVars.JWT_COOKIE_EXPIRE
  },
  
  // Email
  email: {
    host: envVars.EMAIL_HOST,
    port: envVars.EMAIL_PORT,
    user: envVars.EMAIL_USER,
    pass: envVars.EMAIL_PASS,
    from: envVars.EMAIL_FROM
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
  
  // Security
  security: {
    bcryptRounds: envVars.BCRYPT_ROUNDS,
    rateLimit: {
      windowMs: envVars.RATE_LIMIT_WINDOW_MS,
      max: envVars.RATE_LIMIT_MAX_REQUESTS
    }
  },
  
  // File Upload
  upload: {
    maxFileSize: envVars.MAX_FILE_SIZE,
    allowedTypes: envVars.ALLOWED_FILE_TYPES.split(',')
  },
  
  // Logging
  logging: {
    level: envVars.LOG_LEVEL,
    file: envVars.LOG_FILE
  },
  
  // CORS
  cors: {
    origin: envVars.CORS_ORIGIN.split(',').map(origin => origin.trim())
  },
  
  // Redis
  redis: {
    url: envVars.REDIS_URL,
    password: envVars.REDIS_PASSWORD
  },
  
  // Monitoring
  monitoring: {
    sentryDsn: envVars.SENTRY_DSN
  },
  
  // Feature Flags
  features: {
    swagger: envVars.ENABLE_SWAGGER,
    metrics: envVars.ENABLE_METRICS
  },
  
  // Mobile
  mobile: {
    appVersion: envVars.MOBILE_APP_VERSION,
    minVersion: envVars.MOBILE_MIN_VERSION
  }
};

module.exports = config;
>>>>>>> 8996dbf766572af12f78cd9ad6ab9fbd165f3ace
