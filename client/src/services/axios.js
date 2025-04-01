import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://urban-realty-production-cc1f.up.railway.app/api/v1',
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

// Add these to your existing axios service
export const getAdminDashboardStats = ()=> {
  console.log('getAdminDashboardStats');
  axios.get('/admin/dashboard');}
export const getAdminUsers = (params) => axios.get('/admin/users', { params });
export const getAdminProperties = (params) => axios.get('/admin/properties', { params });
export const getAdminInquiries = (params) => axios.get('/admin/inquiries', { params });
export const getAdminInquiry = (id) => axios.get(`/admin/inquiries/${id}`);
export const updateUserRole = (id, role) => axios.put(`/admin/users/${id}/role`, { role });
export const toggleFeaturedProperty = (id, featured) => axios.patch(`/api/v1/admin/properties/${id}/featured`, { featured });
export const updateInquiryStatus = (id, status) => axios.patch(` /admin/inquiries/${id}/status`, { status });
export const deleteAdminUser = (id) => axios.delete(` /admin/users/${id}`);
export const deleteAdminProperty = (id) => axios.delete(` /admin/properties/${id}`);
export const deleteAdminInquiry = (id) => axios.delete(` /admin/inquiries/${id}`);

export default instance;