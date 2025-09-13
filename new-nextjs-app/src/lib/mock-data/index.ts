// Mock Data Index - Centralized export for all mock data
export * from './users';
export * from './properties';
export * from './developers';
export * from './subscriptions';
export * from './contacts';

// Re-export all mock data and APIs
export { mockUsers, mockAuthResponses } from './users';
export { mockProperties, mockPropertyAPI } from './properties';
export { mockDevelopers, mockDeveloperAPI } from './developers';
export { mockSubscriptionPlans, mockUserSubscriptions, mockSubscriptionAPI } from './subscriptions';
export { mockContactRequests, mockContactAPI } from './contacts';

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