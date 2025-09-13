// Mock API Service - Uses mock data for development and testing
import { mockAPI } from '@/lib/mock-data';

// API Service class that uses mock data
export class MockApiService {
  // Authentication endpoints
  async login(email: string, password: string) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const response = mockAPI.auth.login(email, password);
        resolve({
          data: response,
          status: response.success ? 200 : 401,
        });
      }, 500); // Simulate network delay
    });
  }

  async register(userData: any) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const response = mockAPI.auth.register(userData);
        resolve({
          data: response,
          status: response.success ? 201 : 400,
        });
      }, 500);
    });
  }

  async getMe(token: string) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const response = mockAPI.auth.me(token);
        resolve({
          data: response,
          status: response.success ? 200 : 401,
        });
      }, 300);
    });
  }

  // Property endpoints
  async getProperties(filters?: any) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const response = mockAPI.properties.list(filters);
        resolve({
          data: response,
          status: 200,
        });
      }, 400);
    });
  }

  async getProperty(id: string) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const response = mockAPI.properties.get(id);
        resolve({
          data: response,
          status: response.success ? 200 : 404,
        });
      }, 300);
    });
  }

  async getFeaturedProperties() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const response = mockAPI.properties.featured();
        resolve({
          data: response,
          status: 200,
        });
      }, 300);
    });
  }

  async createProperty(propertyData: any) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const response = mockAPI.properties.create(propertyData);
        resolve({
          data: response,
          status: response.success ? 201 : 400,
        });
      }, 600);
    });
  }

  async updateProperty(id: string, updates: any) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const response = mockAPI.properties.update(id, updates);
        resolve({
          data: response,
          status: response.success ? 200 : 404,
        });
      }, 500);
    });
  }

  async deleteProperty(id: string) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const response = mockAPI.properties.delete(id);
        resolve({
          data: response,
          status: response.success ? 200 : 404,
        });
      }, 400);
    });
  }

  // Developer endpoints
  async getDevelopers(filters?: any) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const response = mockAPI.developers.list(filters);
        resolve({
          data: response,
          status: 200,
        });
      }, 400);
    });
  }

  async getDeveloper(id: string) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const response = mockAPI.developers.get(id);
        resolve({
          data: response,
          status: response.success ? 200 : 404,
        });
      }, 300);
    });
  }

  async createDeveloper(developerData: any) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const response = mockAPI.developers.create(developerData);
        resolve({
          data: response,
          status: response.success ? 201 : 400,
        });
      }, 600);
    });
  }

  async updateDeveloper(id: string, updates: any) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const response = mockAPI.developers.update(id, updates);
        resolve({
          data: response,
          status: response.success ? 200 : 404,
        });
      }, 500);
    });
  }

  async deleteDeveloper(id: string) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const response = mockAPI.developers.delete(id);
        resolve({
          data: response,
          status: response.success ? 200 : 404,
        });
      }, 400);
    });
  }

  // Subscription endpoints
  async getSubscriptionPlans() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const response = mockAPI.subscriptions.getPlans();
        resolve({
          data: response,
          status: 200,
        });
      }, 300);
    });
  }

  async getSubscriptionPlan(id: string) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const response = mockAPI.subscriptions.getPlan(id);
        resolve({
          data: response,
          status: response.success ? 200 : 404,
        });
      }, 300);
    });
  }

  async getUserSubscription(userId: string) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const response = mockAPI.subscriptions.getUserSubscription(userId);
        resolve({
          data: response,
          status: response.success ? 200 : 404,
        });
      }, 300);
    });
  }

  async subscribe(userId: string, planId: string, paymentMethod: string) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const response = mockAPI.subscriptions.subscribe(userId, planId, paymentMethod);
        resolve({
          data: response,
          status: response.success ? 201 : 400,
        });
      }, 800);
    });
  }

  async cancelSubscription(userId: string) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const response = mockAPI.subscriptions.cancelSubscription(userId);
        resolve({
          data: response,
          status: response.success ? 200 : 404,
        });
      }, 500);
    });
  }

  async updateSubscription(userId: string, planId: string) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const response = mockAPI.subscriptions.updateSubscription(userId, planId);
        resolve({
          data: response,
          status: response.success ? 200 : 404,
        });
      }, 500);
    });
  }

  // Contact endpoints
  async getContacts(filters?: any) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const response = mockAPI.contacts.list(filters);
        resolve({
          data: response,
          status: 200,
        });
      }, 400);
    });
  }

  async getContact(id: string) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const response = mockAPI.contacts.get(id);
        resolve({
          data: response,
          status: response.success ? 200 : 404,
        });
      }, 300);
    });
  }

  async createContact(contactData: any) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const response = mockAPI.contacts.create(contactData);
        resolve({
          data: response,
          status: response.success ? 201 : 400,
        });
      }, 500);
    });
  }

  async updateContact(id: string, updates: any) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const response = mockAPI.contacts.update(id, updates);
        resolve({
          data: response,
          status: response.success ? 200 : 404,
        });
      }, 400);
    });
  }

  async deleteContact(id: string) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const response = mockAPI.contacts.delete(id);
        resolve({
          data: response,
          status: response.success ? 200 : 404,
        });
      }, 300);
    });
  }

  async assignContact(id: string, agentId: string) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const response = mockAPI.contacts.assign(id, agentId);
        resolve({
          data: response,
          status: response.success ? 200 : 404,
        });
      }, 400);
    });
  }

  // Dashboard/analytics endpoints
  async getDashboardStats() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const { mockStats } = require('@/lib/mock-data');
        resolve({
          data: {
            success: true,
            stats: mockStats,
          },
          status: 200,
        });
      }, 300);
    });
  }

  async getAdminDashboard() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const { mockStats } = require('@/lib/mock-data');
        resolve({
          data: {
            success: true,
            dashboard: {
              stats: mockStats,
              recentContacts: mockAPI.contacts.list({ limit: 5 }),
              recentProperties: mockAPI.properties.list({ limit: 5 }),
              topAgents: [
                { id: 'agent1', name: 'John Agent', sales: 2500000, properties: 3 },
                { id: 'agent2', name: 'Sarah Smith', sales: 1800000, properties: 2 },
              ],
            },
          },
          status: 200,
        });
      }, 400);
    });
  }

  // Admin-specific endpoints
  async getAdminStats(filters?: any) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const response = mockAPI.admin.getDashboard(filters);
        resolve({
          data: response,
          status: 200,
        });
      }, 300);
    });
  }

  async getAdminAnalytics() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const response = mockAPI.admin.getAnalytics();
        resolve({
          data: response,
          status: 200,
        });
      }, 400);
    });
  }

  async getAdminUsers(filters?: any) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const response = mockAPI.admin.getUsers(filters);
        resolve({
          data: response,
          status: 200,
        });
      }, 300);
    });
  }

  async getAdminProperties(filters?: any) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const response = mockAPI.admin.getProperties(filters);
        resolve({
          data: response,
          status: 200,
        });
      }, 300);
    });
  }

  async getAdminContacts(filters?: any) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const response = mockAPI.admin.getContacts(filters);
        resolve({
          data: response,
          status: 200,
        });
      }, 300);
    });
  }

  async getAgentDashboard(agentId: string) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            success: true,
            dashboard: {
              stats: {
                totalProperties: 5,
                totalLeads: 6,
                totalSales: 2500000,
                conversionRate: 0.15,
              },
              recentLeads: mockAPI.contacts.list({ agentId, limit: 5 }),
              myProperties: mockAPI.properties.list({ agentId }),
            },
          },
          status: 200,
        });
      }, 400);
    });
  }
}

