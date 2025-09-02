// Shared User model structure across all platforms

import { USER_ROLES } from '../constants/index.js';

/**
 * User model structure
 * This defines the common user data structure used across server, client, and mobile
 */
export const UserModel = {
  // Basic user information
  _id: String,
  email: String,
  password: String, // Only used on server side
  firstName: String,
  lastName: String,
  phone: String,
  role: {
    type: String,
    enum: Object.values(USER_ROLES),
    default: USER_ROLES.USER
  },
  
  // Profile information
  profile: {
    avatar: String,
    bio: String,
    dateOfBirth: Date,
    address: {
      street: String,
      city: String,
      state: String,
      pincode: String,
      country: String
    }
  },
  
  // Agent/Developer specific fields
  professionalInfo: {
    licenseNumber: String, // For agents
    companyName: String, // For developers
    experience: Number,
    specialties: [String],
    certifications: [String]
  },
  
  // Account status
  isActive: {
    type: Boolean,
    default: true
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  
  // Subscription information
  subscription: {
    plan: String,
    status: String,
    startDate: Date,
    endDate: Date,
    autoRenew: Boolean
  },
  
  // Timestamps
  createdAt: Date,
  updatedAt: Date,
  lastLoginAt: Date
};

/**
 * User validation rules
 */
export const UserValidationRules = {
  email: {
    required: true,
    type: 'email',
    maxLength: 255
  },
  password: {
    required: true,
    minLength: 8,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/
  },
  firstName: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-Z\s]+$/
  },
  lastName: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-Z\s]+$/
  },
  phone: {
    required: true,
    pattern: /^[+]?[\d\s\-\(\)]{10,}$/
  },
  role: {
    required: true,
    enum: Object.values(USER_ROLES)
  }
};

/**
 * User transformation functions
 */
export const UserTransformers = {
  /**
   * Transform user for client response (remove sensitive data)
   * @param {object} user - User object
   * @returns {object} - Transformed user object
   */
  toClientResponse: (user) => {
    const { password, emailVerificationToken, passwordResetToken, passwordResetExpires, ...safeUser } = user;
    return safeUser;
  },
  
  /**
   * Transform user for mobile response
   * @param {object} user - User object
   * @returns {object} - Transformed user object
   */
  toMobileResponse: (user) => {
    const { password, emailVerificationToken, passwordResetToken, passwordResetExpires, ...safeUser } = user;
    return {
      ...safeUser,
      fullName: `${user.firstName} ${user.lastName}`.trim()
    };
  },
  
  /**
   * Get user display name
   * @param {object} user - User object
   * @returns {string} - Display name
   */
  getDisplayName: (user) => {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`.trim();
    }
    return user.email || 'Unknown User';
  },
  
  /**
   * Check if user is agent
   * @param {object} user - User object
   * @returns {boolean} - Whether user is agent
   */
  isAgent: (user) => {
    return user.role === USER_ROLES.AGENT;
  },
  
  /**
   * Check if user is developer
   * @param {object} user - User object
   * @returns {boolean} - Whether user is developer
   */
  isDeveloper: (user) => {
    return user.role === USER_ROLES.DEVELOPER;
  },
  
  /**
   * Check if user is admin
   * @param {object} user - User object
   * @returns {boolean} - Whether user is admin
   */
  isAdmin: (user) => {
    return user.role === USER_ROLES.ADMIN;
  }
};