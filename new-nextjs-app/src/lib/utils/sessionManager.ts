// Session Management Utility for Next.js
// Handles both localStorage (client-side) and cookies (SSR-compatible)

export class SessionManager {
  private static instance: SessionManager;
  private isClient: boolean;

  private constructor() {
    this.isClient = typeof window !== 'undefined';
  }

  public static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager();
    }
    return SessionManager.instance;
  }

  // Set token in both localStorage and cookies
  setToken(token: string): void {
    if (this.isClient) {
      localStorage.setItem('token', token);
    }
    // Set cookie for SSR compatibility
    this.setCookie('token', token, 7); // 7 days expiry
  }

  // Get token from localStorage (client-side) or cookies (SSR)
  getToken(): string | null {
    if (this.isClient) {
      // Check localStorage first
      const localToken = localStorage.getItem('token');
      if (localToken) {
        return localToken;
      }
      // Fallback to cookies if localStorage doesn't have it
      return this.getCookie('token');
    }
    return this.getCookie('token');
  }

  // Remove token from both localStorage and cookies
  removeToken(): void {
    if (this.isClient) {
      localStorage.removeItem('token');
    }
    this.deleteCookie('token');
  }

  // Set user data in localStorage and mirror minimal fields to cookies for middleware
  setUser(user: any): void {
    if (this.isClient) {
      localStorage.setItem('user', JSON.stringify(user));
      // Also set lightweight cookies so Next.js middleware can read role/id
      try {
        if (user?.role) this.setCookie('role', String(user.role), 7);
        if (user?.id || user?._id) this.setCookie('uid', String(user.id || user._id), 7);
      } catch {
        // ignore cookie errors in non-browser environments
      }
    }
  }

  // Get user data from localStorage
  getUser(): any | null {
    if (this.isClient) {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    }
    return null;
  }

  // Remove user data from localStorage
  removeUser(): void {
    if (this.isClient) {
      localStorage.removeItem('user');
    }
  }

  // Clear all session data
  clearSession(): void {
    this.removeToken();
    this.removeUser();
    // Clean mirrored cookies for middleware
    this.deleteCookie('role');
    this.deleteCookie('uid');
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Cookie utilities
  private setCookie(name: string, value: string, days: number): void {
    if (this.isClient) {
      const expires = new Date();
      expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
      document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
    }
  }

  private getCookie(name: string): string | null {
    if (this.isClient) {
      const nameEQ = name + '=';
      const ca = document.cookie.split(';');
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
      }
    }
    return null;
  }

  private deleteCookie(name: string): void {
    if (this.isClient) {
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
    }
  }

  // Theme management
  setTheme(theme: 'light' | 'dark'): void {
    if (this.isClient) {
      localStorage.setItem('theme', theme);
      document.documentElement.setAttribute('data-theme', theme);
    }
  }

  getTheme(): 'light' | 'dark' {
    if (this.isClient) {
      const theme = localStorage.getItem('theme') as 'light' | 'dark';
      return theme || 'light';
    }
    return 'light';
  }

  // User preferences
  setUserPreferences(preferences: any): void {
    if (this.isClient) {
      localStorage.setItem('userPreferences', JSON.stringify(preferences));
    }
  }

  getUserPreferences(): any | null {
    if (this.isClient) {
      const prefsStr = localStorage.getItem('userPreferences');
      return prefsStr ? JSON.parse(prefsStr) : null;
    }
    return null;
  }
}

// Export singleton instance
export const sessionManager = SessionManager.getInstance();

// Export for use in components
export default sessionManager;