/**
 * E2E Agent Functionality Tests - Urban Realty Next.js App
 * Tests agent dashboard, property management, lead handling, and analytics
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '@/contexts/AuthContext'
import AgentDashboard from '@/app/agent/page'
import AddProperty from '@/app/add-property/page'

// Mock agent user
const mockAgentUser = {
  id: 1,
  name: 'Agent John',
  email: 'agent@example.com',
  role: 'agent'
}

// Mock data
const mockAgentProperties = [
  {
    id: 1,
    title: 'Agent\'s Villa',
    price: 750000,
    status: 'active',
    views: 125,
    inquiries: 8,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 2,
    title: 'Pending Apartment',
    price: 350000,
    status: 'pending',
    views: 45,
    inquiries: 3,
    createdAt: '2024-01-02T00:00:00Z'
  }
]

const mockLeads = [
  {
    id: 1,
    name: 'Potential Buyer',
    email: 'buyer@example.com',
    phone: '+1234567890',
    propertyId: 1,
    propertyTitle: 'Agent\'s Villa',
    message: 'Interested in viewing this property',
    status: 'new',
    createdAt: '2024-01-03T00:00:00Z'
  },
  {
    id: 2,
    name: 'Another Lead',
    email: 'lead@example.com',
    phone: '+1234567891',
    propertyId: 2,
    propertyTitle: 'Pending Apartment',
    message: 'Would like more information',
    status: 'contacted',
    createdAt: '2024-01-04T00:00:00Z'
  }
]

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
  usePathname: () => '/agent'
}))

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>{children}</a>
  )
}))

// Mock AuthContext with agent user
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: mockAgentUser,
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

describe('🏢 Agent Functionality Tests', () => {
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

  describe('📊 Agent Dashboard Tests', () => {
    it('renders agent dashboard with property overview', async () => {
      const axios = await import('axios')
      const mockGet = vi.mocked(axios.default.get)
      
      mockGet.mockResolvedValueOnce({
        data: { properties: mockAgentProperties, total: mockAgentProperties.length }
      })
      
      mockGet.mockResolvedValueOnce({
        data: { leads: mockLeads, total: mockLeads.length }
      })

      render(
        <TestWrapper>
          <AgentDashboard />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText(/agent dashboard/i)).toBeInTheDocument()
        expect(screen.getByText(/my properties/i)).toBeInTheDocument()
        expect(screen.getByText(/recent leads/i)).toBeInTheDocument()
      })
    })

    it('displays property statistics', async () => {
      const axios = await import('axios')
      const mockGet = vi.mocked(axios.default.get)
      
      mockGet.mockResolvedValueOnce({
        data: { 
          properties: mockAgentProperties, 
          total: mockAgentProperties.length,
          stats: {
            totalViews: 170,
            totalInquiries: 11,
            activeListings: 1,
            pendingListings: 1
          }
        }
      })

      render(
        <TestWrapper>
          <AgentDashboard />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText(/170/)).toBeInTheDocument() // Total views
        expect(screen.getByText(/11/)).toBeInTheDocument()  // Total inquiries
      })
    })

    it('shows recent leads with contact information', async () => {
      const axios = await import('axios')
      const mockGet = vi.mocked(axios.default.get)
      
      mockGet.mockResolvedValueOnce({
        data: { properties: mockAgentProperties, total: mockAgentProperties.length }
      })
      
      mockGet.mockResolvedValueOnce({
        data: { leads: mockLeads, total: mockLeads.length }
      })

      render(
        <TestWrapper>
          <AgentDashboard />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('Potential Buyer')).toBeInTheDocument()
        expect(screen.getByText('buyer@example.com')).toBeInTheDocument()
        expect(screen.getByText('Another Lead')).toBeInTheDocument()
        expect(screen.getByText('lead@example.com')).toBeInTheDocument()
      })
    })
  })

  describe('🏠 Property Management Tests', () => {
    it('displays agent properties with status indicators', async () => {
      const axios = await import('axios')
      const mockGet = vi.mocked(axios.default.get)
      
      mockGet.mockResolvedValueOnce({
        data: { properties: mockAgentProperties, total: mockAgentProperties.length }
      })

      render(
        <TestWrapper>
          <AgentDashboard />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('Agent\'s Villa')).toBeInTheDocument()
        expect(screen.getByText('Pending Apartment')).toBeInTheDocument()
        expect(screen.getByText(/active/i)).toBeInTheDocument()
        expect(screen.getByText(/pending/i)).toBeInTheDocument()
      })
    })

    it('allows editing property details', async () => {
      const axios = await import('axios')
      const mockGet = vi.mocked(axios.default.get)
      
      mockGet.mockResolvedValueOnce({
        data: { properties: mockAgentProperties, total: mockAgentProperties.length }
      })

      render(
        <TestWrapper>
          <AgentDashboard />
        </TestWrapper>
      )

      await waitFor(() => {
        const editButtons = screen.getAllByRole('button', { name: /edit/i })
        expect(editButtons[0]).toBeInTheDocument()
      })

      const editButton = screen.getAllByRole('button', { name: /edit/i })[0]
      await user.click(editButton)

      // Should navigate to edit page
      expect(editButton.closest('a')).toHaveAttribute('href', '/properties/1/edit')
    })

    it('allows deleting properties', async () => {
      const axios = await import('axios')
      const mockGet = vi.mocked(axios.default.get)
      const mockDelete = vi.mocked(axios.default.delete)
      
      mockGet.mockResolvedValueOnce({
        data: { properties: mockAgentProperties, total: mockAgentProperties.length }
      })

      mockDelete.mockResolvedValueOnce({
        data: { message: 'Property deleted successfully' }
      })

      render(
        <TestWrapper>
          <AgentDashboard />
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
        expect(mockDelete).toHaveBeenCalledWith('/api/properties/1')
      })
    })
  })

  describe('➕ Add Property Tests', () => {
    it('renders add property form with all required fields', async () => {
      render(
        <TestWrapper>
          <AddProperty />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText(/add new property/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/title/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/price/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/location/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/description/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/property type/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/category/i)).toBeInTheDocument()
      })
    })

    it('validates required fields on submission', async () => {
      render(
        <TestWrapper>
          <AddProperty />
        </TestWrapper>
      )

      const submitButton = screen.getByRole('button', { name: /submit property/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/title is required/i)).toBeInTheDocument()
        expect(screen.getByText(/price is required/i)).toBeInTheDocument()
        expect(screen.getByText(/location is required/i)).toBeInTheDocument()
      })
    })

    it('handles image upload', async () => {
      const axios = await import('axios')
      const mockPost = vi.mocked(axios.default.post)
      
      render(
        <TestWrapper>
          <AddProperty />
        </TestWrapper>
      )

      const fileInput = screen.getByLabelText(/property images/i)
      const file = new File(['test image'], 'property.jpg', { type: 'image/jpeg' })
      
      await user.upload(fileInput, file)

      await waitFor(() => {
        expect(fileInput.files).toHaveLength(1)
        expect(fileInput.files?.[0]).toBe(file)
      })
    })

    it('submits property successfully', async () => {
      const axios = await import('axios')
      const mockPost = vi.mocked(axios.default.post)
      
      mockPost.mockResolvedValueOnce({
        data: { 
          id: 3,
          message: 'Property added successfully',
          property: {
            title: 'New Villa',
            price: 500000,
            location: 'New Location',
            status: 'pending'
          }
        }
      })

      render(
        <TestWrapper>
          <AddProperty />
        </TestWrapper>
      )

      const titleInput = screen.getByLabelText(/title/i)
      const priceInput = screen.getByLabelText(/price/i)
      const locationInput = screen.getByLabelText(/location/i)
      const descriptionInput = screen.getByLabelText(/description/i)
      const submitButton = screen.getByRole('button', { name: /submit property/i })

      await user.type(titleInput, 'New Villa')
      await user.type(priceInput, '500000')
      await user.type(locationInput, 'New Location')
      await user.type(descriptionInput, 'Beautiful new villa with modern amenities')
      
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockPost).toHaveBeenCalledWith('/api/properties', expect.objectContaining({
          title: 'New Villa',
          price: 500000,
          location: 'New Location',
          description: 'Beautiful new villa with modern amenities'
        }))
      })
    })
  })

  describe('📞 Lead Management Tests', () => {
    it('updates lead status', async () => {
      const axios = await import('axios')
      const mockGet = vi.mocked(axios.default.get)
      const mockPut = vi.mocked(axios.default.put)
      
      mockGet.mockResolvedValueOnce({
        data: { properties: mockAgentProperties, total: mockAgentProperties.length }
      })
      
      mockGet.mockResolvedValueOnce({
        data: { leads: mockLeads, total: mockLeads.length }
      })

      mockPut.mockResolvedValueOnce({
        data: { message: 'Lead status updated' }
      })

      render(
        <TestWrapper>
          <AgentDashboard />
        </TestWrapper>
      )

      await waitFor(() => {
        const statusButtons = screen.getAllByRole('button', { name: /mark as contacted/i })
        expect(statusButtons[0]).toBeInTheDocument()
      })

      const statusButton = screen.getAllByRole('button', { name: /mark as contacted/i })[0]
      await user.click(statusButton)

      await waitFor(() => {
        expect(mockPut).toHaveBeenCalledWith('/api/leads/1/status', {
          status: 'contacted'
        })
      })
    })

    it('responds to lead inquiries', async () => {
      const axios = await import('axios')
      const mockGet = vi.mocked(axios.default.get)
      const mockPost = vi.mocked(axios.default.post)
      
      mockGet.mockResolvedValueOnce({
        data: { properties: mockAgentProperties, total: mockAgentProperties.length }
      })
      
      mockGet.mockResolvedValueOnce({
        data: { leads: mockLeads, total: mockLeads.length }
      })

      mockPost.mockResolvedValueOnce({
        data: { message: 'Response sent successfully' }
      })

      render(
        <TestWrapper>
          <AgentDashboard />
        </TestWrapper>
      )

      await waitFor(() => {
        const replyButtons = screen.getAllByRole('button', { name: /reply/i })
        expect(replyButtons[0]).toBeInTheDocument()
      })

      const replyButton = screen.getAllByRole('button', { name: /reply/i })[0]
      await user.click(replyButton)

      // Should open reply modal
      await waitFor(() => {
        expect(screen.getByText(/reply to potential buyer/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/message/i)).toBeInTheDocument()
      })

      const messageInput = screen.getByLabelText(/message/i)
      const sendButton = screen.getByRole('button', { name: /send reply/i })

      await user.type(messageInput, 'Thank you for your interest! I would be happy to schedule a viewing.')
      await user.click(sendButton)

      await waitFor(() => {
        expect(mockPost).toHaveBeenCalledWith('/api/leads/1/reply', {
          message: 'Thank you for your interest! I would be happy to schedule a viewing.'
        })
      })
    })
  })

  describe('📊 Agent Analytics Tests', () => {
    it('displays performance metrics', async () => {
      const axios = await import('axios')
      const mockGet = vi.mocked(axios.default.get)
      
      mockGet.mockResolvedValueOnce({
        data: { 
          properties: mockAgentProperties, 
          total: mockAgentProperties.length,
          analytics: {
            totalViews: 170,
            conversionRate: 6.5,
            avgResponseTime: '2 hours',
            topPerformingProperty: 'Agent\'s Villa'
          }
        }
      })

      render(
        <TestWrapper>
          <AgentDashboard />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText(/170/)).toBeInTheDocument() // Total views
        expect(screen.getByText(/6.5%/)).toBeInTheDocument() // Conversion rate
        expect(screen.getByText(/2 hours/)).toBeInTheDocument() // Response time
      })
    })
  })
})