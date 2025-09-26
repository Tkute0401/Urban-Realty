// Centralized API configuration and SSR-safe helpers

export function getApiBaseUrl(): string {
        // Check if running in browser or server
        const isClient = typeof window !== 'undefined';
        
        // Get API URL from environment variables
        const nextPublicApiUrl = process.env.NEXT_PUBLIC_API_URL;
        const nodeEnv = process.env.NODE_ENV;
        
        // For production on Railway, use the environment variable
        if (nodeEnv === 'production' && nextPublicApiUrl) {
                return nextPublicApiUrl;
        }
        
        // For server-side in production without NEXT_PUBLIC_API_URL, use internal Railway URL
        if (!isClient && nodeEnv === 'production') {
                return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
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

// Cache configuration for different data types - optimized for speed and SEO
export const cacheConfig = {
        properties: {
                staleTime: 3 * 60 * 1000,  // 3 minutes - faster updates for property listings
                gcTime: 15 * 60 * 1000,    // 15 minutes
                refetchOnWindowFocus: false,
                refetchOnMount: false,
        },
        property: {
                staleTime: 5 * 60 * 1000,  // 5 minutes - individual property details
                gcTime: 30 * 60 * 1000,    // 30 minutes
                refetchOnWindowFocus: false,
                refetchOnMount: false,
        },
        developers: {
                staleTime: 10 * 60 * 1000, // 10 minutes - developer data changes less frequently
                gcTime: 60 * 60 * 1000,    // 1 hour
                refetchOnWindowFocus: false,
                refetchOnMount: false,
        },
        user: {
                staleTime: 1 * 60 * 1000,  // 1 minute - user data needs fresher updates
                gcTime: 5 * 60 * 1000,     // 5 minutes
                refetchOnWindowFocus: false,
                refetchOnMount: true,
        },
        static: {
                staleTime: 60 * 60 * 1000, // 1 hour - for static content like categories
                gcTime: 24 * 60 * 60 * 1000, // 24 hours
                refetchOnWindowFocus: false,
                refetchOnMount: false,
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

// Performance monitoring for API calls
export const withPerformanceMonitoring = async <T>(
        operation: () => Promise<T>,
        operationName: string
): Promise<T> => {
        const start = performance.now()
        
        try {
                const result = await operation()
                const duration = performance.now() - start
                
                if (duration > 1000) {
                        console.warn(`Slow API operation: ${operationName} took ${duration.toFixed(2)}ms`)
                }
                
                return result
        } catch (error) {
                const duration = performance.now() - start
                console.error(`Failed API operation: ${operationName} failed after ${duration.toFixed(2)}ms`, error)
                throw error
        }
}

