// Centralized API configuration and SSR-safe helpers

export function getApiBaseUrl(): string {
        // Use the Next.js API proxy to avoid CORS issues
        return process.env.NEXT_PUBLIC_API_URL || 'https://urban-realty-production.up.railway.app/api/v1';
}

export function getBrowserAccessToken(): string | null {
        if (typeof window === 'undefined') return null;
        try {
                return window.localStorage.getItem('access_token') || window.localStorage.getItem('token');
        } catch {
                return null;
        }
}

