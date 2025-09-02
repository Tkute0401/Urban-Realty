// API constants for the client
// Centralizes endpoint paths and query keys
// Import shared constants and extend with client-specific ones

import { API_CONFIG, API_ENDPOINTS as SHARED_ENDPOINTS } from '../../../shared/constants/index.js';

export const API_BASE_URL = API_CONFIG.BASE_URL;

// Client-specific API endpoints (extending shared endpoints)
export const API_ENDPOINTS = {
	...SHARED_ENDPOINTS,
	
	// Client-specific endpoints
	properties: SHARED_ENDPOINTS.PROPERTIES.LIST,
	propertyById: SHARED_ENDPOINTS.PROPERTIES.BY_ID,
	propertyImages: SHARED_ENDPOINTS.PROPERTIES.IMAGES,
	
	users: SHARED_ENDPOINTS.USERS.LIST,
	userById: SHARED_ENDPOINTS.USERS.BY_ID,
	
	subscriptions: SHARED_ENDPOINTS.SUBSCRIPTIONS.LIST,
	subscriptionById: SHARED_ENDPOINTS.SUBSCRIPTIONS.BY_ID,
};

export const QUERY_KEYS = {
	// Auth
	profile: ['auth', 'profile'],

	// Properties
	properties: (params) => ['properties', params],
	property: (id) => ['property', id],

	// Users
	users: (params) => ['users', params],
	user: (id) => ['user', id],

	// Subscriptions
	subscriptions: (params) => ['subscriptions', params],
	subscription: (id) => ['subscription', id],
};

