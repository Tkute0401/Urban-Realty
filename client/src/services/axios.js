import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding token and handling multipart data
instance.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Handle FormData content type
    if (config.data instanceof FormData) {
      config.headers['Content-Type'] = 'multipart/form-data';
      // Remove the default Content-Type if it exists
      delete config.headers['Content-Type'];
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Enhanced response interceptor
instance.interceptors.response.use(
  (response) => {
    // You can transform the response data here if needed
    return response;
  },
  (error) => {
    // Handle network errors
    if (!error.response) {
      console.error('Network Error:', error.message);
      return Promise.reject({
        message: 'Network Error: Please check your internet connection',
        isNetworkError: true,
      });
    }

    // Handle specific status codes
    const status = error.response?.status;
    const data = error.response?.data;

    // Unauthorized - redirect to login
    if (status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      return Promise.reject({
        message: 'Session expired. Please login again.',
        status,
        data,
      });
    }

    // Forbidden
    if (status === 403) {
      return Promise.reject({
        message: data?.message || 'You are not authorized to perform this action',
        status,
        data,
      });
    }

    // Not Found
    if (status === 404) {
      return Promise.reject({
        message: data?.message || 'Resource not found',
        status,
        data,
      });
    }

    // Validation errors (422 or similar)
    if (status === 422) {
      const validationErrors = data?.errors || [];
      return Promise.reject({
        message: 'Validation failed',
        errors: validationErrors,
        status,
        data,
      });
    }

    // Server errors (500+)
    if (status >= 500) {
      return Promise.reject({
        message: data?.message || 'Server error occurred. Please try again later.',
        status,
        data,
      });
    }

    // Default error handling
    return Promise.reject({
      message: data?.message || error.message || 'An error occurred',
      status,
      data,
    });
  }
);

// Helper function for making FormData requests
export const formDataRequest = (url, data, method = 'post', config = {}) => {
  const formData = new FormData();
  
  // Convert object to FormData
  if (data && typeof data === 'object') {
    Object.entries(data).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(item => formData.append(key, item));
      } else if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });
  }

  return instance({
    url,
    method,
    data: formData,
    ...config,
  });
};

export default instance;