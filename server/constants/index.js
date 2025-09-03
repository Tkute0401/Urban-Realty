// Application Constants
// Import shared constants and extend with server-specific ones
const path = require('path');

const {
  HTTP_STATUS,
  USER_ROLES,
  PROPERTY_TYPES,
  PROPERTY_STATUS,
  SUBSCRIPTION_PLANS,
  PAGINATION,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  API_ENDPOINTS,
  UPLOAD_LIMITS
} = require(path.resolve(__dirname, '../../shared/constants/index.cjs'));

// Server-specific constants (extending shared constants)

// Extended API Endpoints (server-specific)
const SERVER_API_ENDPOINTS = {
  ...API_ENDPOINTS,
  AUTH: {
    ...API_ENDPOINTS.AUTH,
    FORGOT_PASSWORD: '/api/v1/auth/forgot-password',
    RESET_PASSWORD: '/api/v1/auth/reset-password',
    VERIFY_EMAIL: '/api/v1/auth/verify-email'
  },
  PROPERTIES: {
    ...API_ENDPOINTS.PROPERTIES,
    FEATURED: '/api/v1/properties/featured',
    BY_TYPE: '/api/v1/properties/type',
    BY_LOCATION: '/api/v1/properties/location'
  },
  SUBSCRIPTIONS: {
    ...API_ENDPOINTS.SUBSCRIPTIONS,
    PLANS: '/api/v1/subscriptions/plans',
    PAYMENT: '/api/v1/subscriptions/payment',
    WEBHOOK: '/api/v1/subscriptions/webhook'
  }
};

// Database Collections/Tables
const DB_COLLECTIONS = {
  USERS: 'users',
  PROPERTIES: 'properties',
  SUBSCRIPTIONS: 'subscriptions',
  PAYMENTS: 'payments',
  CONTACTS: 'contacts',
  DEVELOPERS: 'developers',
  MEDIA: 'media'
};

// JWT Configuration
const JWT_CONFIG = {
  ACCESS_TOKEN_EXPIRY: '15m',
  REFRESH_TOKEN_EXPIRY: '7d',
  ALGORITHM: 'HS256'
};

// Email Templates
const EMAIL_TEMPLATES = {
  WELCOME: 'welcome',
  PASSWORD_RESET: 'password-reset',
  EMAIL_VERIFICATION: 'email-verification',
  SUBSCRIPTION_CONFIRMATION: 'subscription-confirmation',
  PAYMENT_RECEIPT: 'payment-receipt',
  PROPERTY_INQUIRY: 'property-inquiry'
};

// Cloudinary Configuration
const CLOUDINARY_CONFIG = {
  FOLDER: 'urban-realty',
  TRANSFORMATIONS: {
    THUMBNAIL: { width: 300, height: 200, crop: 'fill' },
    MEDIUM: { width: 800, height: 600, crop: 'fill' },
    LARGE: { width: 1200, height: 800, crop: 'fill' }
  }
};

// Razorpay Configuration
const RAZORPAY_CONFIG = {
  CURRENCY: 'INR',
  PAYMENT_CAPTURE: 1,
  NOTES: {
    SOURCE: 'urban-realty-web'
  }
};

// Response helper functions
const createSuccessResponse = (data, message = 'Success', statusCode = HTTP_STATUS.OK) => {
  return {
    success: true,
    statusCode,
    message,
    data,
    timestamp: new Date().toISOString()
  };
};

const createErrorResponse = (message, statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR, details = null) => {
  return {
    success: false,
    statusCode,
    message,
    details,
    timestamp: new Date().toISOString()
  };
};

module.exports = {
  // Shared constants
  HTTP_STATUS,
  USER_ROLES,
  PROPERTY_TYPES,
  PROPERTY_STATUS,
  SUBSCRIPTION_PLANS,
  UPLOAD_LIMITS,
  PAGINATION,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  API_ENDPOINTS,
  
  // Server-specific constants
  SERVER_API_ENDPOINTS,
  DB_COLLECTIONS,
  JWT_CONFIG,
  EMAIL_TEMPLATES,
  CLOUDINARY_CONFIG,
  RAZORPAY_CONFIG,
  
  // Response helper functions
  createSuccessResponse,
  createErrorResponse
};
