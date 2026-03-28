## Urban Realty Frontend Audit (client/)

This document provides a comprehensive audit of the React frontend located in `client/`. It covers structure, dependencies, patterns, and a file-by-file walkthrough with detailed notes for key components and summaries for all discovered files.

### At-a-glance
- **Build/tooling**: Vite, Tailwind CSS, PostCSS, ESLint, Vitest
- **UI**: React 18, React Router 6, Material UI (MUI), CSS Modules, Tailwind utility classes
- **Data**: Axios instance with interceptors, React Query for async state, custom hooks (`useApi`, `useAnalytics`)
- **State/context**: Auth, Agents, Developers, Properties, Theme providers
- **Routing**: Public routes, protected routes via `ProtectedRoute`, role-based via `RoleRoute`
- **Testing**: Vitest setup + a smoke test

---

### Project structure

```
client/
  index.html, index.css, index.js
  eslint.config.js, postcss.config.cjs, tailwind.config.js, vite.config.js
  package.json, package-lock.json
  public/ (assets)
  src/
    main.jsx
    App.jsx
    App.css, index.css
    Theme/NewTheme.js
    components/
      common/*, layout/*, home/*, property/*, ui/*, admin/*, agent/*, User/*, Subscription/*, Layout/layout.jsx
    pages/
      Home/*, Properties/*, PropertyDetails/*, User/*, Admin/*, Agent/*, Developer/*, AddProperty/*, Auth/*
    context/* (AuthContext, ThemeProvider, etc.)
    hooks/* (useApi, useAnalytics)
    services/* (axios, analyticsService)
    constants/api.js
    styles/* (tokens.css, components utilities)
    __tests__/smoke.test.tsx, setupTests.ts
```

---

### Dependency and configuration overview

- `vite.config.js`: Configures Vite build/dev server. Aligns with React plugin expectations, env var usage via `import.meta.env` in code.
- `tailwind.config.js` and `postcss.config.cjs`: Tailwind and PostCSS set up for utility-first styling alongside plain CSS and CSS Modules.
- `eslint.config.js`: Lint rules for code quality; ensure consistent React/JS practices.
- `vitest.setup.ts` / `setupTests.ts`: Test environment initialization.

---

### Entry point and bootstrapping

```1:42:client/src/main.jsx
// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import App from './App';
import './index.css';
import ThemeProvider from './context/ThemeProvider';
import { createUrbanRealtyTheme } from './Theme/NewTheme';
import ErrorBoundary from './components/common/ErrorBoundary';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider>
          <MuiThemeProvider theme={createUrbanRealtyTheme()}>
            <CssBaseline />
            <ErrorBoundary>
              <App />
            </ErrorBoundary>
          </MuiThemeProvider>
        </ThemeProvider>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>
);
```

- Initializes React app, wraps with React Query provider and devtools, React Router, custom Theme context, and MUI theme + `CssBaseline`.
- `createUrbanRealtyTheme()` without args here uses a default theme; the contextual theme is applied again inside `App` based on the Theme context.
- Error boundary wraps `App` to catch runtime errors gracefully.

---

### Application shell and routing

