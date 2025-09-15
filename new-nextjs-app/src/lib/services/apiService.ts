// Real API Service - Connects to Express.js backend
import { mockApi } from './mockApi';

// Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';
// Do NOT default to mock data in development; require explicit env flag
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

// API Response interface
interface ApiResponse<T = any> {
  data: T;
  status: number;
  success?: boolean;
  error?: string;
  message?: string;
}

// Login response interface
interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

// Register response interface
interface RegisterResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

// API Error class
class ApiError extends Error {
  status: number;
  data?: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

// HTTP Client class
class HttpClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getToken();

    const config: RequestInit = {
      ...options,
      headers: {
        ...this.defaultHeaders,
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      // Safely parse response: handle empty bodies and non-JSON
      let data: any = null;
      const contentType = response.headers.get('content-type') || '';
      const contentLength = response.headers.get('content-length');

      // 204 No Content or explicitly empty body
      if (response.status === 204 || contentLength === '0') {
        data = null;
      } else if (contentType.includes('application/json')) {
        try {
          data = await response.json();
        } catch (parseErr) {
          // Fallback to text for mislabelled responses
          const text = await response.text();
          throw new ApiError(
            'Invalid JSON response',
            response.status,
            { body: text }
          );
        }
      } else {
        // Not JSON; read as text and throw a helpful error for callers
        const text = await response.text();
        throw new ApiError(
          'Unexpected non-JSON response',
          response.status,
          { body: text, contentType }
        );
      }

      if (!response.ok) {
        throw new ApiError(
          data.error || data.message || 'Request failed',
          response.status,
          data
        );
      }

      // Important: spread original payload FIRST, then normalize data so
      // callers can always read response.data as the actual payload object/array
      // (and not the envelope). Previously, the spread overwrote data.
      return {
        ...(data && typeof data === 'object' ? data : {}),
        status: response.status,
        success: data && typeof data === 'object' && 'success' in data ? data.success !== false : true,
        data: (data && typeof data === 'object' && 'data' in data) ? (data as any).data : data,
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      // Network or other errors
      throw new ApiError(
        error instanceof Error ? error.message : 'Network error',
        0,
        error
      );
    }
  }

  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    const url = new URL(`${this.baseURL}${endpoint}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }
    
    return this.request<T>(url.pathname + url.search);
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }

  async postFormData<T>(endpoint: string, formData: FormData): Promise<ApiResponse<T>> {
    const token = this.getToken();
    
    return this.request<T>(endpoint, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
        // Don't set Content-Type for FormData, let browser set it with boundary
      },
      body: formData,
    });
  }
}

// Create HTTP client instance
const httpClient = new HttpClient(API_BASE_URL);

// Real API Service class
export class ApiService {
  // Authentication endpoints
  async login(email: string, password: string): Promise<ApiResponse<LoginResponse>> {
    if (USE_MOCK_DATA) {
      return await mockApi.auth.login(email, password) as ApiResponse<LoginResponse>;
    }

    try {
      const response = await httpClient.post<LoginResponse>('/auth/login', { email, password });
      
      // Store token if login successful
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async register(userData: any): Promise<ApiResponse<RegisterResponse>> {
    if (USE_MOCK_DATA) {
      return await mockApi.auth.register(userData) as ApiResponse<RegisterResponse>;
    }

    try {
      const response = await httpClient.post<RegisterResponse>('/auth/register', userData);
      
      // Store token if registration successful
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      
      return response;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async getMe(): Promise<ApiResponse> {
    if (USE_MOCK_DATA) {
      const token = localStorage.getItem('token') || 'mock-token';
      return await mockApi.auth.getMe(token) as ApiResponse;
    }

    try {
      return await httpClient.get('/auth/me');
    } catch (error) {
      console.error('Get me error:', error);
      throw error;
    }
  }

  async updateUser(userData: any): Promise<ApiResponse> {
    if (USE_MOCK_DATA) {
      return await mockApi.auth.updateUser(userData) as ApiResponse;
    }

    try {
      return await httpClient.put('/auth/update', userData);
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  // Property endpoints
  async getProperties(filters?: any): Promise<ApiResponse> {
    if (USE_MOCK_DATA) {
      return await mockApi.properties.list(filters) as ApiResponse;
    }

    try {
      return await httpClient.get('/properties', filters);
    } catch (error) {
      console.error('Get properties error:', error);
      throw error;
    }
  }

  async getProperty(id: string): Promise<ApiResponse> {
    if (USE_MOCK_DATA) {
      return await mockApi.properties.get(id) as ApiResponse;
    }

    try {
      return await httpClient.get(`/properties/${id}`);
    } catch (error) {
      console.error('Get property error:', error);
      throw error;
    }
  }

  async getFeaturedProperties(): Promise<ApiResponse> {
    if (USE_MOCK_DATA) {
      return await mockApi.properties.featured() as ApiResponse;
    }

    try {
      return await httpClient.get('/properties/featured');
    } catch (error) {
      console.error('Get featured properties error:', error);
      throw error;
    }
  }

  async createProperty(propertyData: any): Promise<ApiResponse> {
    if (USE_MOCK_DATA) {
      return await mockApi.properties.create(propertyData) as ApiResponse;
    }

    try {
      // Handle file uploads
      if (propertyData.images && propertyData.images.length > 0) {
        const formData = new FormData();
        
        // Add property data
        Object.keys(propertyData).forEach(key => {
          if (key !== 'images') {
            formData.append(key, propertyData[key]);
          }
        });
        
        // Add images
        propertyData.images.forEach((image: File, index: number) => {
          formData.append('images', image);
        });
        
        return await httpClient.postFormData('/properties', formData);
      } else {
        return await httpClient.post('/properties', propertyData);
      }
    } catch (error) {
      console.error('Create property error:', error);
      throw error;
    }
  }

  async updateProperty(id: string, updates: any): Promise<ApiResponse> {
    if (USE_MOCK_DATA) {
      return await mockApi.properties.update(id, updates) as ApiResponse;
    }

    try {
      // Handle file uploads
      if (updates.images && updates.images.length > 0) {
        const formData = new FormData();
        
        // Add property data
        Object.keys(updates).forEach(key => {
          if (key !== 'images') {
            formData.append(key, updates[key]);
          }
        });
        
        // Add images
        updates.images.forEach((image: File, index: number) => {
          formData.append('images', image);
        });
        
        return await httpClient.put(`/properties/${id}`, formData);
      } else {
        return await httpClient.put(`/properties/${id}`, updates);
      }
    } catch (error) {
      console.error('Update property error:', error);
      throw error;
    }
  }

  async deleteProperty(id: string): Promise<ApiResponse> {
    if (USE_MOCK_DATA) {
      return await mockApi.properties.delete(id) as ApiResponse;
    }

    try {
      return await httpClient.delete(`/properties/${id}`);
    } catch (error) {
      console.error('Delete property error:', error);
      throw error;
    }
  }

  // Favorites endpoints
  async getFavorites(): Promise<ApiResponse> {
    if (USE_MOCK_DATA) {
      // No mock endpoint defined; return empty structure to avoid UI breaks
      return { data: [], status: 200, success: true } as ApiResponse;
    }

    try {
      return await httpClient.get('/auth/favorites');
    } catch (error) {
      console.error('Get favorites error:', error);
      throw error;
    }
  }

  async addFavorite(propertyId: string): Promise<ApiResponse> {
    if (USE_MOCK_DATA) {
      return { data: { propertyId }, status: 200, success: true } as ApiResponse;
    }

    try {
      return await httpClient.put(`/auth/favorites/${propertyId}`, {});
    } catch (error) {
      console.error('Add favorite error:', error);
      throw error;
    }
  }

  async removeFavorite(propertyId: string): Promise<ApiResponse> {
    if (USE_MOCK_DATA) {
      return { data: { propertyId }, status: 200, success: true } as ApiResponse;
    }

    try {
      return await httpClient.delete(`/auth/favorites/${propertyId}`);
    } catch (error) {
      console.error('Remove favorite error:', error);
      throw error;
    }
  }

  async getFavoriteStatus(propertyId: string): Promise<ApiResponse<{ favorited: boolean }>> {
    if (USE_MOCK_DATA) {
      return { data: { favorited: false }, status: 200, success: true } as ApiResponse<{ favorited: boolean }>;
    }

    try {
      return await httpClient.get(`/auth/favorites/${propertyId}/status`);
    } catch (error) {
      console.error('Favorite status error:', error);
      throw error;
    }
  }

  // Recently viewed endpoints
  async getRecentlyViewed(): Promise<ApiResponse> {
    if (USE_MOCK_DATA) {
      return { data: [], status: 200, success: true } as ApiResponse;
    }

    try {
      return await httpClient.get('/auth/recently-viewed');
    } catch (error) {
      console.error('Get recently viewed error:', error);
      throw error;
    }
  }

  async addRecentlyViewed(propertyId: string): Promise<ApiResponse> {
    if (USE_MOCK_DATA) {
      return { data: { propertyId }, status: 200, success: true } as ApiResponse;
    }

    try {
      return await httpClient.post(`/auth/recently-viewed/${propertyId}`);
    } catch (error) {
      console.error('Add recently viewed error:', error);
      throw error;
    }
  }

  // Contact endpoints
  async getContacts(filters?: any): Promise<ApiResponse> {
    if (USE_MOCK_DATA) {
      return await mockApi.contacts.list(filters) as ApiResponse;
    }

    try {
      return await httpClient.get('/contacts', filters);
    } catch (error) {
      console.error('Get contacts error:', error);
      throw error;
    }
  }

  async getContact(id: string): Promise<ApiResponse> {
    if (USE_MOCK_DATA) {
      return await mockApi.contacts.get(id) as ApiResponse;
    }

    try {
      return await httpClient.get(`/contacts/${id}`);
    } catch (error) {
      console.error('Get contact error:', error);
      throw error;
    }
  }

  async createContact(contactData: any): Promise<ApiResponse> {
    if (USE_MOCK_DATA) {
      return await mockApi.contacts.create(contactData) as ApiResponse;
    }

    try {
      return await httpClient.post('/contacts', contactData);
    } catch (error) {
      console.error('Create contact error:', error);
      throw error;
    }
  }

  async updateContact(id: string, updates: any): Promise<ApiResponse> {
    if (USE_MOCK_DATA) {
      return await mockApi.contacts.update(id, updates) as ApiResponse;
    }

    try {
      return await httpClient.put(`/contacts/${id}`, updates);
    } catch (error) {
      console.error('Update contact error:', error);
      throw error;
    }
  }

  async deleteContact(id: string): Promise<ApiResponse> {
    if (USE_MOCK_DATA) {
      return await mockApi.contacts.delete(id) as ApiResponse;
    }

    try {
      return await httpClient.delete(`/contacts/${id}`);
    } catch (error) {
      console.error('Delete contact error:', error);
      throw error;
    }
  }

  // Subscription endpoints
  async getSubscriptionPlans(): Promise<ApiResponse> {
    if (USE_MOCK_DATA) {
      return await mockApi.subscriptions.getPlans() as ApiResponse;
    }

    try {
      return await httpClient.get('/subscriptions/plans');
    } catch (error) {
      console.error('Get subscription plans error:', error);
      throw error;
    }
  }

  async getUserSubscription(userId: string): Promise<ApiResponse> {
    if (USE_MOCK_DATA) {
      return await mockApi.subscriptions.getUserSubscription(userId) as ApiResponse;
    }

    try {
      return await httpClient.get(`/subscriptions/user/${userId}`);
    } catch (error) {
      console.error('Get user subscription error:', error);
      throw error;
    }
  }

  async subscribe(userId: string, planId: string, paymentMethod: string): Promise<ApiResponse> {
    if (USE_MOCK_DATA) {
      return await mockApi.subscriptions.subscribe(userId, planId, paymentMethod) as ApiResponse;
    }

    try {
      return await httpClient.post('/subscriptions/subscribe', {
        userId,
        planId,
        paymentMethod,
      });
    } catch (error) {
      console.error('Subscribe error:', error);
      throw error;
    }
  }

  async cancelSubscription(userId: string): Promise<ApiResponse> {
    if (USE_MOCK_DATA) {
      return await mockApi.subscriptions.cancel(userId) as ApiResponse;
    }

    try {
      return await httpClient.delete(`/subscriptions/user/${userId}`);
    } catch (error) {
      console.error('Cancel subscription error:', error);
      throw error;
    }
  }

  // Update subscription plan
  async updateSubscription(userId: string, planId: string): Promise<ApiResponse> {
    if (USE_MOCK_DATA) {
      return await mockApi.subscriptions.update(userId, planId) as ApiResponse;
    }

    try {
      return await httpClient.put(`/subscriptions/user/${userId}`, { planId });
    } catch (error) {
      console.error('Update subscription error:', error);
      throw error;
    }
  }

  // Admin endpoints
  async getAdminDashboard(): Promise<ApiResponse> {
    if (USE_MOCK_DATA) {
      return await mockApi.admin.getDashboard() as ApiResponse;
    }

    try {
      return await httpClient.get('/admin/dashboard');
    } catch (error) {
      console.error('Get admin dashboard error:', error);
      throw error;
    }
  }

  async getAdminUsers(filters?: any): Promise<ApiResponse> {
    if (USE_MOCK_DATA) {
      return await mockApi.admin.getUsers(filters) as ApiResponse;
    }

    try {
      return await httpClient.get('/admin/users', filters);
    } catch (error) {
      console.error('Get admin users error:', error);
      throw error;
    }
  }

  async getAdminProperties(filters?: any): Promise<ApiResponse> {
    if (USE_MOCK_DATA) {
      return await mockApi.admin.getProperties(filters) as ApiResponse;
    }

    try {
      return await httpClient.get('/admin/properties', filters);
    } catch (error) {
      console.error('Get admin properties error:', error);
      throw error;
    }
  }

  async getAdminContacts(filters?: any): Promise<ApiResponse> {
    if (USE_MOCK_DATA) {
      return await mockApi.admin.getContacts(filters) as ApiResponse;
    }

    try {
      return await httpClient.get('/admin/contacts', filters);
    } catch (error) {
      console.error('Get admin contacts error:', error);
      throw error;
    }
  }

  // Agent endpoints
  async getAgentDashboard(agentId: string): Promise<ApiResponse> {
    if (USE_MOCK_DATA) {
      return await mockApi.agent.getDashboard(agentId) as ApiResponse;
    }

    try {
      return await httpClient.get(`/agent/${agentId}/dashboard`);
    } catch (error) {
      console.error('Get agent dashboard error:', error);
      throw error;
    }
  }

  async getAgentProperties(agentId: string, filters?: any): Promise<ApiResponse> {
    if (USE_MOCK_DATA) {
      return await mockApi.agent.getProperties(agentId, filters) as ApiResponse;
    }

    try {
      return await httpClient.get(`/properties/agent/${agentId}`, filters);
    } catch (error) {
      console.error('Get agent properties error:', error);
      throw error;
    }
  }

  async getAgentLeads(agentId: string, filters?: any): Promise<ApiResponse> {
    if (USE_MOCK_DATA) {
      return await mockApi.agent.getLeads(agentId, filters) as ApiResponse;
    }

    try {
      return await httpClient.get(`/agent/${agentId}/leads`, filters);
    } catch (error) {
      console.error('Get agent leads error:', error);
      throw error;
    }
  }

  async getAgentAnalytics(agentId: string): Promise<ApiResponse> {
    if (USE_MOCK_DATA) {
      return await mockApi.agent.getAnalytics(agentId) as ApiResponse;
    }

    try {
      return await httpClient.get(`/agent/${agentId}/analytics`);
    } catch (error) {
      console.error('Get agent analytics error:', error);
      throw error;
    }
  }

  // Health check
  async healthCheck(): Promise<ApiResponse> {
    try {
      return await httpClient.get('/health');
    } catch (error) {
      console.error('Health check error:', error);
      throw error;
    }
  }
}

// Create singleton instance
export const apiService = new ApiService();

// Export for use in components
export default apiService;

// Export types and classes
export type { ApiResponse };
export { ApiError };