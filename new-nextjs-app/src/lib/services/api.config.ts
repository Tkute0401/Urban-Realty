// Centralized API configuration and SSR-safe helpers for Squarefooot

export function getApiBaseUrl(): string {
        // Check if running in browser or server
        const isClient = typeof window !== 'undefined';
        
        // Get API URL from environment variables
        const nextPublicApiUrl = process.env.NEXT_PUBLIC_API_URL;
        const nodeEnv = process.env.NODE_ENV;
        const isRailwayBuild = process.env.RAILWAY_ENVIRONMENT || process.env.RAILWAY_PROJECT_ID;
        
        // For production on Railway, optimize for SSR and deployment
        if (nodeEnv === 'production') {
                // Client-side requests should always use the public API URL
                if (isClient && nextPublicApiUrl) {
                        return nextPublicApiUrl;
                }
                
                // Server-side rendering optimizations
                if (!isClient) {
                        // During Railway build process, API might not be available
                        // Use a fallback that won't cause connection errors
                        if (isRailwayBuild && !nextPublicApiUrl) {
                                console.warn('Railway build detected: using fallback API URL for build process');
                                return 'https://urban-realty-production.up.railway.app/api/v1';
                        }
                        
                        // Railway internal container communication (faster than external)
                        return process.env.RAILWAY_PRIVATE_DOMAIN 
                                ? `http://${process.env.RAILWAY_PRIVATE_DOMAIN}:5000/api/v1`
                                : nextPublicApiUrl || 'https://urban-realty-production.up.railway.app/api/v1';
                }
                
                // Fallback to public URL
                return nextPublicApiUrl || 'https://urban-realty-production.up.railway.app/api/v1';
        }
        
        // For development, use localhost with correct port
        return nextPublicApiUrl || 'http://localhost:5000/api/v1';
}

export function getBrowserAccessToken(): string | null {
        if (typeof window === 'undefined') return null;
        try {
                return window.localStorage.getItem('access_token') || window.localStorage.getItem('token');
        } catch {
                return null;
        }
}

// Cache configuration for different data types - optimized for speed, SEO, and SSR
export const cacheConfig = {
        properties: {
                staleTime: 2 * 60 * 1000,  // 2 minutes - faster updates for property listings
                gcTime: 10 * 60 * 1000,    // 10 minutes
                refetchOnWindowFocus: false,
                refetchOnMount: false,
                retry: 2,
                retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
        },
        property: {
                staleTime: 5 * 60 * 1000,  // 5 minutes - individual property details
                gcTime: 30 * 60 * 1000,    // 30 minutes
                refetchOnWindowFocus: false,
                refetchOnMount: false,
                retry: 3,
                retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
        },
        developers: {
                staleTime: 15 * 60 * 1000, // 15 minutes - developer data changes less frequently
                gcTime: 2 * 60 * 60 * 1000, // 2 hours
                refetchOnWindowFocus: false,
                refetchOnMount: false,
                retry: 2,
                retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
        },
        user: {
                staleTime: 30 * 1000,      // 30 seconds - user data needs fresher updates
                gcTime: 2 * 60 * 1000,     // 2 minutes
                refetchOnWindowFocus: false,
                refetchOnMount: true,
                retry: 3,
                retryDelay: attemptIndex => Math.min(500 * 2 ** attemptIndex, 10000),
        },
        static: {
                staleTime: 2 * 60 * 60 * 1000, // 2 hours - for static content like categories
                gcTime: 24 * 60 * 60 * 1000,   // 24 hours
                refetchOnWindowFocus: false,
                refetchOnMount: false,
                retry: 1,
                retryDelay: 5000,
        },
        search: {
                staleTime: 90 * 1000,      // 90 seconds - search results should be fresh
                gcTime: 5 * 60 * 1000,     // 5 minutes
                refetchOnWindowFocus: false,
                refetchOnMount: false,
                retry: 2,
                retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 15000),
        },
} as const

// Request optimization headers for better performance
export const getOptimizedHeaders = (cacheStrategy: 'no-cache' | 'stale-while-revalidate' | 'cache-first' = 'no-cache') => {
        const baseHeaders = {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Accept-Encoding': 'gzip, deflate, br',
                'Connection': 'keep-alive',
        };
        
        switch (cacheStrategy) {
                case 'cache-first':
                        return {
                                ...baseHeaders,
                                'Cache-Control': 'public, max-age=300, stale-while-revalidate=600',
                        };
                case 'stale-while-revalidate':
                        return {
                                ...baseHeaders,
                                'Cache-Control': 'public, max-age=60, stale-while-revalidate=300',
                        };
                default:
                        return {
                                ...baseHeaders,
                                'Cache-Control': 'no-cache, no-store, must-revalidate',
                                'Pragma': 'no-cache',
                                'Expires': '0',
                        };
        }
}

// Performance monitoring for API calls - optimized for production
export const withPerformanceMonitoring = async <T>(
        operation: () => Promise<T>,
        operationName: string,
        options: { warnThreshold?: number; errorThreshold?: number } = {}
): Promise<T> => {
        const { warnThreshold = 1000, errorThreshold = 5000 } = options;
        const start = performance.now()
        const isProduction = process.env.NODE_ENV === 'production';
        
        try {
                const result = await operation()
                const duration = performance.now() - start
                
                // Only log performance in development or for critical thresholds in production
                if (!isProduction || duration > errorThreshold) {
                        if (duration > errorThreshold) {
                                console.error(`Critical slow API operation: ${operationName} took ${duration.toFixed(2)}ms`)
                        } else if (duration > warnThreshold && !isProduction) {
                                console.warn(`Slow API operation: ${operationName} took ${duration.toFixed(2)}ms`)
                        }
                }
                
                // Track performance metrics for monitoring (only in production)
                if (isProduction && typeof window !== 'undefined' && 'gtag' in window) {
                        (window as any).gtag('event', 'api_performance', {
                                event_category: 'performance',
                                event_label: operationName,
                                value: Math.round(duration),
                                custom_map: {
                                        api_duration: Math.round(duration),
                                        api_operation: operationName,
                                }
                        });
                }
                
                return result
        } catch (error) {
                const duration = performance.now() - start
                
                // Always log errors
                console.error(`Failed API operation: ${operationName} failed after ${duration.toFixed(2)}ms`, error)
                
                // Track API errors for monitoring
                if (isProduction && typeof window !== 'undefined' && 'gtag' in window) {
                        (window as any).gtag('event', 'api_error', {
                                event_category: 'error',
                                event_label: operationName,
                                value: Math.round(duration),
                        });
                }
                
                throw error
        }
}

// SSR-safe performance utilities
export const measureSSRPerformance = (operationName: string) => {
        const start = performance.now();
        
        return {
                end: () => {
                        const duration = performance.now() - start;
                        if (duration > 500) { // SSR operations should be fast
                                console.warn(`Slow SSR operation: ${operationName} took ${duration.toFixed(2)}ms`);
                        }
                        return duration;
                }
        };
};