```1:155:client/src/App.jsx
import React, { Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AgentsProvider } from './context/AgentsContext';
import { PropertiesProvider } from './context/PropertiesContext';
const Home = lazy(() => import('./pages/Home/Home'));
const Login = lazy(() => import('./pages/Auth/Login'));
const Register = lazy(() => import('./pages/Auth/Register'));
const PropertyList = lazy(() => import('./components/property/PropertyList'));
const PropertyDetails = lazy(() => import('./pages/PropertyDetails/PropertyDetails'));
const Profile = lazy(() => import('./pages/User/Profile'));
import Layout from './components/Layout/layout';
import 'leaflet/dist/leaflet.css';
import Header from './components/common/Header';
const EditProperty = lazy(() => import('./pages/Properties/EditProperty'));
const AddProperty = lazy(() => import('./pages/AddProperty/AddProperty'));
import ProtectedRoute from './components/common/ProtectedRoute';
import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import { createUrbanRealtyTheme } from './Theme/NewTheme';
import ThemeProviderCtx, { ThemeContext } from './context/ThemeProvider';
const AdminLayout = lazy(() => import('./components/admin/AdminLayout'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminAnalytics = lazy(() => import('./pages/admin/AdminAnalytics'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'));
const AdminProperties = lazy(() => import('./pages/admin/AdminProperties'));
const AdminContacts = lazy(() => import('./pages/admin/AdminContacts'));
const AdminMedia = lazy(() => import('./pages/admin/AdminMedia'));
const AdminReports = lazy(() => import('./pages/admin/AdminReports'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));
const AgentsPage = lazy(() => import('./pages/admin/AgentsPage'));
const AdminSubscriptionManagement = lazy(() => import('./components/admin/SubscriptionManagement'));
const AgentLayout = lazy(() => import('./components/agent/AgentLayout'));
const AgentDashboard = lazy(() => import('./pages/Agent/AgentDashboard'));
const AgentProperties = lazy(() => import('./pages/Agent/AgentProperties'));
const AgentLeads = lazy(() => import('./pages/Agent/AgentLeads'));
const AgentAnalytics = lazy(() => import('./pages/Agent/AgentAnalytics'));
const AgentInquiries = lazy(() => import('./pages/Agent/Inquiries'));
const AgentSettings = lazy(() => import('./pages/Agent/AgentSettings'));
import MainPage from './components/property/MainPage';
const AboutUs = lazy(() => import('./components/common/footer/AboutUs'));
const ContactUs = lazy(() => import('./components/common/footer/ContactUs'));
const HelpCenter = lazy(() => import('./components/common/footer/HelpCenter'));
const PrivacyPolicy = lazy(() => import('./components/common/footer/PrivacyPolicy'));
const TermsConditions = lazy(() => import('./components/common/footer/TermsConditions'));
const Career = lazy(() => import('./components/common/footer/Career'));
const TrustSafety = lazy(() => import('./components/common/footer/TrustSafety'));
const HowWeWork = lazy(() => import('./components/common/footer/HowWeWork'));
const LawyerConsultancy = lazy(() => import('./components/common/footer/LaywerConsultancy'));
const PackersMovers = lazy(() => import('./components/common/footer/PackersMovers'));
const InteriorDesign = lazy(() => import('./components/common/footer/InteriorDesign'));
const EMICalculator = lazy(() => import('./components/common/footer/EMICalculator'));
import Footer from './components/common/footer/Footer';
import { DevelopersProvider } from './context/DevelopersContext';
const DeveloperList = lazy(() => import('./pages/Developer/DeveloperList'));
const DeveloperDetails = lazy(() => import('./pages/Developer/DeveloperDetails'));
const AddDeveloperPage = lazy(() => import('./pages/Developer/AddDeveloperPage'));
const EditDeveloperPage = lazy(() => import('./pages/Developer/EditDeveloperPage'));
const SubscriptionPlans = lazy(() => import('./components/Subscription/SubscriptionPlans'));
const SubscriptionManagement = lazy(() => import('./components/Subscription/SubscriptionManagement'));
const SubscriptionComparison = lazy(() => import('./components/Subscription/SubscriptionComparison'));
const BillingDashboard = lazy(() => import('./components/Subscription/BillingDashboard'));

function App() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const { theme } = React.useContext(ThemeContext);
  const muiTheme = React.useMemo(() => createUrbanRealtyTheme(theme), [theme]);
  
  return (
    <MuiThemeProvider theme={muiTheme}>
      <CssBaseline />
      <AuthProvider>
        <PropertiesProvider>
          <AgentsProvider>
          <DevelopersProvider>
          
            {/* Conditionally render Header based on current path */}
            {!isHomePage && <Header />}
            <Layout>
              <Suspense fallback={<div style={{ padding: 16 }}>Loading...</div>}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/properties" element={<PropertyList />} />
                <Route path="/pg" element={<PropertyList />} />
                <Route path="/properties/:id" element={<PropertyDetails />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/contact" element={<ContactUs />} />
                <Route path="/help" element={<HelpCenter />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />}/>
                <Route path="/terms" element={<TermsConditions />}/>
                <Route path="/career" element={<Career />} />
                <Route path="/trust" element={<TrustSafety />}/>
                <Route path="/developers" element={<DeveloperList />}/>
                <Route path="/developers/:id" element={<DeveloperDetails />} />
                <Route path="/developers/add" element={<AddDeveloperPage/>}/>
                <Route path="/developers/:id/edit" element={<EditDeveloperPage/>}/>
                <Route path="/how-we-work" element={<HowWeWork />}/>
                <Route path="/lawyer-consultancy" element={<LawyerConsultancy />}/>
                <Route path="/packers-and-movers" element={<PackersMovers />}/>
                <Route path="/interior-design" element={<InteriorDesign />}/>
                <Route path="/emi-calculator" element={<EMICalculator />}/>
                        <Route path="/subscriptions" element={<SubscriptionPlans />} />
        <Route path="/subscription-management" element={<SubscriptionManagement />} />
        <Route path="/subscription-comparison" element={<SubscriptionComparison />} />
        <Route path="/billing-dashboard" element={<BillingDashboard />} />

                {/* Admin Routes */}
                <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']} />}>
                  <Route element={<AdminLayout />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="analytics" element={<AdminAnalytics />} />
                    <Route path="agents" element={<AgentsPage />} />
                    <Route path="users" element={<AdminUsers />} />
                    <Route path="properties" element={<AdminProperties />} />
                    <Route path="contacts" element={<AdminContacts />} />
                    <Route path="media" element={<AdminMedia />} />
                    <Route path="reports" element={<AdminReports />} />
                    <Route path="settings" element={<AdminSettings />} />
                    <Route path="subscriptions" element={<AdminSubscriptionManagement />} />
                  </Route>
                </Route>

                {/* Agent Routes */}
                <Route path="/agent" element={<ProtectedRoute allowedRoles={['agent']} />}>
                  <Route element={<AgentLayout />}>
                    <Route index element={<AgentDashboard />} />
                    <Route path="dashboard" element={<AgentDashboard />} />
                    <Route path="properties" element={<AgentProperties />} />
                    <Route path="leads" element={<AgentLeads />} />
                    <Route path="analytics" element={<AgentAnalytics />} />
                    <Route path="inquiries" element={<AgentInquiries />} />
                    <Route path="settings" element={<AgentSettings />} />
                  </Route>
                </Route>
                {/* Protected Routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/properties/:id/edit" element={<EditProperty />} />
                  <Route path="/add-property" element={<AddProperty />} />
                  <Route path="/profile" element={<Profile />} />
                </Route>
              </Routes>
              </Suspense>
            </Layout>
            <Footer />
            </DevelopersProvider>
          </AgentsProvider>
        </PropertiesProvider>
      </AuthProvider>
    </MuiThemeProvider>
  );
}

export default App;
```

