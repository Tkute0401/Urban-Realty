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
  login: (credentials: { email: string; password: string }) => Promise<{ success: boolean; error?: string }>;
  register: (payload: { name: string; email: string; password: string; mobile?: string; favorites?: any; occupation?: string; recentlyViewed?: any }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  clearError: () => void;
  updateUser: (updatedUser: Partial<AuthUser>) => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const profileQuery = useProfileQuery(Boolean(sessionManager.getToken()));
  const loginMutation = useLoginMutation();
  const registerMutation = useRegisterMutation();

  const loadUser = useCallback(() => {
    const token = sessionManager.getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    if (profileQuery.data) {
      const data = profileQuery.data as any;
      const userInfo: AuthUser = {
        email: data.user.email,
        id: data.user._id || data.user.id,
        name: data.user.name,
        role: data.user.role,
        mobile: data.user.mobile,
        reraId: data.user.reraId,
        favorites: data.user?.favorites,
        occupation: data.user?.occupation,
        recentlyViewed: data.user?.recentlyViewed,
        subscriptionStatus: data.user?.subscriptionStatus,
      };
      setUser(userInfo);
      sessionManager.setUser(userInfo as any);
      setLoading(false);
    } else if (profileQuery.isError) {
      sessionManager.clearSession();
      setError((profileQuery.error as any)?.message || 'Failed to load user');
      setLoading(false);
    }
  }, [profileQuery.data, profileQuery.isError, profileQuery.error]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = useCallback(async (credentials: { email: string; password: string }) => {
    setLoading(true);
    setError(null);
    try {
      const data = await loginMutation.mutateAsync(credentials) as any;
      const { token, user: userData } = data;
      if (!token) throw new Error('Authentication token missing');
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
      sessionManager.setToken(token);
      sessionManager.setUser(userInfo as any);
      setUser(userInfo);
      router.push(userData.role === 'admin' ? '/admin' : '/');
      return { success: true };
    } catch (err: any) {
      const message = err?.message || 'Login failed. Please try again.';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, [loginMutation, router]);

  const register = useCallback(async (payload: { name: string; email: string; password: string; mobile?: string; favorites?: any; occupation?: string; recentlyViewed?: any }) => {
    setLoading(true);
    setError(null);
    try {
      const data = await registerMutation.mutateAsync(payload) as any;
      const { token, user: userInfo } = data;
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
      sessionManager.setToken(token);
      sessionManager.setUser(userInfoObj as any);
      setUser(userInfoObj);
      router.push('/');
      return { success: true };
    } catch (err: any) {
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

  const value: AuthContextValue = useMemo(() => ({
    user,
    loading,
    error,
    login,
    register,
    logout,
    clearError,
    updateUser,
  }), [user, loading, error, login, register, logout, clearError, updateUser]);

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
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

