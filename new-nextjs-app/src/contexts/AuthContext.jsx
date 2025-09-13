import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { apiService } from '@/lib/services/apiService';
import { sessionManager } from '@/lib/utils/sessionManager';
import { useRouter } from 'next/navigation';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  // API service handles authentication internally
  useEffect(() => {
    // Real API service will handle authentication tokens automatically
    // No interceptors needed as we handle tokens in the API service
  }, []);

  // Load user function - memoized
  const loadUser = useCallback(async () => {
    try {
      const token = sessionManager.getToken();
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await apiService.getMe();
      const userData = response.data?.data || response.data;
      if (userData && userData.success) {
        const userInfo = {
          email: userData.user.email,
          id: userData.user._id || userData.user.id,
          name: userData.user.name,
          role: userData.user.role,
          mobile: userData.user.mobile,
          reraId: userData.user.reraId,
          favorites: userData.user?.favorites,
          occupation: userData.user?.occupation,
          recentlyViewed: userData.user?.recentlyViewed
        };
        setUser(userInfo);
        sessionManager.setUser(userInfo);
      }
    } catch (err) {
      if (err.status === 401) {
        sessionManager.clearSession();
      }
      setError(err.message || 'Failed to load user');
    } finally {
      setLoading(false);
    }
  }, []);

  // Load user on mount
  useEffect(() => {
    loadUser();
  }, [loadUser]);

  // Login function - memoized
  const login = useCallback(async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.login(credentials.email, credentials.password);
      const { token, user: userData } = response.data;

      if (!token) {
        throw new Error('Authentication token missing');
      }

      const userInfo = {
        email: userData.email,
        id: userData.id || userData._id,
        name: userData.name,
        role: userData.role,
        mobile: userData.mobile,
        reraId: userData.reraId,
        favorites: userData?.favorites,
        occupation: userData?.occupation,
        recentlyViewed: userData?.recentlyViewed
      };

      sessionManager.setToken(token);
      sessionManager.setUser(userInfo);
      setUser(userInfo);

      if (userData.role === 'admin') {
        router.push('/admin');
        return { success: true };
      }
      router.push('/');
      return { success: true };
    } catch (err) {
      const message = err.message || 'Login failed. Please try again.';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, [router.push]);

  // Register function - memoized
  const register = useCallback(async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.register(userData);
      const { token, user: userInfo } = response.data;

      const userInfoObj = {
        email: userInfo.email,
        id: userInfo.id || userInfo._id,
        name: userInfo.name,
        role: userInfo.role,
        mobile: userData.mobile,
        reraId: userInfo.reraId,
        favorites: userData?.favorites,
        occupation: userData?.occupation,
        recentlyViewed: userData?.recentlyViewed
      };

      sessionManager.setToken(token);
      sessionManager.setUser(userInfoObj);
      setUser(userInfoObj);
      router.push('/');
      return { success: true };
    } catch (err) {
      const message = err.message || 'Registration failed';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, [router.push]);

  // Logout function - memoized
  const logout = useCallback(() => {
    sessionManager.clearSession();
    setUser(null);
    setError(null);
    router.push('/login');
  }, [router.push]);

  // Clear error function - memoized
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Update user function - memoized
  const updateUser = useCallback((updatedUser) => {
    setUser(prev => ({ ...prev, ...updatedUser }));
  }, []);

  // Memoized context value
  const value = useMemo(() => ({
    user,
    loading,
    error,
    login,
    register,
    logout,
    clearError,
    updateUser
  }), [user, loading, error, login, register, logout, clearError, updateUser]);

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};