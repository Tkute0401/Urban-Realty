import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';

// Mock sessionManager
vi.mock('@/lib/utils/sessionManager', () => ({
  sessionManager: {
    getToken: vi.fn(),
    setToken: vi.fn(),
    setUser: vi.fn(),
    clearSession: vi.fn(),
    getUser: vi.fn(),
  },
}));

// Mock useRouter
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

// Mock auth hooks
vi.mock('@/hooks/api/auth', () => ({
  useProfileQuery: vi.fn(() => ({
    data: null,
    isError: false,
    error: null,
  })),
  useLoginMutation: vi.fn(() => ({
    mutateAsync: vi.fn(),
  })),
  useRegisterMutation: vi.fn(() => ({
    mutateAsync: vi.fn(),
  })),
}));

function TestComponent() {
  const auth = useAuth();
  return (
    <div>
      <div data-testid="loading">{auth.loading ? 'Loading' : 'Not Loading'}</div>
      <div data-testid="user">{auth.user ? auth.user.name : 'No User'}</div>
      <div data-testid="error">{auth.error || 'No Error'}</div>
    </div>
  );
}

describe('AuthContext', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
  });

  it('provides auth context to children', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </QueryClientProvider>
    );

    expect(screen.getByTestId('loading')).toBeInTheDocument();
    expect(screen.getByTestId('user')).toBeInTheDocument();
    expect(screen.getByTestId('error')).toBeInTheDocument();
  });

  it('throws error when used outside AuthProvider', () => {
    expect(() => render(<TestComponent />)).toThrow(
      'useAuth must be used within an AuthProvider'
    );
  });
});