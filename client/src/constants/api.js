// API constants for the client
// Centralizes endpoint paths and query keys

export const API_BASE_URL = 'https://urban-realty-production.up.railway.app/api/v1';

export const API_ENDPOINTS = {
	// Auth
	login: '/auth/login',
	register: '/auth/register',
	profile: '/auth/me',

	// Properties
	properties: '/properties',
	propertyById: (id) => `/properties/${id}`,
	propertyImages: (id) => `/properties/${id}/images`,

	// Users
	users: '/users',
	userById: (id) => `/users/${id}`,

	// Subscriptions
	subscriptions: '/subscriptions',
	subscriptionById: (id) => `/subscriptions/${id}`,
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

