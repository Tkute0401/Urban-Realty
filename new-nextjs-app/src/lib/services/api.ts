import { httpDelete, httpGet, httpPost, httpPostForm, httpPut } from './http';
import type { NormalizedApiResponse } from './api.types';

export const api = {
  // Auth
  login: (email: string, password: string) => httpPost<{ token: string; user: { id: string; email: string; name: string } }>(`/auth/login`, { email, password }),
  register: (userData: Record<string, unknown>) => httpPost<{ token: string; user: { id: string; email: string; name: string } }>(`/auth/register`, userData),
  me: () => httpGet(`/auth/me`),
  updateUser: (updates: Record<string, unknown>) => httpPut(`/auth/update`, updates),

  // Properties
  getProperties: (filters?: Record<string, unknown>) => httpGet(`/properties`, filters),
  getProperty: (id: string) => httpGet(`/properties/${id}`),
  getFeaturedProperties: () => httpGet(`/properties/featured`),
  createProperty: (data: Record<string, any>) => {
    if (data.images && Array.isArray(data.images) && data.images.length > 0) {
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        if (key !== 'images') {
          formData.append(key, data[key]);
        }
      });
      data.images.forEach((file: File) => formData.append('images', file));
      return httpPostForm(`/properties`, formData);
    }
    return httpPost(`/properties`, data);
  },
  updateProperty: (id: string, updates: Record<string, any>) => {
    if (updates.images && Array.isArray(updates.images) && updates.images.length > 0) {
      const formData = new FormData();
      Object.keys(updates).forEach((key) => {
        if (key !== 'images') {
          formData.append(key, updates[key]);
        }
      });
      updates.images.forEach((file: File) => formData.append('images', file));
      return httpPut(`/properties/${id}`, formData);
    }
    return httpPut(`/properties/${id}`, updates);
  },
  deleteProperty: (id: string) => httpDelete(`/properties/${id}`),

  // Favorites & Recently viewed
  getFavorites: () => httpGet(`/auth/favorites`),
  addFavorite: (propertyId: string) => httpPut(`/auth/favorites/${propertyId}`, {}),
  removeFavorite: (propertyId: string) => httpDelete(`/auth/favorites/${propertyId}`),
  getFavoriteStatus: (propertyId: string) => httpGet<{ favorited: boolean }>(`/auth/favorites/${propertyId}/status`),
  getRecentlyViewed: () => httpGet(`/auth/recently-viewed`),
  addRecentlyViewed: (propertyId: string) => httpPost(`/auth/recently-viewed/${propertyId}`),

  // Contacts
  getContacts: (filters?: Record<string, unknown>) => httpGet(`/contacts`, filters),
  getContact: (id: string) => httpGet(`/contacts/${id}`),
  createContact: (payload: Record<string, unknown>) => httpPost(`/contacts`, payload),
  updateContact: (id: string, updates: Record<string, unknown>) => httpPut(`/contacts/${id}`, updates),
  deleteContact: (id: string) => httpDelete(`/contacts/${id}`),

  // Subscriptions
  getSubscriptionPlans: () => httpGet(`/subscriptions/plans`),
  getUserSubscription: (userId: string) => httpGet(`/subscriptions/user/${userId}`),
  subscribe: (userId: string, planId: string, paymentMethod: string) => httpPost(`/subscriptions/subscribe`, { userId, planId, paymentMethod }),
  cancelSubscription: (userId: string) => httpDelete(`/subscriptions/user/${userId}`),
  updateSubscription: (userId: string, planId: string) => httpPut(`/subscriptions/user/${userId}`, { planId }),

  // Admin
  getAdminDashboard: () => httpGet(`/admin/dashboard`),
  getAdminUsers: (filters?: Record<string, unknown>) => httpGet(`/admin/users`, filters),
  getAdminProperties: (filters?: Record<string, unknown>) => httpGet(`/admin/properties`, filters),
  getAdminContacts: (filters?: Record<string, unknown>) => httpGet(`/admin/contacts`, filters),
  getAdminAnalytics: () => httpGet(`/admin/analytics`),

  // Agent
  getAgentDashboard: (agentId: string) => httpGet(`/agent/${agentId}/dashboard`),
  getAgentProperties: (agentId: string, filters?: Record<string, unknown>) => httpGet(`/properties/agent/${agentId}`, filters),
  getAgentLeads: (agentId: string, filters?: Record<string, unknown>) => httpGet(`/agent/${agentId}/leads`, filters),
  getAgentAnalytics: (agentId: string) => httpGet(`/agent/${agentId}/analytics`),
};

export type { NormalizedApiResponse };

