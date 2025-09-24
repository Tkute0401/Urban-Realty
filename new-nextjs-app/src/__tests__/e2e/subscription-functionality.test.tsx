/**
 * E2E Subscription Functionality Tests - Urban Realty Next.js App
 * Tests subscription plans, billing, payment processing, and plan management
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '@/contexts/AuthContext'
import Subscriptions from '@/app/subscriptions/page'
import BillingDashboard from '@/app/billing-dashboard/page'

// Mock user data
const mockUser = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
  role: 'user',
  subscription: {
    plan: 'Basic',
    status: 'active',
    expiresAt: '2024-12-31T23:59:59Z'
  }
}

// Mock subscription plans
const mockPlans = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    interval: 'month',
    features: [
      'Browse properties',
      'Basic search',
      'Contact agents',
      'Save favorites (up to 5)'
    ],
    limits: {
      favorites: 5,
      inquiries: 10
    }
  },
  {
    id: 'basic',
    name: 'Basic',
    price: 29,
    interval: 'month',
    features: [
      'All Free features',
      'Advanced search filters',
      'Property alerts',
      'Save unlimited favorites',
      'Priority support'
    ],
    limits: {
      favorites: -1,
      inquiries: 100
    }
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 299,
    interval: 'month',
    features: [
      'All Basic features',
      'API access',
      'Custom integrations',
      'Dedicated account manager',
      'White-label options'
    ],
    limits: {
      favorites: -1,
      inquiries: -1
    }
  }
]

// Mock billing data
const mockBillingData = {
  currentPlan: mockPlans[1],
  nextBilling: '2024-02-01T00:00:00Z',
  billingHistory: [
    {
      id: 1,
      date: '2024-01-01T00:00:00Z',
      amount: 29,
      status: 'paid',
      invoice: 'INV-001'
    },
    {
      id: 2,
      date: '2023-12-01T00:00:00Z',
      amount: 29,
      status: 'paid',
      invoice: 'INV-002'
    }
  ]
}

// Mock axios
vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    create: () => ({
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
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
    get: vi.fn().mockReturnValue(null)
  }),
  usePathname: () => '/subscriptions'
}))

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>{children}</a>
  )
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

describe('💳 Subscription Functionality Tests', () => {
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

  describe('📋 Subscription Plans Display', () => {
    it('renders all subscription plans with correct information', async () => {
      render(
        <TestWrapper>
          <Subscriptions />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('Free')).toBeInTheDocument()
        expect(screen.getByText('Basic')).toBeInTheDocument()
        expect(screen.getByText('Enterprise')).toBeInTheDocument()
        
        expect(screen.getByText('$0')).toBeInTheDocument()
        expect(screen.getByText('$29')).toBeInTheDocument()
        expect(screen.getByText('$299')).toBeInTheDocument()
      })
    })

    it('displays plan features correctly', async () => {
      render(
        <TestWrapper>
          <Subscriptions />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('Browse properties')).toBeInTheDocument()
        expect(screen.getByText('Advanced search filters')).toBeInTheDocument()
        expect(screen.getByText('API access')).toBeInTheDocument()
        expect(screen.getByText('Dedicated account manager')).toBeInTheDocument()
      })
    })

    it('shows monthly/yearly billing toggle', async () => {
      render(
        <TestWrapper>
          <Subscriptions />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('Monthly')).toBeInTheDocument()
        expect(screen.getByText('Yearly')).toBeInTheDocument()
      })

      const yearlyToggle = screen.getByRole('button', { name: /yearly/i })
      await user.click(yearlyToggle)

      await waitFor(() => {
        // Yearly prices should be displayed (with discount)
        expect(screen.getByText('$348')).toBeInTheDocument() // $29 * 12 with discount
        expect(screen.getByText('$3588')).toBeInTheDocument() // $299 * 12 with discount
      })
    })
  })

  describe('🛒 Plan Selection and Checkout', () => {
    it('allows selecting a plan and proceeding to checkout', async () => {
      const axios = await import('axios')
      const mockPost = vi.mocked(axios.default.post)
      
      mockPost.mockResolvedValueOnce({
        data: { 
          checkoutUrl: 'https://stripe.com/checkout/session_123',
          sessionId: 'cs_session_123'
        }
      })

      render(
        <TestWrapper>
          <Subscriptions />
        </TestWrapper>
      )

      await waitFor(() => {
        const basicButton = screen.getByRole('button', { name: /choose basic/i })
        expect(basicButton).toBeInTheDocument()
      })

      const basicButton = screen.getByRole('button', { name: /choose basic/i })
      await user.click(basicButton)

      await waitFor(() => {
        expect(mockPost).toHaveBeenCalledWith('/api/subscriptions/create-checkout-session', {
          planId: 'basic',
          interval: 'month'
        })
      })
    })

    it('handles authentication requirement for paid plans', async () => {
      // Mock unauthenticated state
      vi.doMock('@/contexts/AuthContext', () => ({
        useAuth: () => ({
          user: null,
          isAuthenticated: false,
          login: vi.fn()
        })
      }))

      render(
        <TestWrapper>
          <Subscriptions />
        </TestWrapper>
      )

      await waitFor(() => {
        const basicButton = screen.getByRole('button', { name: /choose basic/i })
        expect(basicButton).toBeInTheDocument()
      })

      const basicButton = screen.getByRole('button', { name: /choose basic/i })
      await user.click(basicButton)

      await waitFor(() => {
        expect(screen.getByText(/please log in to subscribe/i)).toBeInTheDocument()
      })
    })

    it('shows upgrade options for existing subscribers', async () => {
      // Mock authenticated user with current subscription
      vi.doMock('@/contexts/AuthContext', () => ({
        useAuth: () => ({
          user: mockUser,
          isAuthenticated: true
        })
      }))

      render(
        <TestWrapper>
          <Subscriptions />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText(/current plan/i)).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /upgrade to enterprise/i })).toBeInTheDocument()
      })
    })
  })

  describe('💰 Billing Dashboard Tests', () => {
    it('renders billing dashboard with current plan info', async () => {
      const axios = await import('axios')
      const mockGet = vi.mocked(axios.default.get)
      
      mockGet.mockResolvedValueOnce({
        data: mockBillingData
      })

      render(
        <TestWrapper>
          <BillingDashboard />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText(/billing dashboard/i)).toBeInTheDocument()
        expect(screen.getByText(/current plan/i)).toBeInTheDocument()
        expect(screen.getByText('Basic')).toBeInTheDocument()
        expect(screen.getByText('$29/month')).toBeInTheDocument()
      })
    })

    it('displays billing history', async () => {
      const axios = await import('axios')
      const mockGet = vi.mocked(axios.default.get)
      
      mockGet.mockResolvedValueOnce({
        data: mockBillingData
      })

      render(
        <TestWrapper>
          <BillingDashboard />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText(/billing history/i)).toBeInTheDocument()
        expect(screen.getByText('INV-001')).toBeInTheDocument()
        expect(screen.getByText('INV-002')).toBeInTheDocument()
        expect(screen.getAllByText('$29')).toHaveLength(2) // Current plan + history
      })
    })

    it('allows downloading invoices', async () => {
      const axios = await import('axios')
      const mockGet = vi.mocked(axios.default.get)
      
      mockGet.mockResolvedValueOnce({
        data: mockBillingData
      })

      // Mock PDF download
      mockGet.mockResolvedValueOnce({
        data: 'PDF content',
        headers: { 'content-type': 'application/pdf' }
      })

      render(
        <TestWrapper>
          <BillingDashboard />
        </TestWrapper>
      )

      await waitFor(() => {
        const downloadButtons = screen.getAllByRole('button', { name: /download/i })
        expect(downloadButtons[0]).toBeInTheDocument()
      })

      const downloadButton = screen.getAllByRole('button', { name: /download/i })[0]
      await user.click(downloadButton)

      await waitFor(() => {
        expect(mockGet).toHaveBeenCalledWith('/api/billing/invoice/INV-001')
      })
    })

    it('allows updating payment method', async () => {
      const axios = await import('axios')
      const mockGet = vi.mocked(axios.default.get)
      const mockPost = vi.mocked(axios.default.post)
      
      mockGet.mockResolvedValueOnce({
        data: mockBillingData
      })

      mockPost.mockResolvedValueOnce({
        data: { 
          setupIntentSecret: 'seti_secret_123',
          message: 'Payment method update initiated'
        }
      })

      render(
        <TestWrapper>
          <BillingDashboard />
        </TestWrapper>
      )

      await waitFor(() => {
        const updatePaymentButton = screen.getByRole('button', { name: /update payment method/i })
        expect(updatePaymentButton).toBeInTheDocument()
      })

      const updatePaymentButton = screen.getByRole('button', { name: /update payment method/i })
      await user.click(updatePaymentButton)

      await waitFor(() => {
        expect(mockPost).toHaveBeenCalledWith('/api/billing/update-payment-method')
      })
    })

    it('allows canceling subscription', async () => {
      const axios = await import('axios')
      const mockGet = vi.mocked(axios.default.get)
      const mockDelete = vi.mocked(axios.default.delete)
      
      mockGet.mockResolvedValueOnce({
        data: mockBillingData
      })

      mockDelete.mockResolvedValueOnce({
        data: { message: 'Subscription canceled successfully' }
      })

      render(
        <TestWrapper>
          <BillingDashboard />
        </TestWrapper>
      )

      await waitFor(() => {
        const cancelButton = screen.getByRole('button', { name: /cancel subscription/i })
        expect(cancelButton).toBeInTheDocument()
      })

      const cancelButton = screen.getByRole('button', { name: /cancel subscription/i })
      await user.click(cancelButton)

      // Confirm cancellation
      await waitFor(() => {
        const confirmButton = screen.getByRole('button', { name: /confirm cancellation/i })
        expect(confirmButton).toBeInTheDocument()
      })

      const confirmButton = screen.getByRole('button', { name: /confirm cancellation/i })
      await user.click(confirmButton)

      await waitFor(() => {
        expect(mockDelete).toHaveBeenCalledWith('/api/subscriptions/cancel')
      })
    })
  })

  describe('🔄 Plan Changes Tests', () => {
    it('handles plan upgrades', async () => {
      const axios = await import('axios')
      const mockPost = vi.mocked(axios.default.post)
      
      mockPost.mockResolvedValueOnce({
        data: { 
          message: 'Plan upgraded successfully',
          newPlan: 'Enterprise'
        }
      })

      render(
        <TestWrapper>
          <Subscriptions />
        </TestWrapper>
      )

      await waitFor(() => {
        const upgradeButton = screen.getByRole('button', { name: /upgrade to enterprise/i })
        expect(upgradeButton).toBeInTheDocument()
      })

      const upgradeButton = screen.getByRole('button', { name: /upgrade to enterprise/i })
      await user.click(upgradeButton)

      await waitFor(() => {
        expect(mockPost).toHaveBeenCalledWith('/api/subscriptions/change-plan', {
          newPlanId: 'enterprise'
        })
      })
    })

    it('handles plan downgrades with confirmation', async () => {
      const axios = await import('axios')
      const mockPost = vi.mocked(axios.default.post)
      
      mockPost.mockResolvedValueOnce({
        data: { 
          message: 'Plan downgraded successfully',
          newPlan: 'Free'
        }
      })

      render(
        <TestWrapper>
          <Subscriptions />
        </TestWrapper>
      )

      await waitFor(() => {
        const downgradeButton = screen.getByRole('button', { name: /downgrade to free/i })
        expect(downgradeButton).toBeInTheDocument()
      })

      const downgradeButton = screen.getByRole('button', { name: /downgrade to free/i })
      await user.click(downgradeButton)

      // Confirm downgrade warning
      await waitFor(() => {
        expect(screen.getByText(/are you sure you want to downgrade/i)).toBeInTheDocument()
        const confirmButton = screen.getByRole('button', { name: /confirm downgrade/i })
        expect(confirmButton).toBeInTheDocument()
      })

      const confirmButton = screen.getByRole('button', { name: /confirm downgrade/i })
      await user.click(confirmButton)

      await waitFor(() => {
        expect(mockPost).toHaveBeenCalledWith('/api/subscriptions/change-plan', {
          newPlanId: 'free'
        })
      })
    })
  })

  describe('⚠️ Usage Limits Tests', () => {
    it('displays usage limits and current usage', async () => {
      const axios = await import('axios')
      const mockGet = vi.mocked(axios.default.get)
      
      mockGet.mockResolvedValueOnce({
        data: {
          ...mockBillingData,
          usage: {
            favorites: 25,
            inquiries: 45
          }
        }
      })

      render(
        <TestWrapper>
          <BillingDashboard />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText(/usage this month/i)).toBeInTheDocument()
        expect(screen.getByText(/25 favorites/i)).toBeInTheDocument()
        expect(screen.getByText(/45 inquiries/i)).toBeInTheDocument()
      })
    })

    it('shows upgrade prompts when approaching limits', async () => {
      const axios = await import('axios')
      const mockGet = vi.mocked(axios.default.get)
      
      mockGet.mockResolvedValueOnce({
        data: {
          ...mockBillingData,
          currentPlan: mockPlans[0], // Free plan
          usage: {
            favorites: 4, // Close to limit of 5
            inquiries: 9  // Close to limit of 10
          }
        }
      })

      render(
        <TestWrapper>
          <BillingDashboard />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText(/you're approaching your limit/i)).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /upgrade now/i })).toBeInTheDocument()
      })
    })
  })
})