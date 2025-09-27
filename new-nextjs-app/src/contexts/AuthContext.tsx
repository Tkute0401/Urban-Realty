import { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import { sessionManager } from '@/lib/utils/sessionManager';
import { useRouter } from 'next/navigation';
import { useLoginMutation, useProfileQuery, useRegisterMutation } from '@/hooks/api/auth';


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
  if (process.env.NODE_ENV === 'development') {
    console.log('🔧 AuthProvider rendering...');
  }
  
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const profileQuery = useProfileQuery(Boolean(sessionManager.getToken()));
  const loginMutation = useLoginMutation();
  const registerMutation = useRegisterMutation();
  
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔧 AuthProvider mounted on client side!');
    }
    return () => {
      if (process.env.NODE_ENV === 'development') {
        console.log('🔧 AuthProvider unmounted');
      }
    };
  }, []);

  const loadUser = useCallback(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔧 AuthContext - loadUser called');
    }
    const token = sessionManager.getToken();
    if (!token) {
      if (process.env.NODE_ENV === 'development') {
        console.log('🔧 AuthContext - No token found, skipping profile load');
      }
      setLoading(false);
      return;
    }
    
    if (process.env.NODE_ENV === 'development') {
      console.log('🔧 AuthContext - Token found, checking profile data');
    }
    if (profileQuery.data) {
      if (process.env.NODE_ENV === 'development') {
        console.log('🔧 AuthContext - Profile data loaded successfully');
      }
      const data = profileQuery.data as any;
      
      if (process.env.NODE_ENV === 'development') {
        console.log('🔧 AuthContext - Raw profile data:', JSON.stringify(data, null, 2));
      }
      
      // Handle different possible response structures with detailed logging
      let userData;
      try {
        if (data && typeof data === 'object') {
          // Try different possible structures - check for various response patterns
          if (data.hasOwnProperty('user') && data.user && typeof data.user === 'object') {
            userData = data.user;
            if (process.env.NODE_ENV === 'development') {
              console.log('🔧 AuthContext - Using data.user structure');
            }
          } else if (data.hasOwnProperty('data') && data.data && typeof data.data === 'object' && (data.data.email || data.data.id || data.data._id)) {
            // API might return wrapped in data.data structure
            userData = data.data;
            if (process.env.NODE_ENV === 'development') {
              console.log('🔧 AuthContext - Using data.data structure');
            }
          } else if (data.email || data.id || data._id) {
            userData = data;
            if (process.env.NODE_ENV === 'development') {
              console.log('🔧 AuthContext - Using direct data structure');
            }
          } else {
            // Log all possible keys to help debug
            if (process.env.NODE_ENV === 'development') {
              console.log('🔧 AuthContext - Available data keys:', Object.keys(data));
            }
            throw new Error(`Unrecognized data structure: ${JSON.stringify(data)}`);
          }
        } else {
          throw new Error(`Invalid data type: ${typeof data}`);
        }
        
        if (!userData || (!userData.email && !userData.id && !userData._id)) {
          throw new Error(`Invalid user data: ${JSON.stringify(userData)}`);
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('🔧 AuthContext - Error processing profile data:', error);
          console.error('🔧 AuthContext - Raw data was:', data);
        }
        sessionManager.clearSession();
        setError('Invalid user data received');
        setLoading(false);
        return;
      }
      
      const userInfo: AuthUser = {
        email: userData.email,
        id: userData._id || userData.id,
        name: userData.name,
        role: userData.role,
        mobile: userData.mobile,
        reraId: userData.reraId,
        favorites: userData?.favorites,
        occupation: userData?.occupation,
        recentlyViewed: userData?.recentlyViewed,
        subscriptionStatus: userData?.subscriptionStatus,
      };
      if (process.env.NODE_ENV === 'development') {
        console.log('🔧 AuthContext - Setting user:', { 
          id: userInfo.id,
          name: userInfo.name,
          role: userInfo.role
        });
      }
      setUser(userInfo);
      sessionManager.setUser(userInfo as any);
      setLoading(false);
    } else if (profileQuery.isError) {
      if (process.env.NODE_ENV === 'development') {
        console.error('🔧 AuthContext - Error loading profile:', profileQuery.error);
      }
      sessionManager.clearSession();
      setError((profileQuery.error as any)?.message || 'Failed to load user');
      setLoading(false);
    } else {
      if (process.env.NODE_ENV === 'development') {
        console.log('🔧 AuthContext - Profile query is still loading');
      }
    }
  }, [profileQuery.data, profileQuery.isError, profileQuery.error]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = useCallback(async (credentials: { email: string; password: string }) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔧 AuthContext - Login attempt with email:', credentials.email);
    }
    setLoading(true);
    setError(null);
    try {
      if (process.env.NODE_ENV === 'development') {
        console.log('🔧 AuthContext - Calling login mutation');
      }
      const data = await loginMutation.mutateAsync(credentials) as any;
      if (process.env.NODE_ENV === 'development') {
        console.log('🔧 AuthContext - Login successful, processing response');
        console.log('🔧 AuthContext - Raw login data:', JSON.stringify(data, null, 2));
      }
      
      // Handle different possible login response structures
      let token, userData;
      try {
        if (data && typeof data === 'object') {
          // Extract token
          token = data.token || data.accessToken;
          
          // Extract user data - try different possible structures
          if (data.hasOwnProperty('user') && data.user && typeof data.user === 'object') {
            userData = data.user;
            if (process.env.NODE_ENV === 'development') {
              console.log('🔧 AuthContext - Using data.user structure for login');
            }
          } else if (data.hasOwnProperty('data') && data.data && typeof data.data === 'object' && (data.data.email || data.data.id || data.data._id)) {
            // Check for data.data structure (common in API wrappers)
            userData = data.data;
            if (process.env.NODE_ENV === 'development') {
              console.log('🔧 AuthContext - Using data.data structure for login');
            }
          } else if (data.email || data.id || data._id) {
            userData = data;
            if (process.env.NODE_ENV === 'development') {
              console.log('🔧 AuthContext - Using direct data structure for login');
            }
          } else {
            // Log available keys for debugging
            if (process.env.NODE_ENV === 'development') {
              console.log('🔧 AuthContext - Available login data keys:', Object.keys(data));
            }
            throw new Error(`Unrecognized login data structure: ${JSON.stringify(data)}`);
          }
        } else {
          throw new Error(`Invalid login data type: ${typeof data}`);
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('🔧 AuthContext - Error processing login data:', error);
          console.error('🔧 AuthContext - Raw login data was:', data);
        }
        throw new Error('Invalid login response format');
      }
      if (!token) {
        if (process.env.NODE_ENV === 'development') {
          console.error('🔧 AuthContext - Authentication token missing in response');
        }
        throw new Error('Authentication token missing');
      }
      
      const userInfo: AuthUser = {
        email: userData.email,
        id: userData.id || userData._id,
        name: userData.name,
        role: userData.role,
        mobile: userData.mobile,
        reraId: userData.reraId,
        favorites: userData?.favorites,
        occupation: userData?.occupation,
        recentlyViewed: userData?.recentlyViewed,
        subscriptionStatus: userData?.subscriptionStatus,
      };
      
      console.log('🔧 AuthContext - Setting session with user:', { 
        id: userInfo.id,
        name: userInfo.name,
        role: userInfo.role
      });
      
      sessionManager.setToken(token);
      sessionManager.setUser(userInfo as any);
      setUser(userInfo);
      
      const redirectPath = userData.role === 'admin' ? '/admin' : '/';
      console.log('🔧 AuthContext - Redirecting to:', redirectPath);
      router.push(redirectPath);
      return { success: true };
    } catch (err: any) {
      console.error('🔧 AuthContext - Login error:', err);
      const message = err?.message || 'Login failed. Please try again.';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, [loginMutation, router]);

  const register = useCallback(async (payload: { name: string; email: string; password: string; mobile?: string; favorites?: any; occupation?: string; recentlyViewed?: any }) => {
    console.log('🔧 AuthContext - Register attempt with email:', payload.email);
    setLoading(true);
    setError(null);
    try {
      console.log('🔧 AuthContext - Calling register mutation');
      const data = await registerMutation.mutateAsync(payload) as any;
      console.log('🔧 AuthContext - Registration successful, processing response');
      
      const { token, user: userInfo } = data;
      if (!token) {
        console.error('🔧 AuthContext - Authentication token missing in registration response');
        throw new Error('Authentication token missing');
      }
      
      const userInfoObj: AuthUser = {
        email: userInfo.email,
        id: userInfo.id || userInfo._id,
        name: userInfo.name,
        role: userInfo.role,
        mobile: payload.mobile,
        reraId: userInfo.reraId,
        favorites: payload?.favorites,
        occupation: payload?.occupation,
        recentlyViewed: payload?.recentlyViewed,
        subscriptionStatus: userInfo?.subscriptionStatus,
      } as any;
      
      console.log('🔧 AuthContext - Setting session after registration with user:', { 
        id: userInfoObj.id,
        name: userInfoObj.name,
        role: userInfoObj.role
      });
      
      sessionManager.setToken(token);
      sessionManager.setUser(userInfoObj as any);
      setUser(userInfoObj);
      
      console.log('🔧 AuthContext - Registration complete, redirecting to home');
      router.push('/');
      return { success: true };
    } catch (err: any) {
      console.error('🔧 AuthContext - Registration error:', err);
      const message = err?.message || 'Registration failed';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, [registerMutation, router]);

  const logout = useCallback(() => {
    sessionManager.clearSession();
    setUser(null);
    setError(null);
    router.push('/login');
  }, [router]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const updateUser = useCallback((updatedUser: Partial<AuthUser>) => {
    setUser(prev => ({ ...(prev as AuthUser), ...(updatedUser as Partial<AuthUser>) }));
  }, []);

  const isAuthenticated = useMemo(() => !!user && !!sessionManager.getToken(), [user]);

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

