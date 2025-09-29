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
  // During Railway build, skip API calls
  if (isRailwayBuild() && isProductionBuild() && typeof window === 'undefined') {
    console.log('Railway build detected - using fallback API URL');
    return process.env.NEXT_PUBLIC_API_URL || 'https://urban-realty-production.up.railway.app/api/v1';
  }

  // Client-side runtime - use Next.js API proxy
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_API_URL || '/api/v1';
  }

  // Server-side runtime - use direct Railway URL
  return process.env.NEXT_PUBLIC_API_URL || 
         process.env.API_URL || 
         'https://urban-realty-production.up.railway.app/api/v1';
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
    const response = await fetch(`${baseUrl}${url}`, getFetchConfig(options));
    
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