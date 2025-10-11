/**
 * API Configuration for Railway Deployment
 * Handles Railway-specific environment detection and URL resolution
 */

// Railway environment detection
export const isRailwayBuild = () => {
  return process.env.RAILWAY_ENVIRONMENT || 
         process.env.RAILWAY_PROJECT_ID || 
         false;
};

export const isProductionBuild = () => {
  return process.env.NODE_ENV === 'production';
};

// Get API base URL with Railway optimization
export const getApiBaseUrl = (): string => {
  // Check if we're in unified mode (no separate backend URL)
  const explicitApiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL || process.env.API_URL;
  
  if (!explicitApiUrl) {
    // Check if we're in the browser (client-side)
    if (typeof window !== 'undefined') {
      // Client-side: check if we're on localhost
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return 'http://localhost:3001';
      }
      // Production client-side: use production backend
      return 'https://www.squarefooot.com';
    }
    
    // Server-side: check NODE_ENV
    if (process.env.NODE_ENV === 'development') {
      return 'http://localhost:3001';
    }
    // Production server-side: use production backend
    return 'https://www.squarefooot.com';
  }
  
  // Separate backend mode - use the explicit URL
  return explicitApiUrl;
};

// Add cache-busting parameter for development
export const addCacheBuster = (url: string): string => {
  if (process.env.NODE_ENV === 'development') {
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}v=${Date.now()}`;
  }
  return url;
};

// Enhanced fetch configuration for Railway
export const getFetchConfig = (options: RequestInit = {}): RequestInit => {
  const isRailway = isRailwayBuild();
  const baseConfig: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers,
    },
    // Shorter timeout for Railway builds
    signal: options.signal || AbortSignal.timeout(isRailway ? 5000 : 10000),
    ...options,
  };

  // Add Railway-specific optimizations
  if (isRailway) {
    baseConfig.cache = 'no-store';
    baseConfig.next = { revalidate: 0 };
  }

  return baseConfig;
};

// Railway-safe API call wrapper
export const railwaySafeApiCall = async <T>(
  url: string, 
  options: RequestInit = {}
): Promise<T | null> => {
  try {
    const baseUrl = getApiBaseUrl();
    const fullUrl = baseUrl ? `${baseUrl}${url}` : url;
    const response = await fetch(fullUrl, getFetchConfig(options));
    
    if (!response.ok) {
      console.warn(`API call failed: ${response.status} ${response.statusText}`);
      return null;
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    if (isRailwayBuild()) {
      console.warn(`Railway build - skipping API call to ${url}:`, error.message);
      return null;
    }
    console.error(`API call failed for ${url}:`, error);
    return null;
  }
};

// Mock browser access token for compatibility
export const getBrowserAccessToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('accessToken') || '';
  }
  return '';
};

export default {
  getApiBaseUrl,
  getFetchConfig,
  railwaySafeApiCall,
  isRailwayBuild,
  isProductionBuild,
  getBrowserAccessToken
};