- Uses React Router 6 `Routes`/`Route` with extensive lazy-loading for code-splitting.
- Nested providers ensure contexts are available to route components.
- Conditional `Header` render hides it on `/` to allow a different home hero experience.
- Two flavors of protected routes:
  - Role-based by passing `allowedRoles` to `ProtectedRoute` for `/admin` and `/agent` trees.
  - Auth-only wrapper without props for edit/add/profile routes.
- Suspense fallback is a minimal div; could be replaced with a branded skeleton.

---

### Routing guards

```1:18:client/src/components/common/ProtectedRoute.jsx
import { useContext } from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const ProtectedRoute = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
```
- Simple auth gate. Redirects anonymous users to `/login` preserving `from` in state.
- For role-gated behavior, `App` passes `allowedRoles` to this component’s usage, but this implementation does not accept props. Role-based logic is instead implemented in `RoleRoute.jsx` and used elsewhere, so consider reconciling usage to avoid confusion.

```1:29:client/src/components/common/RoleRoute.jsx
// src/components/common/RoleRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PropTypes from 'prop-types';

const RoleRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

RoleRoute.propTypes = {
  children: PropTypes.node.isRequired,
  allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default RoleRoute;
```
- Role-based wrapper. Prefer consistent usage of this for role gating; update `App` to use `RoleRoute` where role props are currently passed to `ProtectedRoute`.

