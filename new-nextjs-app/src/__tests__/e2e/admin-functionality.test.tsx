/**
 * E2E Admin Functionality Tests - Squarefooot Next.js App
 * Tests admin dashboard, user management, property oversight, and analytics
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '@/contexts/AuthContext'
import AdminDashboard from '@/app/admin/page'
import AdminUsers from '@/app/admin/users/page'
import AdminProperties from '@/app/admin/properties/page'

// Mock admin user
const mockAdminUser = {
  id: 1,
  name: 'Admin User',
  email: 'admin@example.com',
  role: 'admin'
}

// Mock data
const mockUsers = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    role: 'user',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 2,
    name: 'Jane Agent',
    email: 'jane@example.com',
    role: 'agent',
    status: 'active',
    createdAt: '2024-01-02T00:00:00Z'
  },
  {
    id: 3,
    name: 'Inactive User',
    email: 'inactive@example.com',
    role: 'user',
    status: 'inactive',
    createdAt: '2024-01-03T00:00:00Z'
  }
]

const mockAnalytics = {
  totalUsers: 150,
  totalProperties: 75,
  totalAgents: 25,
  totalInquiries: 200,
  revenueThisMonth: 50000,
  propertiesSold: 12,
  newUsersThisWeek: 8,
  activeListings: 63
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
      delete: vi.fn(),
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
  usePathname: () => '/admin'
}))

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>{children}</a>
  )
}))

// Mock AuthContext with admin user
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: mockAdminUser,
    isAuthenticated: true,
    logout: vi.fn()
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
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

describe('👨‍💼 Admin Functionality Tests', () => {
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

  describe('📊 Admin Dashboard Tests', () => {
    it('renders admin dashboard with analytics', async () => {
      const axios = await import('axios')
      const mockGet = vi.mocked(axios.default.get)
      
      mockGet.mockResolvedValueOnce({
        data: mockAnalytics
      })

      render(
        <TestWrapper>
          <AdminDashboard />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText(/admin dashboard/i)).toBeInTheDocument()
        expect(screen.getByText(/150/)).toBeInTheDocument() // Total users
        expect(screen.getByText(/75/)).toBeInTheDocument()  // Total properties
        expect(screen.getByText(/25/)).toBeInTheDocument()  // Total agents
        expect(screen.getByText(/200/)).toBeInTheDocument() // Total inquiries
      })
    })

    it('displays revenue and sales metrics', async () => {
      const axios = await import('axios')
      const mockGet = vi.mocked(axios.default.get)
      
      mockGet.mockResolvedValueOnce({
        data: mockAnalytics
      })

      render(
        <TestWrapper>
          <AdminDashboard />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText(/\$50,000/)).toBeInTheDocument() // Revenue
        expect(screen.getByText(/12/)).toBeInTheDocument()       // Properties sold
        expect(screen.getByText(/8/)).toBeInTheDocument()        // New users
        expect(screen.getByText(/63/)).toBeInTheDocument()       // Active listings
      })
    })

    it('handles analytics API errors', async () => {
      const axios = await import('axios')
      const mockGet = vi.mocked(axios.default.get)
      
      mockGet.mockRejectedValueOnce(new Error('Analytics API Error'))

      render(
        <TestWrapper>
          <AdminDashboard />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText(/error loading analytics/i)).toBeInTheDocument()
      })
    })
  })

  describe('👥 User Management Tests', () => {
    it('renders users list with correct information', async () => {
      const axios = await import('axios')
      const mockGet = vi.mocked(axios.default.get)
      
      mockGet.mockResolvedValueOnce({
        data: { users: mockUsers, total: mockUsers.length }
      })

      render(
        <TestWrapper>
          <AdminUsers />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument()
        expect(screen.getByText('Jane Agent')).toBeInTheDocument()
        expect(screen.getByText('Inactive User')).toBeInTheDocument()
        expect(screen.getByText('john@example.com')).toBeInTheDocument()
        expect(screen.getByText('jane@example.com')).toBeInTheDocument()
      })
    })

    it('filters users by role', async () => {
      const axios = await import('axios')
      const mockGet = vi.mocked(axios.default.get)
      
      // Initial load - all users
      mockGet.mockResolvedValueOnce({
        data: { users: mockUsers, total: mockUsers.length }
      })

      // Filter by agents
      const agentUsers = mockUsers.filter(u => u.role === 'agent')
      mockGet.mockResolvedValueOnce({
        data: { users: agentUsers, total: agentUsers.length }
      })

      render(
        <TestWrapper>
          <AdminUsers />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument()
      })

      // Click agent filter
      const agentFilter = screen.getByRole('button', { name: /agents/i })
      await user.click(agentFilter)

      await waitFor(() => {
        expect(mockGet).toHaveBeenCalledWith('/api/admin/users', {
          params: expect.objectContaining({
            role: 'agent'
          })
        })
      })
    })

    it('searches users by name or email', async () => {
      const axios = await import('axios')
      const mockGet = vi.mocked(axios.default.get)
      
      mockGet.mockResolvedValueOnce({
        data: { users: mockUsers, total: mockUsers.length }
      })

      render(
        <TestWrapper>
          <AdminUsers />
        </TestWrapper>
      )

      const searchInput = screen.getByPlaceholderText(/search users/i)
      await user.type(searchInput, 'john')

      await waitFor(() => {
        expect(mockGet).toHaveBeenCalledWith('/api/admin/users', {
          params: expect.objectContaining({
            search: 'john'
          })
        })
      })
    })

    it('activates/deactivates user accounts', async () => {
      const axios = await import('axios')
      const mockGet = vi.mocked(axios.default.get)
      const mockPut = vi.mocked(axios.default.put)
      
      mockGet.mockResolvedValueOnce({
        data: { users: mockUsers, total: mockUsers.length }
      })

      mockPut.mockResolvedValueOnce({
        data: { message: 'User status updated' }
      })

      render(
        <TestWrapper>
          <AdminUsers />
        </TestWrapper>
      )

      await waitFor(() => {
        const statusButtons = screen.getAllByRole('button', { name: /deactivate/i })
        expect(statusButtons[0]).toBeInTheDocument()
      })

      const deactivateButton = screen.getAllByRole('button', { name: /deactivate/i })[0]
      await user.click(deactivateButton)

      await waitFor(() => {
        expect(mockPut).toHaveBeenCalledWith('/api/admin/users/1/status', {
          status: 'inactive'
        })
      })
    })

    it('deletes user accounts', async () => {
      const axios = await import('axios')
      const mockGet = vi.mocked(axios.default.get)
      const mockDelete = vi.mocked(axios.default.delete)
      
      mockGet.mockResolvedValueOnce({
        data: { users: mockUsers, total: mockUsers.length }
      })

      mockDelete.mockResolvedValueOnce({
        data: { message: 'User deleted successfully' }
      })

      render(
        <TestWrapper>
          <AdminUsers />
        </TestWrapper>
      )

      await waitFor(() => {
        const deleteButtons = screen.getAllByRole('button', { name: /delete/i })
        expect(deleteButtons[0]).toBeInTheDocument()
      })

      const deleteButton = screen.getAllByRole('button', { name: /delete/i })[0]
      await user.click(deleteButton)

      // Confirm deletion
      await waitFor(() => {
        const confirmButton = screen.getByRole('button', { name: /confirm delete/i })
        expect(confirmButton).toBeInTheDocument()
      })

      const confirmButton = screen.getByRole('button', { name: /confirm delete/i })
      await user.click(confirmButton)

      await waitFor(() => {
        expect(mockDelete).toHaveBeenCalledWith('/api/admin/users/1')
      })
    })
  })

  describe('🏘️ Property Management Tests', () => {
    it('renders property management interface', async () => {
      const axios = await import('axios')
      const mockGet = vi.mocked(axios.default.get)
      
      mockGet.mockResolvedValueOnce({
        data: { properties: [], total: 0 }
      })

      render(
        <TestWrapper>
          <AdminProperties />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText(/property management/i)).toBeInTheDocument()
        expect(screen.getByPlaceholderText(/search properties/i)).toBeInTheDocument()
      })
    })

    it('approves pending property listings', async () => {
      const axios = await import('axios')
      const mockGet = vi.mocked(axios.default.get)
      const mockPut = vi.mocked(axios.default.put)
      
      const pendingProperties = [
        {
          id: 1,
          title: 'Pending Villa',
          status: 'pending',
          agent: { name: 'Agent Name' }
        }
      ]

      mockGet.mockResolvedValueOnce({
        data: { properties: pendingProperties, total: 1 }
      })

      mockPut.mockResolvedValueOnce({
        data: { message: 'Property approved' }
      })

      render(
        <TestWrapper>
          <AdminProperties />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('Pending Villa')).toBeInTheDocument()
        const approveButton = screen.getByRole('button', { name: /approve/i })
        expect(approveButton).toBeInTheDocument()
      })

      const approveButton = screen.getByRole('button', { name: /approve/i })
      await user.click(approveButton)

      await waitFor(() => {
        expect(mockPut).toHaveBeenCalledWith('/api/admin/properties/1/status', {
          status: 'approved'
        })
      })
    })

    it('rejects problematic property listings', async () => {
      const axios = await import('axios')
      const mockGet = vi.mocked(axios.default.get)
      const mockPut = vi.mocked(axios.default.put)
      
      const pendingProperties = [
        {
          id: 1,
          title: 'Problematic Property',
          status: 'pending',
          agent: { name: 'Agent Name' }
        }
      ]

      mockGet.mockResolvedValueOnce({
        data: { properties: pendingProperties, total: 1 }
      })

      mockPut.mockResolvedValueOnce({
        data: { message: 'Property rejected' }
      })

      render(
        <TestWrapper>
          <AdminProperties />
        </TestWrapper>
      )

      await waitFor(() => {
        const rejectButton = screen.getByRole('button', { name: /reject/i })
        expect(rejectButton).toBeInTheDocument()
      })

      const rejectButton = screen.getByRole('button', { name: /reject/i })
      await user.click(rejectButton)

      await waitFor(() => {
        expect(mockPut).toHaveBeenCalledWith('/api/admin/properties/1/status', {
          status: 'rejected'
        })
      })
    })
  })

  describe('📈 Analytics Tests', () => {
    it('displays charts and graphs for data visualization', async () => {
      const axios = await import('axios')
      const mockGet = vi.mocked(axios.default.get)
      
      mockGet.mockResolvedValueOnce({
        data: {
          ...mockAnalytics,
          chartData: {
            userGrowth: [10, 15, 20, 25, 30],
            propertyTrends: [5, 8, 12, 10, 15],
            revenue: [5000, 7000, 6000, 8000, 9000]
          }
        }
      })

      render(
        <TestWrapper>
          <AdminDashboard />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText(/user growth/i)).toBeInTheDocument()
        expect(screen.getByText(/property trends/i)).toBeInTheDocument()
        expect(screen.getByText(/revenue chart/i)).toBeInTheDocument()
      })
    })
  })
})