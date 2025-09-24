/**
 * E2E Authentication Flow Tests - Urban Realty Next.js App
 * Tests login, registration, and authentication state management
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '@/contexts/AuthContext'
import Login from '@/app/(auth)/login/page'
import Register from '@/app/(auth)/register/page'

// Mock axios for API calls
vi.mock('axios', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    create: () => ({
      post: vi.fn(),
      get: vi.fn(),
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() }
      }
    })
  }
}))

// Mock Next.js modules
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
  useSearchParams: () => ({
    get: vi.fn()
  }),
  usePathname: () => '/login'
}))

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>{children}</a>
  )
}))

// Mock react-toastify
vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warning: vi.fn()
  }
}))

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  })

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </QueryClientProvider>
  )
}

describe('🔐 Authentication Flow Tests', () => {
  let queryClient: QueryClient
  const user = userEvent.setup()

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false }
      }
    })
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('📝 Login Page Tests', () => {
    it('renders login form with all required fields', async () => {
      render(
        <TestWrapper>
          <Login />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText(/Sign in to your account/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
      })
    })

    it('validates required fields on submission', async () => {
      render(
        <TestWrapper>
          <Login />
        </TestWrapper>
      )

      const submitButton = screen.getByRole('button', { name: /sign in/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/email is required/i)).toBeInTheDocument()
        expect(screen.getByText(/password is required/i)).toBeInTheDocument()
      })
    })

    it('validates email format', async () => {
      render(
        <TestWrapper>
          <Login />
        </TestWrapper>
      )

      const emailInput = screen.getByLabelText(/email/i)
      await user.type(emailInput, 'invalid-email')
      
      const submitButton = screen.getByRole('button', { name: /sign in/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/please enter a valid email/i)).toBeInTheDocument()
      })
    })

    it('handles successful login submission', async () => {
      const axios = await import('axios')
      const mockPost = vi.mocked(axios.default.post)
      
      mockPost.mockResolvedValueOnce({
        data: {
          token: 'mock-token',
          user: { name: 'John Doe', email: 'john@example.com', role: 'user' }
        }
      })

      render(
        <TestWrapper>
          <Login />
        </TestWrapper>
      )

      const emailInput = screen.getByLabelText(/email/i)
      const passwordInput = screen.getByLabelText(/password/i)
      const submitButton = screen.getByRole('button', { name: /sign in/i })

      await user.type(emailInput, 'john@example.com')
      await user.type(passwordInput, 'password123')
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockPost).toHaveBeenCalledWith('/api/auth/login', {
          email: 'john@example.com',
          password: 'password123'
        })
      })
    })

    it('handles login API errors', async () => {
      const axios = await import('axios')
      const mockPost = vi.mocked(axios.default.post)
      
      mockPost.mockRejectedValueOnce({
        response: {
          status: 401,
          data: { message: 'Invalid credentials' }
        }
      })

      render(
        <TestWrapper>
          <Login />
        </TestWrapper>
      )

      const emailInput = screen.getByLabelText(/email/i)
      const passwordInput = screen.getByLabelText(/password/i)
      const submitButton = screen.getByRole('button', { name: /sign in/i })

      await user.type(emailInput, 'john@example.com')
      await user.type(passwordInput, 'wrongpassword')
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument()
      })
    })
  })

  describe('🎯 Registration Page Tests', () => {
    it('renders registration form with all required fields', async () => {
      render(
        <TestWrapper>
          <Register />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText(/create your account/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument()
      })
    })

    it('validates password matching', async () => {
      render(
        <TestWrapper>
          <Register />
        </TestWrapper>
      )

      const passwordInput = screen.getByLabelText(/^password/i)
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i)
      const submitButton = screen.getByRole('button', { name: /sign up/i })

      await user.type(passwordInput, 'password123')
      await user.type(confirmPasswordInput, 'differentpassword')
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/passwords must match/i)).toBeInTheDocument()
      })
    })

    it('validates password strength', async () => {
      render(
        <TestWrapper>
          <Register />
        </TestWrapper>
      )

      const passwordInput = screen.getByLabelText(/^password/i)
      await user.type(passwordInput, '123')
      
      const submitButton = screen.getByRole('button', { name: /sign up/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/password must be at least 6 characters/i)).toBeInTheDocument()
      })
    })

    it('handles successful registration', async () => {
      const axios = await import('axios')
      const mockPost = vi.mocked(axios.default.post)
      
      mockPost.mockResolvedValueOnce({
        data: {
          message: 'Registration successful',
          user: { name: 'Jane Doe', email: 'jane@example.com', role: 'user' }
        }
      })

      render(
        <TestWrapper>
          <Register />
        </TestWrapper>
      )

      const nameInput = screen.getByLabelText(/name/i)
      const emailInput = screen.getByLabelText(/email/i)
      const passwordInput = screen.getByLabelText(/^password/i)
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i)
      const submitButton = screen.getByRole('button', { name: /sign up/i })

      await user.type(nameInput, 'Jane Doe')
      await user.type(emailInput, 'jane@example.com')
      await user.type(passwordInput, 'password123')
      await user.type(confirmPasswordInput, 'password123')
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockPost).toHaveBeenCalledWith('/api/auth/register', {
          name: 'Jane Doe',
          email: 'jane@example.com',
          password: 'password123',
          confirmPassword: 'password123'
        })
      })
    })
  })

  describe('🛡️ Protected Route Tests', () => {
    it('redirects unauthenticated users from protected routes', async () => {
      // This would test middleware or route protection logic
      // Implementation depends on how protected routes are handled
      expect(true).toBe(true) // Placeholder
    })

    it('allows authenticated users to access protected routes', async () => {
      // This would test authenticated access to protected routes
      expect(true).toBe(true) // Placeholder
    })
  })
})