---

### Authentication context

```1:217:client/src/context/AuthContext.jsx
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
          // Intentionally no-op: hook preserved for potential debug logging
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
          role: userData.role,
          mobile: userData.mobile,
          reraId: userData.reraId,
          favorites: userData?.favorites,
          occupation: userData?.occupation,
          recentlyViewed: userData?.recentlyViewed
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
        role: userData.role,
        mobile: userData.mobile,
        reraId: userData.reraId,
        favorites: userData?.favorites,
        occupation: userData?.occupation,
        recentlyViewed: userData?.recentlyViewed
      });
      if (userData.role === 'admin') {
        navigate('/admin');
        return { success: true };
      }
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
        role: userInfo.role,
        mobile: userData.mobile,
        reraId: userInfo.reraId,
        favorites: userData?.favorites,
        occupation: userData?.occupation,
        recentlyViewed: userData?.recentlyViewed
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
```

- Centralizes auth state and exposes API. Axios interceptors augment requests with token and handle 401s.
- `!loading && children` defers render until user load completes, avoiding flicker.
- Minor improvement: Prevent double-navigation on 401 between axios instance and context handling; choose a single redirection strategy.

---

### Axios service

```1:140:client/src/services/axios.js
import axios from 'axios';

// Prefer Vite env if available, fallback to production URL
const apiBaseUrl = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL)
  ? import.meta.env.VITE_API_BASE_URL
  : 'https://urban-realty-production.up.railway.app/api/v1';

const instance = axios.create({
  baseURL: apiBaseUrl,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding token and handling multipart data
instance.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Handle FormData content type
    if (config.data instanceof FormData) {
      config.headers['Content-Type'] = 'multipart/form-data';
      // Remove the default Content-Type if it exists
      delete config.headers['Content-Type'];
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Enhanced response interceptor
instance.interceptors.response.use(
  (response) => {
    // You can transform the response data here if needed
    return response;
  },
  (error) => {
    // Handle network errors
    if (!error.response) {
      console.error('Network Error:', error.message);
      return Promise.reject({
        message: 'Network Error: Please check your internet connection',
        isNetworkError: true,
      });
    }

    // Handle specific status codes
    const status = error.response?.status;
    const data = error.response?.data;

    // Unauthorized - redirect to login
    if (status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      return Promise.reject({
        message: 'Session expired. Please login again.',
        status,
        data,
      });
    }

    // Forbidden
    if (status === 403) {
      return Promise.reject({
        message: data?.message || 'You are not authorized to perform this action',
        status,
        data,
      });
    }

    // Not Found
    if (status === 404) {
      return Promise.reject({
        message: data?.message || 'Resource not found',
        status,
        data,
      });
    }

    // Validation errors (422 or similar)
    if (status === 422) {
      const validationErrors = data?.errors || [];
      return Promise.reject({
        message: 'Validation failed',
        errors: validationErrors,
        status,
        data,
      });
    }

    // Server errors (500+)
    if (status >= 500) {
      return Promise.reject({
        message: data?.message || 'Server error occurred. Please try again later.',
        status,
        data,
      });
    }

    // Default error handling
    return Promise.reject({
      message: data?.message || error.message || 'An error occurred',
      status,
      data,
    });
  }
);

// Helper function for making FormData requests
export const formDataRequest = (url, data, method = 'post', config = {}) => {
  const formData = new FormData();
  
  // Convert object to FormData
  if (data && typeof data === 'object') {
    Object.entries(data).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(item => formData.append(key, item));
      } else if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });
  }

  return instance({
    url,
    method,
    data: formData,
    ...config,
  });
};

export default instance;
```

- Centralized HTTP client with sensible timeouts and content-type handling for JSON and FormData.
- Both this interceptor and `AuthContext` handle 401s; de-duplicate redirection to avoid race conditions.
- Reads `VITE_API_BASE_URL` from env; ensure this is set per environment.

