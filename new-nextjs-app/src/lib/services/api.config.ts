// Centralized API configuration and SSR-safe helpers

export function getApiBaseUrl(): string {
        // const envUrl = typeof window !== 'undefined'
        //         ? (process.env.NEXT_PUBLIC_API_URL as string | undefined)
        //         : (process.env.API_URL as string | undefined);
        // console.log('🔧 API Base URL:', envUrl || '/api', '(from env:', envUrl, ')');
        const envUrl = 'https://urban-realty-production.up.railway.app/api/v1' || process.env.NEXT_PUBLIC_API_URL;
		return envUrl || '/api';
}

export function getBrowserAccessToken(): string | null {
        if (typeof window === 'undefined') return null;
        try {
                return window.localStorage.getItem('access_token') || window.localStorage.getItem('token');
        } catch {
                return null;
        }
}

