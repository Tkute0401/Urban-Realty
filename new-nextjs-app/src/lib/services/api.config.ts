// Central API configuration
// Source of truth for API base URL and misc config, SSR-safe

export type ApiEnvironmentConfig = {
  BASE_URL: string;
  REQUEST_TIMEOUT_MS: number;
};

const DEFAULT_BASE_URL = 'https://urban-realty-production.up.railway.app/api/v1';

export const API_CONFIG: ApiEnvironmentConfig = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || DEFAULT_BASE_URL,
  REQUEST_TIMEOUT_MS: 30000,
};

export const isServer = typeof window === 'undefined';

export function getAuthToken(): string | null {
  if (isServer) return null;
  try {
    return localStorage.getItem('token');
  } catch {
    return null;
  }
}

