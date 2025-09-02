// Shared constants across all platforms (server, client, mobile)
// This file contains constants that are used across multiple platforms

// API Response Status Codes
export const HTTP_STATUS = {
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
export const USER_ROLES = {
  ADMIN: 'admin',
  AGENT: 'agent',
  USER: 'user',
  DEVELOPER: 'developer'
};

// Property Types
export const PROPERTY_TYPES = {
  APARTMENT: 'apartment',
  VILLA: 'villa',
  PLOT: 'plot',
  COMMERCIAL: 'commercial'
};

// Property Status
export const PROPERTY_STATUS = {
  AVAILABLE: 'available',
  SOLD: 'sold',
  RENTED: 'rented',
  PENDING: 'pending'
};

// Subscription Plans
export const SUBSCRIPTION_PLANS = {
  BASIC: 'basic',
  PREMIUM: 'premium',
  ENTERPRISE: 'enterprise'
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100
};

// API Endpoints (shared structure)
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/me'
  },
  PROPERTIES: {
    LIST: '/properties',
    CREATE: '/properties',
    BY_ID: (id) => `/properties/${id}`,
    IMAGES: (id) => `/properties/${id}/images`,
    SEARCH: '/properties/search'
  },
  USERS: {
    LIST: '/users',
    BY_ID: (id) => `/users/${id}`,
    UPDATE: (id) => `/users/${id}`
  },
  SUBSCRIPTIONS: {
    LIST: '/subscriptions',
    BY_ID: (id) => `/subscriptions/${id}`,
    CREATE: '/subscriptions'
  },
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    USERS: '/admin/users',
    PROPERTIES: '/admin/properties',
    ANALYTICS: '/admin/analytics'
  }
};

// Error Messages (shared)
export const ERROR_MESSAGES = {
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
  UPLOAD_FAILED: 'File upload failed.',
  NETWORK_ERROR: 'Network connection failed.',
  TIMEOUT_ERROR: 'Request timeout.'
};

// Success Messages (shared)
export const SUCCESS_MESSAGES = {
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

// File Upload Limits
export const UPLOAD_LIMITS = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
};

// Validation Rules (shared)
export const VALIDATION_RULES = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^[+]?[\d\s\-\(\)]{10,}$/,
  PASSWORD_MIN_LENGTH: 8,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50
};

// API Configuration
export const API_CONFIG = {
  BASE_URL: 'https://urban-realty-production.up.railway.app/api/v1',
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000 // 1 second
};

// Theme Configuration (shared)
export const THEME_CONFIG = {
  COLORS: {
    PRIMARY: '#3B82F6',
    SECONDARY: '#64748B',
    SUCCESS: '#10B981',
    WARNING: '#F59E0B',
    ERROR: '#EF4444',
    INFO: '#3B82F6'
  },
  BREAKPOINTS: {
    MOBILE: 768,
    TABLET: 1024,
    DESKTOP: 1280
  }
};