// Comprehensive Error Handling System
import React from 'react';
import { ApiError } from '@/lib/services/apiService';

// Error types
export enum ErrorType {
  NETWORK = 'NETWORK',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  VALIDATION = 'VALIDATION',
  NOT_FOUND = 'NOT_FOUND',
  SERVER = 'SERVER',
  UNKNOWN = 'UNKNOWN',
}

// Error severity levels
export enum ErrorSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

// Error interface
export interface AppError {
  type: ErrorType;
  severity: ErrorSeverity;
  message: string;
  code?: string | number;
  details?: any;
  timestamp: Date;
  userMessage: string;
  action?: string;
}

// Error handler class
export class ErrorHandler {
  private static instance: ErrorHandler;
  private errorLog: AppError[] = [];
  private maxLogSize = 100;

  private constructor() {}

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  // Main error handling method
  handleError(error: any, context?: string): AppError {
    const appError = this.categorizeError(error, context);
    this.logError(appError);
    this.notifyUser(appError);
    return appError;
  }

  // Categorize error based on type and context
  private categorizeError(error: any, context?: string): AppError {
    const timestamp = new Date();
    
    // Handle API errors
    if (error instanceof ApiError) {
      return this.handleApiError(error, context, timestamp);
    }

    // Handle network errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return {
        type: ErrorType.NETWORK,
        severity: ErrorSeverity.HIGH,
        message: error.message,
        timestamp,
        userMessage: 'Unable to connect to the server. Please check your internet connection.',
        action: 'retry',
      };
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      return {
        type: ErrorType.VALIDATION,
        severity: ErrorSeverity.MEDIUM,
        message: error.message,
        timestamp,
        userMessage: 'Please check your input and try again.',
        action: 'fix_input',
      };
    }

    // Handle unknown errors
    return {
      type: ErrorType.UNKNOWN,
      severity: ErrorSeverity.MEDIUM,
      message: error.message || 'An unexpected error occurred',
      timestamp,
      userMessage: 'Something went wrong. Please try again.',
      action: 'retry',
    };
  }

  // Handle API-specific errors
  private handleApiError(error: ApiError, context?: string, timestamp?: Date): AppError {
    const baseError: AppError = {
      type: ErrorType.UNKNOWN,
      severity: ErrorSeverity.MEDIUM,
      message: error.message,
      code: error.status,
      timestamp: timestamp || new Date(),
      userMessage: error.message,
    };

    switch (error.status) {
      case 401:
        return {
          ...baseError,
          type: ErrorType.AUTHENTICATION,
          severity: ErrorSeverity.HIGH,
          userMessage: 'Your session has expired. Please log in again.',
          action: 'login',
        };

      case 403:
        return {
          ...baseError,
          type: ErrorType.AUTHORIZATION,
          severity: ErrorSeverity.HIGH,
          userMessage: 'You do not have permission to perform this action.',
          action: 'contact_admin',
        };

      case 404:
        return {
          ...baseError,
          type: ErrorType.NOT_FOUND,
          severity: ErrorSeverity.MEDIUM,
          userMessage: 'The requested resource was not found.',
          action: 'go_back',
        };

      case 422:
        return {
          ...baseError,
          type: ErrorType.VALIDATION,
          severity: ErrorSeverity.MEDIUM,
          userMessage: 'Please check your input and try again.',
          action: 'fix_input',
        };

      case 500:
      case 502:
      case 503:
        return {
          ...baseError,
          type: ErrorType.SERVER,
          severity: ErrorSeverity.CRITICAL,
          userMessage: 'Server error. Please try again later.',
          action: 'retry_later',
        };

      default:
        if (error.status >= 400 && error.status < 500) {
          return {
            ...baseError,
            type: ErrorType.VALIDATION,
            severity: ErrorSeverity.MEDIUM,
            userMessage: 'Please check your request and try again.',
            action: 'retry',
          };
        } else if (error.status >= 500) {
          return {
            ...baseError,
            type: ErrorType.SERVER,
            severity: ErrorSeverity.HIGH,
            userMessage: 'Server error. Please try again later.',
            action: 'retry_later',
          };
        }
        return baseError;
    }
  }

  // Log error to console and store in memory
  private logError(error: AppError): void {
    console.error('Error occurred:', {
      type: error.type,
      severity: error.severity,
      message: error.message,
      code: error.code,
      timestamp: error.timestamp,
      context: error.details,
    });

    // Add to error log
    this.errorLog.unshift(error);
    
    // Keep log size manageable
    if (this.errorLog.length > this.maxLogSize) {
      this.errorLog = this.errorLog.slice(0, this.maxLogSize);
    }
  }

  // Notify user based on error severity
  private notifyUser(error: AppError): void {
    // For critical errors, show immediate notification
    if (error.severity === ErrorSeverity.CRITICAL) {
      this.showCriticalError(error);
    }
    
    // For high severity errors, show toast notification
    if (error.severity === ErrorSeverity.HIGH) {
      this.showToast(error.userMessage, 'error');
    }
  }

  // Show critical error modal
  private showCriticalError(error: AppError): void {
    // This would typically show a modal or redirect to error page
    console.error('Critical error:', error);
    
    // In a real app, you might want to:
    // 1. Show a modal with error details
    // 2. Redirect to an error page
    // 3. Send error to monitoring service
  }

  // Show toast notification
  private showToast(message: string, type: 'success' | 'error' | 'warning' | 'info'): void {
    // This would typically use a toast library like react-hot-toast
    console.log(`Toast [${type}]:`, message);
    
    // In a real app, you might want to:
    // 1. Use react-hot-toast
    // 2. Use Material-UI Snackbar
    // 3. Use custom toast component
  }

  // Get error log
  getErrorLog(): AppError[] {
    return [...this.errorLog];
  }

  // Clear error log
  clearErrorLog(): void {
    this.errorLog = [];
  }

  // Get errors by type
  getErrorsByType(type: ErrorType): AppError[] {
    return this.errorLog.filter(error => error.type === type);
  }

  // Get errors by severity
  getErrorsBySeverity(severity: ErrorSeverity): AppError[] {
    return this.errorLog.filter(error => error.severity === severity);
  }

  // Get recent errors
  getRecentErrors(count: number = 10): AppError[] {
    return this.errorLog.slice(0, count);
  }
}

// Create singleton instance
export const errorHandler = ErrorHandler.getInstance();

// Utility functions for common error scenarios
export const handleApiError = (error: any, context?: string): AppError => {
  return errorHandler.handleError(error, context);
};

export const handleNetworkError = (error: any): AppError => {
  return errorHandler.handleError(error, 'network');
};

export const handleAuthError = (error: any): AppError => {
  return errorHandler.handleError(error, 'authentication');
};

export const handleValidationError = (error: any): AppError => {
  return errorHandler.handleError(error, 'validation');
};

// React hook for error handling
export const useErrorHandler = () => {
  const handleError = (error: any, context?: string) => {
    return errorHandler.handleError(error, context);
  };

  const getErrorLog = () => {
    return errorHandler.getErrorLog();
  };

  const clearErrorLog = () => {
    errorHandler.clearErrorLog();
  };

  return {
    handleError,
    getErrorLog,
    clearErrorLog,
    ErrorType,
    ErrorSeverity,
  };
};

// Error boundary component
interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: any;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    errorHandler.handleError(error, 'error_boundary');
    console.error('Error boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Something went wrong.</h2>
          <p>We're sorry, but something unexpected happened.</p>
          <button onClick={() => window.location.reload()}>
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default errorHandler;