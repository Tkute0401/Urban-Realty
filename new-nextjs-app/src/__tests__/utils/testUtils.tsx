// Test Utilities
import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import { AuthProvider } from '../../contexts/AuthContext';
import { LoadingProvider } from '../../lib/utils/loadingManager';

// Create test theme
const testTheme = createTheme({
  palette: {
    primary: {
      main: '#F76B1C',
    },
    secondary: {
      main: '#1A2BFF',
    },
  },
});

// Mock API service for tests
export const mockApiService = {
  login: jest.fn(),
  register: jest.fn(),
  getMe: jest.fn(),
  getProperties: jest.fn(),
  getProperty: jest.fn(),
  createProperty: jest.fn(),
  updateProperty: jest.fn(),
  deleteProperty: jest.fn(),
  getContacts: jest.fn(),
  createContact: jest.fn(),
  updateContact: jest.fn(),
  deleteContact: jest.fn(),
  getSubscriptionPlans: jest.fn(),
  getUserSubscription: jest.fn(),
  subscribe: jest.fn(),
  cancelSubscription: jest.fn(),
  getAdminDashboard: jest.fn(),
  getAdminUsers: jest.fn(),
  getAdminProperties: jest.fn(),
  getAdminContacts: jest.fn(),
  getAgentDashboard: jest.fn(),
  getAgentProperties: jest.fn(),
  getAgentLeads: jest.fn(),
  getAgentAnalytics: jest.fn(),
  healthCheck: jest.fn(),
};

// Mock user data
export const mockUser = {
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
  role: 'user',
  mobile: '1234567890',
  reraId: null,
  favorites: [],
  occupation: 'Software Engineer',
  recentlyViewed: [],
};

// Mock property data
export const mockProperty = {
  id: '1',
  title: 'Test Property',
  description: 'A beautiful test property',
  price: 500000,
  type: 'Apartment',
  status: 'For Sale',
  bedrooms: 2,
  bathrooms: 2,
  area: 1200,
  address: '123 Test Street',
  city: 'Test City',
  state: 'Test State',
  zipCode: '12345',
  coordinates: { lat: 40.7128, lng: -74.0060 },
  images: ['/test-image.jpg'],
  agent: 'agent1',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

// Mock contact data
export const mockContact = {
  id: '1',
  name: 'Test Contact',
  email: 'contact@example.com',
  phone: '1234567890',
  message: 'Test message',
  propertyId: '1',
  status: 'new',
  createdAt: '2024-01-01T00:00:00Z',
};

// Custom render function with providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialUser?: any;
  initialLoading?: boolean;
}

export const renderWithProviders = (
  ui: React.ReactElement,
  options: CustomRenderOptions = {}
) => {
  const { initialUser = null, initialLoading = false, ...renderOptions } = options;

  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
      <ThemeProvider theme={testTheme}>
        <LoadingProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </LoadingProvider>
      </ThemeProvider>
    );
  };

  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

// Mock router
export const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  refresh: jest.fn(),
  prefetch: jest.fn(),
  pathname: '/',
  query: {},
  asPath: '/',
  events: {
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
  },
};

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock API service
jest.mock('../../lib/services/apiService', () => ({
  apiService: mockApiService,
}));

// Mock session manager
jest.mock('../../lib/utils/sessionManager', () => ({
  sessionManager: {
    getToken: jest.fn(() => 'mock-token'),
    setToken: jest.fn(),
    getUser: jest.fn(() => mockUser),
    setUser: jest.fn(),
    clearSession: jest.fn(),
  },
}));

// Test helpers
export const waitForLoadingToFinish = () => {
  return new Promise(resolve => setTimeout(resolve, 0));
};

export const createMockResponse = (data: any, status: number = 200) => {
  return {
    data,
    status,
    success: status >= 200 && status < 300,
  };
};

export const createMockError = (message: string, status: number = 500) => {
  const error = new Error(message);
  (error as any).status = status;
  return error;
};

// Mock fetch responses
export const mockFetch = (response: any, status: number = 200) => {
  (global.fetch as jest.Mock).mockResolvedValueOnce({
    ok: status >= 200 && status < 300,
    status,
    json: async () => response,
  });
};

export const mockFetchError = (message: string, status: number = 500) => {
  (global.fetch as jest.Mock).mockRejectedValueOnce(
    createMockError(message, status)
  );
};

// Test data factories
export const createMockUser = (overrides: any = {}) => ({
  ...mockUser,
  ...overrides,
});

export const createMockProperty = (overrides: any = {}) => ({
  ...mockProperty,
  ...overrides,
});

export const createMockContact = (overrides: any = {}) => ({
  ...mockContact,
  ...overrides,
});

// Accessibility testing helpers
export const checkAccessibility = async (container: HTMLElement) => {
  // Basic accessibility checks
  const images = container.querySelectorAll('img');
  images.forEach(img => {
    expect(img).toHaveAttribute('alt');
  });

  const inputs = container.querySelectorAll('input, textarea, select');
  inputs.forEach(input => {
    const id = input.id;
    const label = container.querySelector(`label[for="${id}"]`);
    const ariaLabel = input.getAttribute('aria-label');
    const ariaLabelledBy = input.getAttribute('aria-labelledby');
    
    expect(label || ariaLabel || ariaLabelledBy).toBeTruthy();
  });
};

// Performance testing helpers
export const measureRenderTime = (renderFn: () => void) => {
  const start = performance.now();
  renderFn();
  const end = performance.now();
  return end - start;
};

export default {
  renderWithProviders,
  mockApiService,
  mockUser,
  mockProperty,
  mockContact,
  mockRouter,
  waitForLoadingToFinish,
  createMockResponse,
  createMockError,
  mockFetch,
  mockFetchError,
  createMockUser,
  createMockProperty,
  createMockContact,
  checkAccessibility,
  measureRenderTime,
};