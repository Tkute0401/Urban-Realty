import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import axios from '../services/axios';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Initialize axios interceptors with cleanup
  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axios.interceptors.response.use(
      (response) => {
        // Only log non-auth responses in development
        if (process.env.NODE_ENV === 'development' && 
            !response.config.url.includes('/auth/')) {
          
        }
        return response;
      },
      (error) => {
        // Always log errors except in test environment
        if (process.env.NODE_ENV !== 'test') {
          console.error('API Error:', {
            url: error.config?.url,
            status: error.response?.status,
            message: error.message,
            response: error.response?.data
          });
        }
        
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          setUser(null);
          navigate('/login');
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [navigate]);

  // Load user function - memoized
  const loadUser = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await axios.get('/auth/me');
      const userData = response.data?.data || response.data;
      if (userData) {
        setUser({
          email: userData.email,
          id: userData._id || userData.id,
          name: userData.name,
          role: userData.role
        });
      }
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
      }
      setError(err.response?.data?.message || 'Failed to load user');
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
      const response = await axios.post('/auth/login', credentials);
      const { token, user: userData } = response.data;

      if (!token) {
        throw new Error('Authentication token missing');
      }

      localStorage.setItem('token', token);
      setUser({
        email: userData.email,
        id: userData.id || userData._id,
        name: userData.name,
        role: userData.role
      });
      navigate('/');
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 
                     err.message || 
                     'Login failed. Please try again.';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // Register function - memoized
  const register = useCallback(async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('/auth/register', userData);
      const { token, user: userInfo } = response.data;

      localStorage.setItem('token', token);
      setUser({
        email: userInfo.email,
        id: userInfo.id || userInfo._id,
        name: userInfo.name,
        role: userInfo.role
      });
      navigate('/');
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 
                     err.message || 
                     'Registration failed';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // Logout function - memoized
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
    setError(null);
    navigate('/login');
  }, [navigate]);

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