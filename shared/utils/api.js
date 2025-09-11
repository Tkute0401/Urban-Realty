// Shared API utilities across all platforms

import { API_CONFIG, ERROR_MESSAGES } from '../constants/index.js';

/**
 * Create standardized API response
 * @param {boolean} success - Whether the operation was successful
 * @param {any} data - Response data
 * @param {string} message - Response message
 * @param {number} statusCode - HTTP status code
 * @param {any} errors - Error details
 * @returns {object} - Standardized API response
 */
export const createApiResponse = (success, data = null, message = '', statusCode = 200, errors = null) => {
  const response = {
    success,
    statusCode,
    message,
    timestamp: new Date().toISOString()
  };
  
  if (success) {
    response.data = data;
  } else {
    response.error = message || ERROR_MESSAGES.INTERNAL_ERROR;
    if (errors) {
      response.errors = errors;
    }
  }
  
  return response;
};

/**
 * Create success response
 * @param {any} data - Response data
 * @param {string} message - Success message
 * @param {number} statusCode - HTTP status code
 * @returns {object} - Success response
 */
export const createSuccessResponse = (data = null, message = '', statusCode = 200) => {
  return createApiResponse(true, data, message, statusCode);
};

/**
 * Create error response
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code
 * @param {any} errors - Error details
 * @returns {object} - Error response
 */
export const createErrorResponse = (message, statusCode = 500, errors = null) => {
  return createApiResponse(false, null, message, statusCode, errors);
};

/**
 * Handle API errors
 * @param {Error} error - Error object
 * @param {string} defaultMessage - Default error message
 * @returns {object} - Error response
 */
export const handleApiError = (error, defaultMessage = ERROR_MESSAGES.INTERNAL_ERROR) => {
  console.error('API Error:', error);
  
  // Handle specific error types
  if (error.name === 'ValidationError') {
    return createErrorResponse(ERROR_MESSAGES.VALIDATION_ERROR, 400, error.details);
  }
  
  if (error.name === 'UnauthorizedError') {
    return createErrorResponse(ERROR_MESSAGES.UNAUTHORIZED, 401);
  }
  
  if (error.name === 'ForbiddenError') {
    return createErrorResponse(ERROR_MESSAGES.FORBIDDEN, 403);
  }
  
  if (error.name === 'NotFoundError') {
    return createErrorResponse(ERROR_MESSAGES.NOT_FOUND, 404);
  }
  
  if (error.name === 'ConflictError') {
    return createErrorResponse(ERROR_MESSAGES.DUPLICATE_ENTRY, 409);
  }
  
  // Handle network errors
  if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
    return createErrorResponse(ERROR_MESSAGES.NETWORK_ERROR, 503);
  }
  
  if (error.code === 'ETIMEDOUT') {
    return createErrorResponse(ERROR_MESSAGES.TIMEOUT_ERROR, 408);
  }
  
  // Default error
  return createErrorResponse(defaultMessage, 500);
};

/**
 * Build query string from parameters
 * @param {object} params - Query parameters
 * @returns {string} - Query string
 */
export const buildQueryString = (params) => {
  if (!params || typeof params !== 'object') return '';
  
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(item => searchParams.append(key, item));
      } else {
        searchParams.append(key, value);
      }
    }
  });
  
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
};

/**
 * Parse query string to object
 * @param {string} queryString - Query string
 * @returns {object} - Parsed parameters
 */
export const parseQueryString = (queryString) => {
  if (!queryString || typeof queryString !== 'string') return {};
  
  const params = {};
  const searchParams = new URLSearchParams(queryString);
  
  for (const [key, value] of searchParams.entries()) {
    if (params[key]) {
      // Handle multiple values for same key
      if (Array.isArray(params[key])) {
        params[key].push(value);
      } else {
        params[key] = [params[key], value];
      }
    } else {
      params[key] = value;
    }
  }
  
  return params;
};

/**
 * Create pagination metadata
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @param {number} total - Total items
 * @returns {object} - Pagination metadata
 */
export const createPaginationMeta = (page, limit, total) => {
  const totalPages = Math.ceil(total / limit);
  
  return {
    page: parseInt(page),
    limit: parseInt(limit),
    total: parseInt(total),
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
    nextPage: page < totalPages ? page + 1 : null,
    prevPage: page > 1 ? page - 1 : null
  };
};

/**
 * Validate API response structure
 * @param {any} response - Response to validate
 * @returns {boolean} - Whether response is valid
 */
export const isValidApiResponse = (response) => {
  if (!response || typeof response !== 'object') return false;
  
  return (
    typeof response.success === 'boolean' &&
    typeof response.statusCode === 'number' &&
    typeof response.timestamp === 'string'
  );
};