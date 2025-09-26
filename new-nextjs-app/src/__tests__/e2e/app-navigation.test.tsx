/**
 * E2E Navigation Tests - Squarefooot Next.js App
 * Tests comprehensive navigation and page accessibility
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
// import { BrowserRouter } from 'react-router-dom' // Removed - using Next.js routing
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '@/contexts/AuthContext'
import Home from '@/app/page'
import Header from '@/components/common/Header'

// Mock Next.js modules
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>{children}</a>
  )
}))

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
  usePathname: () => '/'
}))

// Test wrapper with all providers
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

describe('🚀 E2E Navigation Tests', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false }
      }
    })
    vi.clearAllMocks()
  })

  describe('📱 Header Navigation', () => {
    it('renders header with all navigation elements', async () => {
      render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      )

      // Check logo
      expect(screen.getByAltText('Logo')).toBeInTheDocument()

      // Check navigation links
      expect(screen.getByText('Browse')).toBeInTheDocument()
      expect(screen.getByText('Plans')).toBeInTheDocument()
      expect(screen.getByText('Login')).toBeInTheDocument()
      expect(screen.getByText('Register')).toBeInTheDocument()
    })

    it('shows agent-specific navigation when logged in as agent', async () => {
      const mockAuthContext = {
        user: { name: 'John Agent', role: 'agent' },
        logout: vi.fn(),
        login: vi.fn(),
        isAuthenticated: true
      }

      vi.doMock('@/contexts/AuthContext', () => ({
        useAuth: () => mockAuthContext
      }))

      render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('Add Property')).toBeInTheDocument()
        expect(screen.getByText('J')).toBeInTheDocument() // User avatar
        expect(screen.getByText('Logout')).toBeInTheDocument()
      })
    })

    it('shows admin navigation when logged in as admin', async () => {
      const mockAuthContext = {
        user: { name: 'Admin User', role: 'admin' },
        logout: vi.fn(),
        login: vi.fn(),
        isAuthenticated: true
      }

      vi.doMock('@/contexts/AuthContext', () => ({
        useAuth: () => mockAuthContext
      }))

      render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('ADMIN')).toBeInTheDocument()
        expect(screen.getByText('A')).toBeInTheDocument() // User avatar
      })
    })
  })

  describe('🏠 Homepage Tests', () => {
    it('renders homepage with hero section', async () => {
      render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      )

      await waitFor(() => {
        // Check for hero section elements
        expect(screen.getByText(/Find Your Dream Property/i)).toBeInTheDocument()
        expect(screen.getByText(/Modern, Affordable & Luxurious Properties/i)).toBeInTheDocument()
      })
    })

    it('displays property type filters', async () => {
      render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('ALL')).toBeInTheDocument()
        expect(screen.getByText('BUY')).toBeInTheDocument()
        expect(screen.getByText('RENT')).toBeInTheDocument()
        expect(screen.getByText('COMMERCIAL')).toBeInTheDocument()
      })
    })
  })
})