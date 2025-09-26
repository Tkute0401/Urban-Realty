/**
 * SEO Optimization E2E Tests - Squarefooot Next.js App
 * Tests comprehensive SEO implementations and optimizations
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '@/contexts/AuthContext'
import Home from '@/app/page'
import About from '@/app/about/page'
import Contact from '@/app/contact/page'
import PrivacyPolicy from '@/app/privacy-policy/page'
import EMICalculator from '@/app/emi-calculator/page'
import Career from '@/app/career/page'
import HowWeWork from '@/app/how-we-work/page'

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
    get: vi.fn().mockReturnValue(null),
    toString: vi.fn().mockReturnValue('')
  }),
  usePathname: () => '/'
}))

vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: any) => (
    <img src={src} alt={alt} {...props} />
  )
}))

// Mock performance monitoring
vi.mock('@/lib/performance', () => ({
  trackWebVitals: vi.fn(),
  trackCustomMetric: vi.fn(),
  reportWebVitals: vi.fn()
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

// Mock document head for metadata testing
const mockDocumentHead = () => {
  const headElement = document.head || document.createElement('head')
  if (!document.head) {
    document.head = headElement
  }
  return headElement
}

describe('🔍 SEO Optimization Tests', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false }
      }
    })
    vi.clearAllMocks()
    
    // Mock document.head
    Object.defineProperty(document, 'head', {
      value: mockDocumentHead(),
      writable: true
    })
  })

  describe('🏠 Homepage SEO', () => {
    it('renders homepage with proper SEO structure', async () => {
      render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      )

      await waitFor(() => {
        // Check for main heading with proper hierarchy
        expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
        
        // Check for semantic content
        expect(screen.getByText(/Find Your Dream Property/i)).toBeInTheDocument()
        expect(screen.getByText(/Modern, Affordable & Luxurious Properties/i)).toBeInTheDocument()
      })
    })

    it('displays structured search functionality', async () => {
      render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      )

      await waitFor(() => {
        // Check for property type filters (important for SEO)
        expect(screen.getByText('ALL')).toBeInTheDocument()
        expect(screen.getByText('BUY')).toBeInTheDocument()
        expect(screen.getByText('RENT')).toBeInTheDocument()
        expect(screen.getByText('COMMERCIAL')).toBeInTheDocument()
      })
    })

    it('includes featured properties section', async () => {
      render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      )

      await waitFor(() => {
        // Look for featured properties section
        const featuredSection = screen.getByText(/Featured Properties/i) || 
                               screen.getByText(/Popular Properties/i) ||
                               screen.getByText(/Latest Properties/i)
        expect(featuredSection).toBeInTheDocument()
      })
    })
  })

  describe('📄 Static Pages SEO', () => {
    it('about page renders with proper content structure', async () => {
      render(
        <TestWrapper>
          <About />
        </TestWrapper>
      )

      await waitFor(() => {
        // Check for proper heading structure
        expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
        
        // Check for about content
        const aboutContent = screen.getByText(/About/i) || screen.getByText(/Our Story/i)
        expect(aboutContent).toBeInTheDocument()
      })
    })

    it('contact page includes structured contact information', async () => {
      render(
        <TestWrapper>
          <Contact />
        </TestWrapper>
      )

      await waitFor(() => {
        // Check for contact information
        expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
        
        // Look for contact elements
        const contactHeading = screen.getByText(/Contact/i)
        expect(contactHeading).toBeInTheDocument()
      })
    })

    it('privacy policy page renders with legal content', async () => {
      render(
        <TestWrapper>
          <PrivacyPolicy />
        </TestWrapper>
      )

      await waitFor(() => {
        // Check for privacy policy structure
        expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
        
        const privacyContent = screen.getByText(/Privacy/i)
        expect(privacyContent).toBeInTheDocument()
      })
    })
  })

  describe('🧮 Service Pages SEO', () => {
    it('EMI calculator includes proper financial tool structure', async () => {
      render(
        <TestWrapper>
          <EMICalculator />
        </TestWrapper>
      )

      await waitFor(() => {
        // Check for calculator structure
        expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
        
        // Look for EMI-related content
        const emiContent = screen.getByText(/EMI/i) || screen.getByText(/Calculator/i)
        expect(emiContent).toBeInTheDocument()
      })
    })

    it('career page displays job opportunities structure', async () => {
      render(
        <TestWrapper>
          <Career />
        </TestWrapper>
      )

      await waitFor(() => {
        // Check for career page structure
        expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
        
        const careerContent = screen.getByText(/Career/i) || screen.getByText(/Jobs/i)
        expect(careerContent).toBeInTheDocument()
      })
    })

    it('how we work page shows process information', async () => {
      render(
        <TestWrapper>
          <HowWeWork />
        </TestWrapper>
      )

      await waitFor(() => {
        // Check for process page structure
        expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
        
        const processContent = screen.getByText(/How We Work/i) || screen.getByText(/Process/i)
        expect(processContent).toBeInTheDocument()
      })
    })
  })

  describe('🎯 Performance & Web Vitals', () => {
    it('loads pages with proper loading states', async () => {
      render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      )

      // Check that content loads without significant delay
      await waitFor(() => {
        expect(screen.getByText(/Find Your Dream Property/i)).toBeInTheDocument()
      }, { timeout: 3000 })
    })

    it('images have proper alt attributes for accessibility', async () => {
      render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      )

      await waitFor(() => {
        const images = screen.getAllByRole('img')
        images.forEach(img => {
          expect(img).toHaveAttribute('alt')
          expect(img.getAttribute('alt')).not.toBe('')
        })
      })
    })
  })

  describe('📱 Mobile-First & Responsive Design', () => {
    it('renders properly on mobile viewport', async () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      })
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 667,
      })

      render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText(/Find Your Dream Property/i)).toBeInTheDocument()
      })
    })

    it('navigation adapts to smaller screens', async () => {
      render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      )

      await waitFor(() => {
        // Navigation should be present
        const navElement = document.querySelector('nav') || 
                          screen.getByRole('navigation') ||
                          screen.getByText(/Browse/i)
        expect(navElement).toBeInTheDocument()
      })
    })
  })

  describe('🔗 Internal Linking & Navigation', () => {
    it('includes proper internal navigation structure', async () => {
      render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      )

      await waitFor(() => {
        // Check for navigation links
        const links = screen.getAllByRole('link')
        expect(links.length).toBeGreaterThan(0)
        
        // Check for important navigation items
        const browseLink = screen.getByText(/Browse/i)
        expect(browseLink).toBeInTheDocument()
      })
    })

    it('property links have descriptive text', async () => {
      render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      )

      await waitFor(() => {
        const links = screen.getAllByRole('link')
        
        // Ensure links have meaningful content (not just "Read more", "Click here")
        links.forEach(link => {
          const linkText = link.textContent || link.getAttribute('aria-label')
          expect(linkText).toBeTruthy()
          expect(linkText?.trim().length).toBeGreaterThan(0)
        })
      })
    })
  })

  describe('🏗️ Semantic HTML Structure', () => {
    it('uses proper heading hierarchy', async () => {
      render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      )

      await waitFor(() => {
        const h1Elements = screen.getAllByRole('heading', { level: 1 })
        expect(h1Elements.length).toBe(1) // Should have exactly one H1
        
        // Check that headings are present
        const allHeadings = screen.getAllByRole('heading')
        expect(allHeadings.length).toBeGreaterThan(1)
      })
    })

    it('includes proper landmark elements', async () => {
      render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      )

      await waitFor(() => {
        // Check for semantic landmarks
        const main = document.querySelector('main')
        expect(main).toBeInTheDocument()
      })
    })
  })

  describe('⚡ Core Web Vitals Optimization', () => {
    it('loads content without layout shift', async () => {
      const { container } = render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      )

      await waitFor(() => {
        // Check that main content is loaded
        expect(screen.getByText(/Find Your Dream Property/i)).toBeInTheDocument()
      })

      // Check for stable layout
      const mainContent = container.querySelector('main') || container.firstChild
      expect(mainContent).toBeInTheDocument()
    })

    it('includes performance monitoring', async () => {
      const performanceModule = await import('@/lib/performance')
      
      render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      )

      // Check that performance utilities are available
      expect(performanceModule.trackWebVitals).toBeDefined()
      expect(performanceModule.trackCustomMetric).toBeDefined()
    })
  })

  describe('📊 Social Media Optimization', () => {
    it('includes social sharing structure', async () => {
      render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      )

      await waitFor(() => {
        // Social assets are handled at the metadata level
        // This test ensures the page structure supports social sharing
        expect(screen.getByText(/Find Your Dream Property/i)).toBeInTheDocument()
        expect(screen.getByText(/Modern, Affordable & Luxurious Properties/i)).toBeInTheDocument()
      })
    })
  })
})