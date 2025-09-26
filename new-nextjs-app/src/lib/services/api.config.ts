// Centralized API configuration and SSR-safe helpers

export function getApiBaseUrl(): string {
        // Check if running in browser or server
        const isClient = typeof window !== 'undefined';
        
        // Get API URL from environment variables
        const nextPublicApiUrl = process.env.NEXT_PUBLIC_API_URL;
        
        // For production on Railway, use the environment variable
        if (nextPublicApiUrl) {
                return nextPublicApiUrl;
        }
        
        // For development, use localhost with correct port
        return 'http://localhost:5000/api/v1';
}

export function getBrowserAccessToken(): string | null {
        if (typeof window === 'undefined') return null;
        try {
                return window.localStorage.getItem('access_token') || window.localStorage.getItem('token');
        } catch {
                return null;
        }
}

// Cache configuration for different data types
export const cacheConfig = {
        properties: {
                staleTime: 5 * 60 * 1000, // 5 minutes
                gcTime: 10 * 60 * 1000,   // 10 minutes
        },
        property: {
                staleTime: 10 * 60 * 1000, // 10 minutes
                gcTime: 30 * 60 * 1000,    // 30 minutes
        },
        developers: {
                staleTime: 15 * 60 * 1000, // 15 minutes
                gcTime: 60 * 60 * 1000,    // 1 hour
        },
        user: {
                staleTime: 2 * 60 * 1000,  // 2 minutes
                gcTime: 5 * 60 * 1000,     // 5 minutes
        },
} as const

// Request optimization headers
export const getOptimizedHeaders = () => ({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Accept-Encoding': 'gzip, deflate, br',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
})

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

