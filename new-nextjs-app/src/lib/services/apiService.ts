import http from '@/lib/services/http';
import { api } from '@/lib/services/api';

type ApiResponse<T = any> = { data: T; status: number; success?: boolean; message?: string };

class ApiService {
  async login(email: string, password: string): Promise<ApiResponse<{ token: string; user: any }>> {
    const res = await api.auth.login({ email, password });
    return { data: res.data, status: 200, success: res.success, message: res.message };
  }

  async register(userData: any): Promise<ApiResponse<{ token: string; user: any }>> {
    const res = await api.auth.register(userData);
    return { data: res.data, status: 200, success: res.success, message: res.message };
  }

  async getMe(): Promise<ApiResponse<{ user: any }>> {
    const res = await api.auth.profile();
    return { data: res.data, status: 200, success: res.success, message: res.message };
  }

  async updateUser(userData: any): Promise<ApiResponse> {
    const { data } = await http.put('/auth/update', userData);
    return { data, status: 200 };
  }

  async logout(): Promise<void> {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('token');
      window.localStorage.removeItem('user');
    }
  }

  async getProperties(filters?: any): Promise<ApiResponse> {
    const res = await api.properties.list(filters || {});
    return { data: res.data, status: 200, success: res.success, message: res.message };
  }

  async getProperty(id: string): Promise<ApiResponse> {
    const res = await api.properties.getById(id);
    return { data: res.data, status: 200, success: res.success, message: res.message };
  }

  async getFeaturedProperties(): Promise<ApiResponse> {
    const { data } = await http.get('/properties/featured');
    return { data, status: 200 };
  }

  async createProperty(propertyData: any): Promise<ApiResponse> {
    const res = await api.properties.create(propertyData);
    return { data: res.data, status: 200, success: res.success, message: res.message };
  }

  async updateProperty(id: string, updates: any): Promise<ApiResponse> {
    const { data } = await http.put(`/properties/${id}`, updates);
    return { data, status: 200 };
  }

  async deleteProperty(id: string): Promise<ApiResponse> {
    const { data } = await http.delete(`/properties/${id}`);
    return { data, status: 200 };
  }

  async getFavorites(): Promise<ApiResponse> {
    const { data } = await http.get('/auth/favorites');
    return { data, status: 200 };
  }

  async addFavorite(propertyId: string): Promise<ApiResponse> {
    const { data } = await http.put(`/auth/favorites/${propertyId}`, {});
    return { data, status: 200 };
  }

  async removeFavorite(propertyId: string): Promise<ApiResponse> {
    const { data } = await http.delete(`/auth/favorites/${propertyId}`);
    return { data, status: 200 };
  }

  async getFavoriteStatus(propertyId: string): Promise<ApiResponse<{ favorited: boolean }>> {
    const { data } = await http.get(`/auth/favorites/${propertyId}/status`);
    return { data, status: 200 };
  }

  async getRecentlyViewed(): Promise<ApiResponse> {
    const { data } = await http.get('/auth/recently-viewed');
    return { data, status: 200 };
  }

  async addRecentlyViewed(propertyId: string): Promise<ApiResponse> {
    const { data } = await http.post(`/auth/recently-viewed/${propertyId}`, {});
    return { data, status: 200 };
  }

  async getContacts(filters?: any): Promise<ApiResponse> {
    const { data } = await http.get('/contacts', { params: filters });
    return { data, status: 200 };
  }

  async getContact(id: string): Promise<ApiResponse> {
    const { data } = await http.get(`/contacts/${id}`);
    return { data, status: 200 };
  }

  async createContact(contactData: any): Promise<ApiResponse> {
    const { data } = await http.post('/contacts', contactData);
    return { data, status: 200 };
  }

  async updateContact(id: string, updates: any): Promise<ApiResponse> {
    const { data } = await http.put(`/contacts/${id}`, updates);
    return { data, status: 200 };
  }

  async deleteContact(id: string): Promise<ApiResponse> {
    const { data } = await http.delete(`/contacts/${id}`);
    return { data, status: 200 };
  }

  async getSubscriptionPlans(): Promise<ApiResponse> {
    const res = await api.subscriptions.plans();
    return { data: res.data, status: 200, success: res.success, message: res.message };
  }

  async getUserSubscription(userId: string): Promise<ApiResponse> {
    const res = await api.subscriptions.current(userId);
    return { data: res.data, status: 200, success: res.success, message: res.message };
  }

  async subscribe(userId: string, planId: string, paymentMethod: string): Promise<ApiResponse> {
    const res = await api.subscriptions.subscribe({ userId, planId, paymentMethod });
    return { data: res.data, status: 200, success: res.success, message: res.message };
  }

  async cancelSubscription(userId: string): Promise<ApiResponse> {
    const res = await api.subscriptions.cancel(userId);
    return { data: res.data, status: 200, success: res.success, message: res.message };
  }

  async updateSubscription(userId: string, planId: string): Promise<ApiResponse> {
    const res = await api.subscriptions.update({ userId, planId });
    return { data: res.data, status: 200, success: res.success, message: res.message };
  }

  async getAdminDashboard(): Promise<ApiResponse> {
    const res = await api.admin.dashboard();
    return { data: res.data, status: 200, success: res.success, message: res.message };
  }

  async getAdminUsers(filters?: any): Promise<ApiResponse> {
    const { data } = await http.get('/admin/users', { params: filters });
    return { data, status: 200 };
  }

  async getAdminProperties(filters?: any): Promise<ApiResponse> {
    const { data } = await http.get('/admin/properties', { params: filters });
    return { data, status: 200 };
  }

  async getAdminContacts(filters?: any): Promise<ApiResponse> {
    const { data } = await http.get('/admin/contacts', { params: filters });
    return { data, status: 200 };
  }

  async getAdminAnalytics(): Promise<ApiResponse> {
    const res = await api.admin.analytics();
    return { data: res.data, status: 200, success: res.success, message: res.message };
  }

  async getAgentDashboard(agentId: string): Promise<ApiResponse> {
    const { data } = await http.get(`/agent/${agentId}/dashboard`);
    return { data, status: 200 };
  }

  async getAgentProperties(agentId: string, filters?: any): Promise<ApiResponse> {
    const { data } = await http.get(`/properties/agent/${agentId}`, { params: filters });
    return { data, status: 200 };
  }

  async getAgentLeads(agentId: string, filters?: any): Promise<ApiResponse> {
    const { data } = await http.get(`/agent/${agentId}/leads`, { params: filters });
    return { data, status: 200 };
  }

  async getAgentAnalytics(agentId: string): Promise<ApiResponse> {
    const { data } = await http.get(`/agent/${agentId}/analytics`);
    return { data, status: 200 };
  }

  async healthCheck(): Promise<ApiResponse> {
    const { data } = await http.get('/health');
    return { data, status: 200 };
  }
}

export const apiService = new ApiService();
export default apiService;

export type { ApiResponse };