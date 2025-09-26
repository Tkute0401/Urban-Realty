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
        else{
                return 'http://localhost:3001/api/v1';
        }
        // For development, use localhost
        
}

export function getBrowserAccessToken(): string | null {
        if (typeof window === 'undefined') return null;
        try {
                return window.localStorage.getItem('access_token') || window.localStorage.getItem('token');
        } catch {
                return null;
        }
}

