const Joi = require('joi');

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
  JWT_EXPIRE: Joi.string().default('30d'),
  JWT_COOKIE_EXPIRE: Joi.number().default(30),
  
  // Email Configuration
  SMTP_HOST: Joi.string().required(),
  SMTP_PORT: Joi.number().default(587),
  SMTP_USER: Joi.string().required(),
  SMTP_PASS: Joi.string().required(),
  FROM_EMAIL: Joi.string().email().required(),
  FROM_NAME: Joi.string().default('Urban Realty'),
  
  // Cloudinary Configuration
  CLOUDINARY_CLOUD_NAME: Joi.string().required(),
  CLOUDINARY_API_KEY: Joi.string().required(),
  CLOUDINARY_API_SECRET: Joi.string().required(),
  
  // Razorpay Configuration
  RAZORPAY_KEY_ID: Joi.string().required(),
  RAZORPAY_KEY_SECRET: Joi.string().required(),
  
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
