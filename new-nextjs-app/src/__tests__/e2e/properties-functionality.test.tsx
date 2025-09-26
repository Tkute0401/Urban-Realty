/**
 * E2E Properties Functionality Tests - Squarefooot Next.js App
 * Tests property listing, filtering, viewing, and management
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '@/contexts/AuthContext'
import Properties from '@/app/properties/page'

// Mock data
const mockProperties = [
  {
    id: 1,
    title: 'Luxury Villa in Downtown',
    price: 850000,
    location: 'Downtown, City Center',
    type: 'villa',
    category: 'BUY',
    area: 2500,
    bedrooms: 4,
    bathrooms: 3,
    images: ['/building_1.jpg'],
    description: 'Beautiful luxury villa with modern amenities',
    agent: { name: 'John Agent', phone: '+1234567890' },
    featured: true,
    status: 'available'
  },
  {
    id: 2,
    title: 'Modern Apartment for Rent',
    price: 2500,
    location: 'Suburb Area',
    type: 'apartment',
    category: 'RENT',
    area: 1200,
    bedrooms: 2,
    bathrooms: 2,
    images: ['/building_2.jpg'],
    description: 'Cozy apartment in quiet neighborhood',
    agent: { name: 'Jane Agent', phone: '+1234567891' },
    featured: false,
    status: 'available'
  },
  {
    id: 3,
    title: 'Commercial Office Space',
    price: 5000,
    location: 'Business District',
    type: 'office',
    category: 'COMMERCIAL',
    area: 3000,
    bedrooms: 0,
    bathrooms: 2,
    images: ['/building_3.jpg'],
    description: 'Prime commercial space for businesses',
    agent: { name: 'Bob Agent', phone: '+1234567892' },
    featured: true,
    status: 'available'
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
    get: vi.fn().mockReturnValue(null),
    getAll: vi.fn().mockReturnValue([]),
    has: vi.fn().mockReturnValue(false)
  }),
  usePathname: () => '/properties'
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

describe('🏘️ Properties Functionality Tests', () => {
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

  describe('📋 Properties Listing Tests', () => {
    it('renders properties page with filters and search', async () => {
      const axios = await import('axios')
      const mockGet = vi.mocked(axios.default.get)
      
      mockGet.mockResolvedValueOnce({
        data: { properties: mockProperties, total: mockProperties.length }
      })

      render(
        <TestWrapper>
          <Properties />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText(/properties/i)).toBeInTheDocument()
        expect(screen.getByPlaceholderText(/search properties/i)).toBeInTheDocument()
      })
    })

    it('displays property cards with correct information', async () => {
      const axios = await import('axios')
      const mockGet = vi.mocked(axios.default.get)
      
      mockGet.mockResolvedValueOnce({
        data: { properties: mockProperties, total: mockProperties.length }
      })

      render(
        <TestWrapper>
          <Properties />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('Luxury Villa in Downtown')).toBeInTheDocument()
        expect(screen.getByText('Modern Apartment for Rent')).toBeInTheDocument()
        expect(screen.getByText('Commercial Office Space')).toBeInTheDocument()
      })

      // Check property details
      expect(screen.getByText('$850,000')).toBeInTheDocument()
      expect(screen.getByText('4 bed')).toBeInTheDocument()
      expect(screen.getByText('3 bath')).toBeInTheDocument()
      expect(screen.getByText('2,500 sqft')).toBeInTheDocument()
    })

    it('filters properties by category', async () => {
      const axios = await import('axios')
      const mockGet = vi.mocked(axios.default.get)
      
      // Initial load - all properties
      mockGet.mockResolvedValueOnce({
        data: { properties: mockProperties, total: mockProperties.length }
      })

      // Filter by RENT
      const rentProperties = mockProperties.filter(p => p.category === 'RENT')
      mockGet.mockResolvedValueOnce({
        data: { properties: rentProperties, total: rentProperties.length }
      })

      render(
        <TestWrapper>
          <Properties />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('Luxury Villa in Downtown')).toBeInTheDocument()
      })

      // Click RENT filter
      const rentFilter = screen.getByText('RENT')
      await user.click(rentFilter)

      await waitFor(() => {
        expect(mockGet).toHaveBeenCalledWith('/api/properties', {
          params: expect.objectContaining({
            category: 'RENT'
          })
        })
      })
    })

    it('searches properties by text', async () => {
      const axios = await import('axios')
      const mockGet = vi.mocked(axios.default.get)
      
      // Initial load
      mockGet.mockResolvedValueOnce({
        data: { properties: mockProperties, total: mockProperties.length }
      })

      // Search results
      const searchResults = mockProperties.filter(p => 
        p.title.toLowerCase().includes('villa')
      )
      mockGet.mockResolvedValueOnce({
        data: { properties: searchResults, total: searchResults.length }
      })

      render(
        <TestWrapper>
          <Properties />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/search properties/i)).toBeInTheDocument()
      })

      const searchInput = screen.getByPlaceholderText(/search properties/i)
      await user.type(searchInput, 'villa')

      await waitFor(() => {
        expect(mockGet).toHaveBeenCalledWith('/api/properties', {
          params: expect.objectContaining({
            search: 'villa'
          })
        })
      })
    })

    it('filters properties by price range', async () => {
      const axios = await import('axios')
      const mockGet = vi.mocked(axios.default.get)
      
      mockGet.mockResolvedValueOnce({
        data: { properties: mockProperties, total: mockProperties.length }
      })

      render(
        <TestWrapper>
          <Properties />
        </TestWrapper>
      )

      await waitFor(() => {
        const priceFilter = screen.getByText(/price range/i)
        expect(priceFilter).toBeInTheDocument()
      })

      // Test price range filtering
      const minPriceInput = screen.getByPlaceholderText(/min price/i)
      const maxPriceInput = screen.getByPlaceholderText(/max price/i)

      await user.type(minPriceInput, '100000')
      await user.type(maxPriceInput, '500000')

      await waitFor(() => {
        expect(mockGet).toHaveBeenCalledWith('/api/properties', {
          params: expect.objectContaining({
            minPrice: 100000,
            maxPrice: 500000
          })
        })
      })
    })

    it('handles API errors gracefully', async () => {
      const axios = await import('axios')
      const mockGet = vi.mocked(axios.default.get)
      
      mockGet.mockRejectedValueOnce(new Error('API Error'))

      render(
        <TestWrapper>
          <Properties />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText(/error loading properties/i)).toBeInTheDocument()
      })
    })
  })

  describe('🏠 Individual Property Tests', () => {
    it('navigates to property details page', async () => {
      const axios = await import('axios')
      const mockGet = vi.mocked(axios.default.get)
      
      mockGet.mockResolvedValueOnce({
        data: { properties: mockProperties, total: mockProperties.length }
      })

      render(
        <TestWrapper>
          <Properties />
        </TestWrapper>
      )

      await waitFor(() => {
        const propertyLink = screen.getByText('Luxury Villa in Downtown')
        expect(propertyLink).toBeInTheDocument()
        expect(propertyLink.closest('a')).toHaveAttribute('href', '/properties/1')
      })
    })

    it('displays property images correctly', async () => {
      const axios = await import('axios')
      const mockGet = vi.mocked(axios.default.get)
      
      mockGet.mockResolvedValueOnce({
        data: { properties: mockProperties, total: mockProperties.length }
      })

      render(
        <TestWrapper>
          <Properties />
        </TestWrapper>
      )

      await waitFor(() => {
        const propertyImages = screen.getAllByRole('img')
        expect(propertyImages.length).toBeGreaterThan(0)
        expect(propertyImages[0]).toHaveAttribute('alt', expect.stringContaining('Luxury Villa'))
      })
    })
  })

  describe('⭐ Favorites Functionality', () => {
    it('allows users to add properties to favorites', async () => {
      const axios = await import('axios')
      const mockGet = vi.mocked(axios.default.get)
      const mockPost = vi.mocked(axios.default.post)
      
      mockGet.mockResolvedValueOnce({
        data: { properties: mockProperties, total: mockProperties.length }
      })
      
      mockPost.mockResolvedValueOnce({
        data: { message: 'Added to favorites' }
      })

      render(
        <TestWrapper>
          <Properties />
        </TestWrapper>
      )

      await waitFor(() => {
        const favoriteButtons = screen.getAllByRole('button', { name: /add to favorites/i })
        expect(favoriteButtons[0]).toBeInTheDocument()
      })

      const favoriteButton = screen.getAllByRole('button', { name: /add to favorites/i })[0]
      await user.click(favoriteButton)

      await waitFor(() => {
        expect(mockPost).toHaveBeenCalledWith('/api/favorites', {
          propertyId: 1
        })
      })
    })
  })

  describe('📞 Contact Agent Tests', () => {
    it('displays agent contact information', async () => {
      const axios = await import('axios')
      const mockGet = vi.mocked(axios.default.get)
      
      mockGet.mockResolvedValueOnce({
        data: { properties: mockProperties, total: mockProperties.length }
      })

      render(
        <TestWrapper>
          <Properties />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('John Agent')).toBeInTheDocument()
        expect(screen.getByText('Jane Agent')).toBeInTheDocument()
        expect(screen.getByText('Bob Agent')).toBeInTheDocument()
      })
    })

    it('opens contact modal when contact button is clicked', async () => {
      const axios = await import('axios')
      const mockGet = vi.mocked(axios.default.get)
      
      mockGet.mockResolvedValueOnce({
        data: { properties: mockProperties, total: mockProperties.length }
      })

      render(
        <TestWrapper>
          <Properties />
        </TestWrapper>
      )

      await waitFor(() => {
        const contactButtons = screen.getAllByRole('button', { name: /contact agent/i })
        expect(contactButtons[0]).toBeInTheDocument()
      })

      const contactButton = screen.getAllByRole('button', { name: /contact agent/i })[0]
      await user.click(contactButton)

      await waitFor(() => {
        expect(screen.getByText(/contact john agent/i)).toBeInTheDocument()
      })
    })
  })
})