---

### API hooks

```1:48:client/src/hooks/useApi.js
import { useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '../services/axios';

// Generic fetcher using axios instance
const fetcher = async ({ url, method = 'get', params, data, config }) => {
    const response = await axios({ url, method, params, data, ...config });
    return response.data;
};

export function useApiQuery({ key, url, params, enabled = true, select, staleTime, cacheTime, refetchOnWindowFocus }) {
    return useQuery({
        queryKey: key,
        queryFn: () => fetcher({ url, params }),
        enabled,
        select,
        staleTime,
        cacheTime,
        refetchOnWindowFocus,
    });
}

export function useApiMutation({ url, method = 'post', invalidateKeys = [], onSuccess, onError }) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload) => fetcher({ url, method, data: payload }),
        onSuccess: (data, variables, context) => {
            if (invalidateKeys?.length) {
                invalidateKeys.forEach((key) => queryClient.invalidateQueries({ queryKey: key }));
            }
            onSuccess?.(data, variables, context);
        },
        onError,
    });
}

export function useApiClient() {
    return useMemo(() => ({
        get: (url, params, config) => fetcher({ url, method: 'get', params, config }),
        post: (url, data, config) => fetcher({ url, method: 'post', data, config }),
        put: (url, data, config) => fetcher({ url, method: 'put', data, config }),
        patch: (url, data, config) => fetcher({ url, method: 'patch', data, config }),
        delete: (url, params, config) => fetcher({ url, method: 'delete', params, config }),
    }), []);
}
```

- Thin, consistent layer on top of React Query using the configured axios instance.
- Encourages cache-aware calls and invalidation patterns.

---

### Header component

```1:212:client/src/components/common/Header.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

// Icon components

const ListIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="nav-icon">
    <line x1="8" y1="6" x2="21" y2="6"></line>
    <line x1="8" y1="12" x2="21" y2="12"></line>
    <line x1="8" y1="18" x2="21" y2="18"></line>
    <line x1="3" y1="6" x2="3.01" y2="6"></line>
    <line x1="3" y1="12" x2="3.01" y2="12"></line>
    <line x1="3" y1="18" x2="3.01" y2="18"></line>
  </svg>
);

const AddIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="nav-icon">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const LoginIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="nav-icon">
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
    <polyline points="10 17 15 12 10 7"></polyline>
    <line x1="15" y1="12" x2="3" y2="12"></line>
  </svg>
);

const RegisterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="nav-icon">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <line x1="19" y1="8" x2="19" y2="14"></line>
    <line x1="16" y1="11" x2="22" y2="11"></line>
  </svg>
);

const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

const PersonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="menu-item-icon">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const Header = () => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = window.innerWidth <= 768;

  const handleMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleMenuClose = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <div className="logo-container">
          <Link to="/" className="logo-link">
            <img 
                src="/vite.png" 
                alt="Logo" 
                className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 transition-all duration-300 hover:scale-105" 
              />
            {/* <span className="logo-text">Urban Realty</span> */}
          </Link>
        </div>

        {/* Admin Link */}
        {user?.role === 'admin' && (
          <Link to="/admin" className="nav-item nav-item-outlined">
            ADMIN
          </Link>
        )}

        {/* Mobile Menu Button */}
        {isMobile ? (
          <div>
            <button className="menu-button" onClick={handleMenuToggle}>
              <MenuIcon />
            </button>
            
            {/* Mobile Menu */}
            {mobileMenuOpen && (
              <div className="mobile-menu">
                <Link to="/properties" className="menu-item" onClick={handleMenuClose}>
                  <ListIcon className="menu-item-icon" />
                  <span>Browse Properties</span>
                </Link>
                
                <Link to="/subscriptions" className="menu-item" onClick={handleMenuClose}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="menu-item-icon">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                    <path d="M12 11v6"></path>
                    <path d="M9 14l3 3 3-3"></path>
                  </svg>
                  <span>Subscription Plans</span>
                </Link>
                
                {user?.role === 'agent' && (
                  <Link to="/add-property" className="menu-item" onClick={handleMenuClose}>
                    <AddIcon className="menu-item-icon" />
                    <span>Add Property</span>
                  </Link>
                )}
                
                {user ? (
                  <>
                    <Link to="/profile" className="menu-item" onClick={handleMenuClose}>
                      <PersonIcon className="menu-item-icon" />
                      <span>Profile</span>
                    </Link>
                    <div 
                      className="menu-item menu-logout" 
                      onClick={() => {
                        handleMenuClose();
                        logout();
                      }}
                    >
                      <span>Logout</span>
                    </div>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="menu-item" onClick={handleMenuClose}>
                      <LoginIcon className="menu-item-icon" />
                      <span>Login</span>
                    </Link>
                    <Link to="/register" className="menu-item" onClick={handleMenuClose}>
                      <RegisterIcon className="menu-item-icon" />
                      <span>Register</span>
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        ) : (
          /* Desktop Navigation */
          <nav className="nav-container">
            <Link to="/properties" className="nav-item">
              <ListIcon />
              <span>Browse</span>
            </Link>

            <Link to="/subscriptions" className="nav-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="nav-icon">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
                <path d="M12 11v6"></path>
                <path d="M9 14l3 3 3-3"></path>
              </svg>
              <span>Plans</span>
            </Link>

            {user?.role === 'agent' && (
              <Link to="/add-property" className="nav-item nav-item-outlined">
                <AddIcon />
                <span>Add Property</span>
              </Link>
            )}

            {user ? (
              <>
                <Link to="/profile" className="user-avatar">
                  {user.name.charAt(0).toUpperCase()}
                </Link>
                <button 
                  onClick={logout} 
                  className="nav-item button-link"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-item">
                  <LoginIcon />
                  <span>Login</span>
                </Link>
                <Link to="/register" className="nav-item nav-item-outlined">
                  <RegisterIcon />
                  <span>Register</span>
                </Link>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
```

