// Application Constants

// API Response Status Codes
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500
};

// User Roles
const USER_ROLES = {
  ADMIN: 'admin',
  AGENT: 'agent',
  USER: 'user'
};

// Property Types
const PROPERTY_TYPES = {
  APARTMENT: 'apartment',
  VILLA: 'villa',
  PLOT: 'plot',
  COMMERCIAL: 'commercial'
};

// Property Status
const PROPERTY_STATUS = {
  AVAILABLE: 'available',
  SOLD: 'sold',
  RENTED: 'rented',
  PENDING: 'pending'
};

// Subscription Plans
const SUBSCRIPTION_PLANS = {
  BASIC: 'basic',
  PREMIUM: 'premium',
  ENTERPRISE: 'enterprise'
};

// File Upload Limits
const UPLOAD_LIMITS = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
};

// Pagination
const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100
};

// Error Messages
const ERROR_MESSAGES = {
  UNAUTHORIZED: 'Access denied. Authentication required.',
  FORBIDDEN: 'Access forbidden. Insufficient permissions.',
  NOT_FOUND: 'Resource not found.',
  VALIDATION_ERROR: 'Validation failed.',
  INTERNAL_ERROR: 'Internal server error.',
  DUPLICATE_ENTRY: 'Resource already exists.',
  INVALID_CREDENTIALS: 'Invalid email or password.',
  ACCOUNT_DISABLED: 'Account has been disabled.',
  EMAIL_NOT_VERIFIED: 'Email address not verified.',
  SUBSCRIPTION_EXPIRED: 'Subscription has expired.',
  PAYMENT_FAILED: 'Payment processing failed.',
  FILE_TOO_LARGE: 'File size exceeds maximum limit.',
  INVALID_FILE_TYPE: 'Invalid file type.',
  UPLOAD_FAILED: 'File upload failed.'
};

// Success Messages
const SUCCESS_MESSAGES = {
  USER_CREATED: 'User created successfully.',
  USER_UPDATED: 'User updated successfully.',
  USER_DELETED: 'User deleted successfully.',
  PROPERTY_CREATED: 'Property created successfully.',
  PROPERTY_UPDATED: 'Property updated successfully.',
  PROPERTY_DELETED: 'Property deleted successfully.',
  LOGIN_SUCCESS: 'Login successful.',
  LOGOUT_SUCCESS: 'Logout successful.',
  PASSWORD_RESET: 'Password reset email sent.',
  EMAIL_VERIFIED: 'Email verified successfully.',
  SUBSCRIPTION_CREATED: 'Subscription created successfully.',
  PAYMENT_SUCCESS: 'Payment processed successfully.',
  FILE_UPLOADED: 'File uploaded successfully.'
};

// API Endpoints
const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/v1/auth/login',
    REGISTER: '/api/v1/auth/register',
    LOGOUT: '/api/v1/auth/logout',
    REFRESH: '/api/v1/auth/refresh',
    FORGOT_PASSWORD: '/api/v1/auth/forgot-password',
    RESET_PASSWORD: '/api/v1/auth/reset-password',
    VERIFY_EMAIL: '/api/v1/auth/verify-email'
  },
  PROPERTIES: {
    BASE: '/api/v1/properties',
    SEARCH: '/api/v1/properties/search',
    FEATURED: '/api/v1/properties/featured',
    BY_TYPE: '/api/v1/properties/type',
    BY_LOCATION: '/api/v1/properties/location'
  },
  ADMIN: {
    BASE: '/api/v1/admin',
    USERS: '/api/v1/admin/users',
    PROPERTIES: '/api/v1/admin/properties',
    ANALYTICS: '/api/v1/admin/analytics',
    SETTINGS: '/api/v1/admin/settings'
  },
  SUBSCRIPTIONS: {
    BASE: '/api/v1/subscriptions',
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

module.exports = {
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
  DB_COLLECTIONS,
  JWT_CONFIG,
  EMAIL_TEMPLATES,
  CLOUDINARY_CONFIG,
  RAZORPAY_CONFIG
};
