// Shared validation utilities across all platforms

import { VALIDATION_RULES } from '../constants/index.js';

/**
 * Validate email address
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid
 */
export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  return VALIDATION_RULES.EMAIL_REGEX.test(email.trim());
};

/**
 * Validate phone number
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - True if valid
 */
export const isValidPhone = (phone) => {
  if (!phone || typeof phone !== 'string') return false;
  return VALIDATION_RULES.PHONE_REGEX.test(phone.trim());
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {object} - Validation result with isValid and errors
 */
export const validatePassword = (password) => {
  const errors = [];
  
  if (!password || typeof password !== 'string') {
    errors.push('Password is required');
    return { isValid: false, errors };
  }
  
  if (password.length < VALIDATION_RULES.PASSWORD_MIN_LENGTH) {
    errors.push(`Password must be at least ${VALIDATION_RULES.PASSWORD_MIN_LENGTH} characters long`);
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate name (first name, last name, etc.)
 * @param {string} name - Name to validate
 * @returns {object} - Validation result with isValid and errors
 */
export const validateName = (name) => {
  const errors = [];
  
  if (!name || typeof name !== 'string') {
    errors.push('Name is required');
    return { isValid: false, errors };
  }
  
  const trimmedName = name.trim();
  
  if (trimmedName.length < VALIDATION_RULES.NAME_MIN_LENGTH) {
    errors.push(`Name must be at least ${VALIDATION_RULES.NAME_MIN_LENGTH} characters long`);
  }
  
  if (trimmedName.length > VALIDATION_RULES.NAME_MAX_LENGTH) {
    errors.push(`Name must be no more than ${VALIDATION_RULES.NAME_MAX_LENGTH} characters long`);
  }
  
  if (!/^[a-zA-Z\s]+$/.test(trimmedName)) {
    errors.push('Name can only contain letters and spaces');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate required field
 * @param {any} value - Value to validate
 * @param {string} fieldName - Name of the field for error message
 * @returns {object} - Validation result with isValid and errors
 */
export const validateRequired = (value, fieldName) => {
  const errors = [];
  
  if (value === null || value === undefined || value === '') {
    errors.push(`${fieldName} is required`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate number range
 * @param {number} value - Number to validate
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @param {string} fieldName - Name of the field for error message
 * @returns {object} - Validation result with isValid and errors
 */
export const validateNumberRange = (value, min, max, fieldName) => {
  const errors = [];
  
  if (typeof value !== 'number' || isNaN(value)) {
    errors.push(`${fieldName} must be a valid number`);
    return { isValid: false, errors };
  }
  
  if (value < min) {
    errors.push(`${fieldName} must be at least ${min}`);
  }
  
  if (value > max) {
    errors.push(`${fieldName} must be no more than ${max}`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};