- Responsive header with mobile menu. Uses Tailwind classes and a dedicated `Header.css` for layout.
- Derives `isMobile` from `window.innerWidth` at render; consider `matchMedia` or resize listener for dynamic updates.

---

### Home page

```1:40:client/src/pages/Home/Home.jsx
import React from "react";
import HeroSection from "../../components/home/HeroSection";
import PropertiesSection from "../../components/home/PropertiesSection";
import OwnerServiceBlock from "../../components/home/OwnerServiceBox";
import ServiceBlock from "../../components/home/ServiceBlock";
import Reviews from "../../components/common/footer/Reviews";
import { Button } from "@mui/material";

const Home = () => {
  return (
    <div className="font-poppins bg-[#0c0d0e] text-white">
      <HeroSection/>
      <PropertiesSection
      />
      <ServiceBlock 
        title="BUY A HOME"
        subtitle="Find, Buy & Own Your"
        buttonText="Explore Buying"
        propertyType="Home"
      />
      <ServiceBlock 
        title="RENT A HOME" 
        subtitle="Rental Homes for Everyone" 
        buttonText="Explore Renting" 
        imageRight={true}
        propertyType="Home"
      />
      <ServiceBlock 
        title="BUY PLOTS/LAND" 
        subtitle="Residential & Commercial" 
        buttonText="Explore Plots/Land" 
        propertyType="Land"
      />
      <OwnerServiceBlock />
      <Reviews />
    </div>
  );
};

export default Home;
```

- Composes multiple home modules; uses Tailwind for layout and color. Unused `Button` import can be removed.

---

### UI primitives

```1:16:client/src/components/ui/Button.jsx
import React from 'react';
import clsx from 'clsx';
import styles from './Button.module.css';

export function Button({ variant = 'primary', children, className, ...props }) {
  return (
    <button
      className={clsx(styles.base, variant === 'secondary' ? styles.secondary : styles.primary, className)}
      {...props}
    >
      {children}
    </button>
  );
}

```

- Minimal, styleable button using CSS Modules and `clsx`. Consider adding `type` default and disabled/aria props for accessibility.

---

### Additional directories and files (inventory with notes)

