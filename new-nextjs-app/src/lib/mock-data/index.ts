// Mock Data Index - Centralized export for all mock data
export * from './users';
export * from './properties';
export * from './developers';
export * from './subscriptions';
export * from './contacts';
export * from './location-services';
export * from './agents';

// Re-export all mock data and APIs
export { mockUsers, mockAuthResponses } from './users';
export { mockProperties, mockPropertyAPI } from './properties';
export { mockDevelopers, mockDeveloperAPI } from './developers';
export { mockSubscriptionPlans, mockUserSubscriptions, mockSubscriptionAPI } from './subscriptions';
export { mockContactRequests, mockContactAPI } from './contacts';
export { mockNearbyAmenities, mockLocationServicesAPI } from './location-services';
export { mockAgents, mockAgentProperties, mockAgentLeads, mockAgentAnalytics, mockAgentAPI } from './agents';

// Combined mock API for easy access
export const mockAPI = {
  auth: {
    login: (email: string, password: string) => {
      const { mockAuthResponses } = require('./users');
      return mockAuthResponses.login(email, password);
    },
    register: (userData: any) => {
      const { mockAuthResponses } = require('./users');
      return mockAuthResponses.register(userData);
    },
    me: (token: string) => {
      const { mockAuthResponses } = require('./users');
      return mockAuthResponses.me(token);
    },
  },
  properties: {
    list: (filters?: any) => {
      const { mockPropertyAPI } = require('./properties');
      return mockPropertyAPI.list(filters);
    },
    get: (id: string) => {
      const { mockPropertyAPI } = require('./properties');
      return mockPropertyAPI.get(id);
    },
    featured: () => {
      const { mockPropertyAPI } = require('./properties');
      return mockPropertyAPI.featured();
    },
    create: (propertyData: any) => {
      const { mockPropertyAPI } = require('./properties');
      return mockPropertyAPI.create(propertyData);
    },
    update: (id: string, updates: any) => {
      const { mockPropertyAPI } = require('./properties');
      return mockPropertyAPI.update(id, updates);
    },
    delete: (id: string) => {
      const { mockPropertyAPI } = require('./properties');
      return mockPropertyAPI.delete(id);
    },
  },
  developers: {
    list: (filters?: any) => {
      const { mockDeveloperAPI } = require('./developers');
      return mockDeveloperAPI.list(filters);
    },
    get: (id: string) => {
      const { mockDeveloperAPI } = require('./developers');
      return mockDeveloperAPI.get(id);
    },
    create: (developerData: any) => {
      const { mockDeveloperAPI } = require('./developers');
      return mockDeveloperAPI.create(developerData);
    },
    update: (id: string, updates: any) => {
      const { mockDeveloperAPI } = require('./developers');
      return mockDeveloperAPI.update(id, updates);
    },
    delete: (id: string) => {
      const { mockDeveloperAPI } = require('./developers');
      return mockDeveloperAPI.delete(id);
    },
  },
  subscriptions: {
    getPlans: () => {
      const { mockSubscriptionAPI } = require('./subscriptions');
      return mockSubscriptionAPI.getPlans();
    },
    getPlan: (id: string) => {
      const { mockSubscriptionAPI } = require('./subscriptions');
      return mockSubscriptionAPI.getPlan(id);
    },
    getUserSubscription: (userId: string) => {
      const { mockSubscriptionAPI } = require('./subscriptions');
      return mockSubscriptionAPI.getUserSubscription(userId);
    },
    subscribe: (userId: string, planId: string, paymentMethod: string) => {
      const { mockSubscriptionAPI } = require('./subscriptions');
      return mockSubscriptionAPI.subscribe(userId, planId, paymentMethod);
    },
    cancelSubscription: (userId: string) => {
      const { mockSubscriptionAPI } = require('./subscriptions');
      return mockSubscriptionAPI.cancelSubscription(userId);
    },
    updateSubscription: (userId: string, planId: string) => {
      const { mockSubscriptionAPI } = require('./subscriptions');
      return mockSubscriptionAPI.updateSubscription(userId, planId);
    },
  },
  contacts: {
    list: (filters?: any) => {
      const { mockContactAPI } = require('./contacts');
      return mockContactAPI.list(filters);
    },
    get: (id: string) => {
      const { mockContactAPI } = require('./contacts');
      return mockContactAPI.get(id);
    },
    create: (contactData: any) => {
      const { mockContactAPI } = require('./contacts');
      return mockContactAPI.create(contactData);
    },
    update: (id: string, updates: any) => {
      const { mockContactAPI } = require('./contacts');
      return mockContactAPI.update(id, updates);
    },
    delete: (id: string) => {
      const { mockContactAPI } = require('./contacts');
      return mockContactAPI.delete(id);
    },
    assign: (id: string, agentId: string) => {
      const { mockContactAPI } = require('./contacts');
      return mockContactAPI.assign(id, agentId);
    },
  },
  location: {
    getNearbyAmenities: (coordinates: any, radius?: number) => {
      const { mockLocationServicesAPI } = require('./location-services');
      return mockLocationServicesAPI.getNearbyAmenities(coordinates, radius);
    },
    getLocationInfo: (coordinates: any) => {
      const { mockLocationServicesAPI } = require('./location-services');
      return mockLocationServicesAPI.getLocationInfo(coordinates);
    },
    searchByLocation: (coordinates: any, radius?: number) => {
      const { mockLocationServicesAPI } = require('./location-services');
      return mockLocationServicesAPI.searchByLocation(coordinates, radius);
    },
    getDirections: (origin: any, destination: any) => {
      const { mockLocationServicesAPI } = require('./location-services');
      return mockLocationServicesAPI.getDirections(origin, destination);
    },
  },
  agent: {
    getDashboard: (agentId: string) => {
      const { mockAgentAPI } = require('./agents');
      return mockAgentAPI.getDashboard(agentId);
    },
    getProperties: (agentId: string, filters?: any) => {
      const { mockAgentAPI } = require('./agents');
      return mockAgentAPI.getProperties(agentId, filters);
    },
    getLeads: (agentId: string, filters?: any) => {
      const { mockAgentAPI } = require('./agents');
      return mockAgentAPI.getLeads(agentId, filters);
    },
    getAnalytics: (agentId: string) => {
      const { mockAgentAPI } = require('./agents');
      return mockAgentAPI.getAnalytics(agentId);
    },
    updateLeadStatus: (leadId: string, status: string) => {
      const { mockAgentAPI } = require('./agents');
      return mockAgentAPI.updateLeadStatus(leadId, status);
    },
    getPerformance: (agentId: string) => {
      const { mockAgentAPI } = require('./agents');
      return mockAgentAPI.getPerformance(agentId);
    }
  },
  admin: {
    getDashboard: (filters?: any) => {
      return {
        counts: {
          users: 5,
          agents: 2,
          properties: 5,
          contacts: 6,
          subscriptions: 2,
          revenue: 108
        },
        recent: {
          users: [
            { _id: '1', name: 'Admin User', email: 'admin@urbanrealty.com', role: 'admin', status: 'active', createdAt: '2024-01-01' },
            { _id: '2', name: 'John Agent', email: 'john@urbanrealty.com', role: 'agent', status: 'active', createdAt: '2024-01-02' },
            { _id: '3', name: 'Jane User', email: 'jane@example.com', role: 'user', status: 'active', createdAt: '2024-01-03' }
          ],
          properties: [
            { _id: '1', title: 'Modern Apartment in Downtown', price: 500000, location: 'Downtown, New York', status: 'active', views: 45, agent: { name: 'John Agent' }, images: ['/properties/prop1-1.jpg'] },
            { _id: '2', title: 'Luxury Villa with Pool', price: 1200000, location: 'Beverly Hills, CA', status: 'active', views: 32, agent: { name: 'Sarah Smith' }, images: ['/properties/prop2-1.jpg'] }
          ],
          contacts: [
            { _id: '1', user: { name: 'Jane User', email: 'jane@example.com' }, property: { title: 'Modern Apartment' }, status: 'new', createdAt: '2024-01-15' },
            { _id: '2', user: { name: 'Bob Smith', email: 'bob@example.com' }, property: { title: 'Luxury Villa' }, status: 'contacted', createdAt: '2024-01-14' }
          ]
        }
      };
    },
    getAnalytics: () => {
      return {
        overview: {
          totalUsers: 5,
          totalProperties: 5,
          totalSearches: 1250,
          totalErrors: 12
        },
        trends: {
          userGrowth: { trend: '+15%' },
          errorTrend: { trend: '-5%' }
        },
        recent: {
          errors: [
            { message: 'Database connection timeout', timestamp: new Date().toISOString() },
            { message: 'API rate limit exceeded', timestamp: new Date(Date.now() - 300000).toISOString() }
          ]
        }
      };
    },
    getUsers: (filters?: any) => {
      const { mockUsers } = require('./users');
      return {
        users: Object.values(mockUsers),
        total: 5,
        page: 1,
        limit: 10
      };
    },
    getProperties: (filters?: any) => {
      const { mockProperties } = require('./properties');
      return {
        properties: mockProperties,
        total: 5,
        page: 1,
        limit: 10
      };
    },
    getContacts: (filters?: any) => {
      const { mockContactRequests } = require('./contacts');
      return {
        contacts: mockContactRequests,
        total: 6,
        page: 1,
        limit: 10
      };
    }
  },
};

// Mock data statistics for dashboard
export const mockStats = {
  totalUsers: 5,
  totalProperties: 5,
  totalDevelopers: 3,
  totalContacts: 6,
  activeSubscriptions: 2,
  totalRevenue: 108, // Monthly revenue from active subscriptions
  propertiesByType: {
    apartment: 1,
    house: 1,
    condo: 1,
    townhouse: 1,
    commercial: 1,
  },
  contactsByStatus: {
    new: 3,
    contacted: 1,
    'in-progress': 1,
    resolved: 1,
    closed: 0,
  },
  usersByRole: {
    admin: 1,
    agent: 2,
    user: 2,
  },
};

export default mockAPI;