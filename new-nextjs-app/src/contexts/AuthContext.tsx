import { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import { sessionManager } from '@/lib/utils/sessionManager';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/services/api';

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: string;
  mobile?: string;
  reraId?: string;
  favorites?: any;
  occupation?: string;
  recentlyViewed?: any;
  subscriptionStatus?: string;
  createdAt?: string | Date;
  professionalInfo?: {
    licenseNumber?: string;
    yearsOfExperience?: number | string;
    businessName?: string;
    businessAddress?: string;
    specializations?: string[];
    certifications?: string[];
  };
};

export type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (credentials: { email: string; password: string }) => Promise<{ success: boolean; error?: string }>;
  register: (payload: { name: string; email: string; password: string; mobile?: string; favorites?: any; occupation?: string; recentlyViewed?: any }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  clearError: () => void;
  updateUser: (updatedUser: Partial<AuthUser>) => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  // All useState hooks declared first - NEVER conditional
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // useRouter hook - always called
  const router = useRouter();

  // Load user profile on mount - NO React Query, just simple useEffect
  useEffect(() => {
    let isMounted = true;
    
    const loadProfile = async () => {
      const token = sessionManager.getToken();
      
      if (!token) {
        if (isMounted) {
          setUser(null);
          setLoading(false);
        }
        return;
      }
      
      try {
        const response = await api.auth.profile();
        
        if (!isMounted) return;
        
        if (response.success && response.data) {
          const data = response.data;
          let userData;
          
          // Handle different response structures
          if (data.user && typeof data.user === 'object') {
            userData = data.user;
          } else if (data.email || data.id || data._id) {
            userData = data;
          } else {
            throw new Error('Invalid profile response structure');
          }
          
          const userInfo: AuthUser = {
            email: userData.email,
            id: userData.id || userData._id,
            name: userData.name,
            role: userData.role || 'user',
            mobile: userData.mobile,
            reraId: userData.reraId,
            favorites: userData.favorites,
            occupation: userData.occupation,
            recentlyViewed: userData.recentlyViewed,
            subscriptionStatus: userData.subscriptionStatus,
            createdAt: userData.createdAt,
            professionalInfo: userData.professionalInfo,
          };
          
          setUser(userInfo);
          sessionManager.setUser(userInfo as any);
        } else {
          // Invalid response, clear session
          sessionManager.clearSession();
          setUser(null);
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
        // On error, clear session
        sessionManager.clearSession();
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    loadProfile();
    
    return () => {
      isMounted = false;
    };
  }, []);

  // Login function - NO React Query mutation
  const login = useCallback(async (credentials: { email: string; password: string }) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.auth.login(credentials);
      
      if (!response.success) {
        throw new Error(response.message || 'Login failed');
      }
      
      const data = response.data;
      let token: string | undefined;
      let userData: any;
      
      // Handle different response structures
      if (typeof data === 'object' && data !== null) {
        if (data.token) {
          token = data.token;
          userData = data.user || data;
        } else if (data.data?.token) {
          token = data.data.token;
          userData = data.data.user || data.data;
        }
      }
      
      if (!token) {
        throw new Error('Authentication token missing');
      }
      
      const userInfo: AuthUser = {
        email: userData.email,
        id: userData.id || userData._id,
        name: userData.name,
        role: userData.role || 'user',
        mobile: userData.mobile,
        reraId: userData.reraId,
        favorites: userData.favorites,
        occupation: userData.occupation,
        recentlyViewed: userData.recentlyViewed,
        subscriptionStatus: userData.subscriptionStatus,
      };
      
      sessionManager.setToken(token);
      sessionManager.setUser(userInfo as any);
      setUser(userInfo);
      
      const redirectPath = userInfo.role === 'admin' ? '/admin' : '/';
      router.push(redirectPath);
      
      return { success: true };
    } catch (err: any) {
      const message = err?.message || 'Login failed. Please try again.';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, [router]);

  // Register function - NO React Query mutation
  const register = useCallback(async (payload: { 
    name: string; 
    email: string; 
    password: string; 
    mobile?: string; 
    favorites?: any; 
    occupation?: string; 
    recentlyViewed?: any 
  }) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.auth.register(payload);
      
      if (!response.success) {
        throw new Error(response.message || 'Registration failed');
      }
      
      const data = response.data;
      let token: string | undefined;
      let userData: any;
      
      // Handle different response structures
      if (typeof data === 'object' && data !== null) {
        if (data.token) {
          token = data.token;
          userData = data.user || data;
        } else if (data.data?.token) {
          token = data.data.token;
          userData = data.data.user || data.data;
        }
      }
      
      if (!token) {
        throw new Error('Authentication token missing');
      }
      
      const userInfo: AuthUser = {
        email: userData.email,
        id: userData.id || userData._id,
        name: userData.name,
        role: userData.role || 'user',
        mobile: payload.mobile,
        favorites: payload.favorites,
        occupation: payload.occupation,
        recentlyViewed: payload.recentlyViewed,
      };
      
      sessionManager.setToken(token);
      sessionManager.setUser(userInfo as any);
      setUser(userInfo);
      
      router.push('/');
      
      return { success: true };
    } catch (err: any) {
      const message = err?.message || 'Registration failed';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, [router]);

  // Logout function
  const logout = useCallback(() => {
    sessionManager.clearSession();
    setUser(null);
    setError(null);
    router.push('/login');
  }, [router]);

  // Clear error function
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Update user function
  const updateUser = useCallback((updatedUser: Partial<AuthUser>) => {
    setUser(prev => prev ? { ...prev, ...updatedUser } : null);
  }, []);

  // Memoized isAuthenticated
  const isAuthenticated = useMemo(() => !!user && !!sessionManager.getToken(), [user]);

  // Memoized context value to prevent unnecessary re-renders
  const value: AuthContextValue = useMemo(() => ({
    user,
    loading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
    clearError,
    updateUser,
  }), [user, loading, error, isAuthenticated, login, register, logout, clearError, updateUser]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
