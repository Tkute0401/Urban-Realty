// Centralized API configuration and SSR-safe helpers

export function getApiBaseUrl(): string {
        // For development, always prefer Next.js API routes for mock data
        
        // Use Railway URL for production
        return 'http://localhost:3001/api/v1';
}

export function getBrowserAccessToken(): string | null {
        if (typeof window === 'undefined') return null;
        try {
                return window.localStorage.getItem('access_token') || window.localStorage.getItem('token');
        } catch {
                return null;
        }
}

