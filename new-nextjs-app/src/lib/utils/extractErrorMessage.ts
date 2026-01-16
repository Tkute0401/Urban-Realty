import { ApiError } from '@/lib/services/api.types';

/**
 * Extracts a user-friendly error message from various error formats
 * Handles ApiError, axios errors, fetch errors, and generic errors
 * 
 * @param error - The error object from API calls or form submissions
 * @param defaultMessage - Default message to show if no error message can be extracted
 * @returns A user-friendly error message string
 */
export function extractErrorMessage(error: any, defaultMessage: string = 'An error occurred. Please try again.'): string {
  if (!error) {
    return defaultMessage;
  }

  // Handle ApiError instances (from our API service)
  if (error instanceof ApiError) {
    // Check responseBody for error message
    if (error.responseBody) {
      // If responseBody is a string, use it directly
      if (typeof error.responseBody === 'string') {
        return error.responseBody;
      }
      
      // If responseBody is an object, check for common error message fields
      if (typeof error.responseBody === 'object' && error.responseBody !== null) {
        const body = error.responseBody as any;
        
        // Check for message field
        if (body.message) {
          return body.message;
        }
        
        // Check for error field
        if (body.error) {
          // If error is a string, use it
          if (typeof body.error === 'string') {
            return body.error;
          }
          // If error is an object with a message
          if (typeof body.error === 'object' && body.error.message) {
            return body.error.message;
          }
        }
        
        // Check for errors array (validation errors)
        if (Array.isArray(body.errors) && body.errors.length > 0) {
          // Join validation errors
          return body.errors.map((err: any) => 
            typeof err === 'string' ? err : err.message || err.msg || JSON.stringify(err)
          ).join(', ');
        }
        
        // Check for data.message
        if (body.data?.message) {
          return body.data.message;
        }
      }
    }
    
    // Fall back to ApiError's message if it's not just a status code
    if (error.message && !/^\d{3}$/.test(error.message.trim())) {
      return error.message;
    }
  }

  // Handle axios-style errors
  if (error.response) {
    const data = error.response.data;
    
    if (data) {
      // Check for message field
      if (data.message) {
        return data.message;
      }
      
      // Check for error field
      if (data.error) {
        if (typeof data.error === 'string') {
          return data.error;
        }
        if (typeof data.error === 'object' && data.error.message) {
          return data.error.message;
        }
      }
      
      // Check for errors array
      if (Array.isArray(data.errors) && data.errors.length > 0) {
        return data.errors.map((err: any) => 
          typeof err === 'string' ? err : err.message || err.msg || JSON.stringify(err)
        ).join(', ');
      }
      
      // Check for data.data.message (nested structure)
      if (data.data?.message) {
        return data.data.message;
      }
    }
    
    // If no message found, create a user-friendly message based on status code
    const status = error.response.status;
    return getStatusMessage(status);
  }

  // Handle fetch API errors
  if (error.name === 'TypeError' && error.message.includes('fetch')) {
    return 'Unable to connect to the server. Please check your internet connection.';
  }

  // Handle network errors
  if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
    return 'Unable to connect to the server. Please try again later.';
  }

  if (error.code === 'ETIMEDOUT') {
    return 'Request timed out. Please try again.';
  }

  // Handle error objects with message property
  if (error.message && typeof error.message === 'string') {
    // Don't return status codes as messages
    if (!/^\d{3}$/.test(error.message.trim())) {
      return error.message;
    }
  }

  // Handle string errors
  if (typeof error === 'string') {
    return error;
  }

  // Default fallback
  return defaultMessage;
}

/**
 * Returns a user-friendly message based on HTTP status code
 */
function getStatusMessage(status: number): string {
  const statusMessages: Record<number, string> = {
    400: 'Invalid request. Please check your input and try again.',
    401: 'Your session has expired. Please log in again.',
    403: 'You do not have permission to perform this action.',
    404: 'The requested resource was not found.',
    409: 'This record already exists. Please check your input.',
    422: 'Validation error. Please check your input and try again.',
    429: 'Too many requests. Please try again later.',
    500: 'Server error. Please try again later.',
    502: 'Service temporarily unavailable. Please try again later.',
    503: 'Service temporarily unavailable. Please try again later.',
    504: 'Request timed out. Please try again.',
  };

  return statusMessages[status] || `An error occurred (${status}). Please try again.`;
}