// Create singleton instance
export const mockApiService = new MockApiService();

// Create a structured API object for easier access
export const mockApi = {
  auth: {
    login: (email: string, password: string) => mockApiService.login(email, password),
    register: (userData: any) => mockApiService.register(userData),
    getMe: (token: string) => mockApiService.getMe(token),
  },
  properties: {
    list: (filters?: any) => mockApiService.getProperties(filters),
    get: (id: string) => mockApiService.getProperty(id),
    featured: () => mockApiService.getFeaturedProperties(),
    create: (propertyData: any) => mockApiService.createProperty(propertyData),
    update: (id: string, updates: any) => mockApiService.updateProperty(id, updates),
    delete: (id: string) => mockApiService.deleteProperty(id),
  },
  developers: {
    list: (filters?: any) => mockApiService.getDevelopers(filters),
    get: (id: string) => mockApiService.getDeveloper(id),
    create: (developerData: any) => mockApiService.createDeveloper(developerData),
    update: (id: string, updates: any) => mockApiService.updateDeveloper(id, updates),
    delete: (id: string) => mockApiService.deleteDeveloper(id),
  },
  subscriptions: {
    getPlans: () => mockApiService.getSubscriptionPlans(),
    getPlan: (id: string) => mockApiService.getSubscriptionPlan(id),
    getUserSubscription: (userId: string) => mockApiService.getUserSubscription(userId),
    subscribe: (userId: string, planId: string, paymentMethod: string) => mockApiService.subscribe(userId, planId, paymentMethod),
    cancel: (userId: string) => mockApiService.cancelSubscription(userId),
    update: (userId: string, planId: string) => mockApiService.updateSubscription(userId, planId),
  },
  contacts: {
    list: (filters?: any) => mockApiService.getContacts(filters),
    get: (id: string) => mockApiService.getContact(id),
    create: (contactData: any) => mockApiService.createContact(contactData),
    update: (id: string, updates: any) => mockApiService.updateContact(id, updates),
    delete: (id: string) => mockApiService.deleteContact(id),
    assign: (id: string, agentId: string) => mockApiService.assignContact(id, agentId),
  },
  admin: {
    getDashboard: (filters?: any) => mockApiService.getAdminStats(filters),
    getAnalytics: () => mockApiService.getAdminAnalytics(),
    getUsers: (filters?: any) => mockApiService.getAdminUsers(filters),
    getProperties: (filters?: any) => mockApiService.getAdminProperties(filters),
    getContacts: (filters?: any) => mockApiService.getAdminContacts(filters),
  },
  dashboard: {
    getStats: () => mockApiService.getDashboardStats(),
    getAdmin: () => mockApiService.getAdminDashboard(),
    getAgent: (agentId: string) => mockApiService.getAgentDashboard(agentId),
  },
};

// Export for use in components
export default mockApi;