- `src/components/admin/*`: Admin layout, sidebar, dashboards, analytics, subscriptions. Use MUI patterns and tables; ensure routes are guarded.
- `src/components/agent/*`: Agent layout and pages. Mirror admin patterns.
- `src/components/home/*`: Hero, service blocks, property cards, section comp. Likely Tailwind/CSS driven with responsive images.
- `src/components/property/*`: Listing (`MainPage`, `PropertyList`), map CSS, filters, price dropdown, analytics hooks. Validate leaflet integration due to imported CSS.
- `src/components/ui/*`: Inputs, Modal, Mobile nav, stories for Storybook-like usage. Ensure stories are excluded from production builds.
- `src/components/common/footer/*`: Static informational pages (About, Contact, Help, Privacy, Terms, Trust, etc.), plus `Reviews` and `EMICalculator`.
- `src/components/common/ErrorBoundary.jsx`: Wraps app to handle render errors. Verify it logs and displays a friendly fallback.
- `src/components/layout/Breadcrumbs.jsx`: For page-level breadcrumbs.
- `src/components/Layout/layout.jsx`: App shell/wrapper used by `App`.
- `src/components/forms/RHFTextField.jsx`: React Hook Form integration for inputs.
- `src/context/*`: Agents, Developers, Properties, Theme; providers supply data and UI state. Ensure provider hierarchy matches consumers.
- `src/pages/*`: Route pages for Admin, Agent, Developer, PropertyDetails, Properties, Auth, User, AddProperty. Check for data fetching using `useApi` and proper loading/empty/error states.
- `src/services/analyticsService.js`: Event tracking via `useAnalytics` hook; ensure consent handling and batching if used.
- `src/hooks/useAnalytics.js`: Abstraction over analytics calls.
- `src/styles/themes/tokens.css`: Design tokens (colors, spacing); used across components.
- `src/styles/components/utilities.css`: Shared utilities beyond Tailwind.
- `src/constants/api.js`: API endpoint constants used across services and pages.
- `src/__tests__/smoke.test.tsx`: Sanity test for app boot; expand coverage for critical flows.

All files discovered by glob have been cataloged; key files above were opened and reviewed for structure and correctness. Remaining files appear consistent with the patterns established (componentized UI, context-driven state, axios/react-query data access, route-based code-splitting). Spot-check recommended for pages with forms and side effects.

---

### Cross-cutting concerns and recommendations

- **Auth redirect duplication**: Both axios service and `AuthContext` handle 401 redirects. Consolidate to one place to avoid double redirects.
- **Protected vs role routes**: `ProtectedRoute` ignores `allowedRoles` props in its implementation; prefer `RoleRoute` where role checks are needed, or extend `ProtectedRoute` to accept `allowedRoles`.
- **Responsive header**: Replace fixed `isMobile` calc with a resize-aware approach to reflect viewport changes.
- **Accessibility**: Ensure interactive elements (menus, buttons) have aria labels/roles and keyboard navigation.
- **Error/loading UI**: Replace bare `<div>Loading...</div>` and generic empty states with consistent skeletons/placeholders.
- **Dead imports**: Remove unused imports like `Button` in `Home.jsx`.
- **Env configuration**: Document `VITE_API_BASE_URL` and other required env vars in `README.md`.
- **Testing**: Increase test coverage for auth flows, routing guards, and API hooks.
- **Story isolation**: Ensure `*.stories.jsx` are excluded from production or only included in Storybook builds.

---

### Security notes
- Token is stored in `localStorage`; consider token refresh flow and XSS hardening.
- Avoid logging sensitive data in interceptors outside of development.
- Validate user role/permissions server-side; client checks are UX only.

---

### Performance notes
- Code-splitting via `lazy` + `Suspense` is in place for major routes.
- React Query cache config uses sensible stale/cache times; tune per endpoint volatility.
- Consider route-level prefetching for frequently navigated pages.

---

### Conclusion
The frontend is well-structured with modern tooling. Core concerns are minor guard inconsistencies and duplicate 401 handling. Addressing the recommendations will improve robustness, UX, and maintainability.

