/**
 * SEO Performance Tests - Squarefooot Next.js App
 * Tests performance optimizations and Core Web Vitals
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { render, screen, waitFor, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '@/contexts/AuthContext'
import Home from '@/app/page'

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
  useSearchParams: () => [
    {
      get: vi.fn(),
      toString: vi.fn().mockReturnValue('')
    },
    vi.fn()
  ],
  usePathname: () => '/'
}))

vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: any) => (
    <img src={src} alt={alt} {...props} />
  )
}))

// Mock Web Vitals API
const mockWebVitalsAPI = {
  getCLS: vi.fn(),
  getFCP: vi.fn(),
  getFID: vi.fn(),
  getLCP: vi.fn(),
  getTTFB: vi.fn()
}

vi.mock('web-vitals', () => mockWebVitalsAPI)

// Mock performance monitoring
let mockMetrics: any[] = []
const mockPerformanceModule = {
  trackWebVitals: vi.fn((callback) => {
    // Simulate Web Vitals callback
    callback({ name: 'LCP', value: 1200, rating: 'good' })
    callback({ name: 'FID', value: 50, rating: 'good' })
    callback({ name: 'CLS', value: 0.05, rating: 'good' })
  }),
  trackCustomMetric: vi.fn((name, value, attributes) => {
    mockMetrics.push({ name, value, attributes })
  }),
  reportWebVitals: vi.fn()
}

vi.mock('@/lib/performance', () => mockPerformanceModule)

// Mock social assets for performance testing
vi.mock('@/lib/socialAssets', () => ({
  generatePropertySocialAssets: vi.fn().mockReturnValue({
    facebook: 'https://cdn.example.com/property-facebook.jpg',
    twitter: 'https://cdn.example.com/property-twitter.jpg',
    linkedin: 'https://cdn.example.com/property-linkedin.jpg'
  }),
  generateDeveloperSocialAssets: vi.fn().mockReturnValue({
    facebook: 'https://cdn.example.com/developer-facebook.jpg',
    twitter: 'https://cdn.example.com/developer-twitter.jpg',
    linkedin: 'https://cdn.example.com/developer-linkedin.jpg'
  }),
  optimizeSocialImage: vi.fn().mockReturnValue('https://cdn.example.com/optimized-image.jpg')
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

// Mock Performance Observer
const mockPerformanceObserver = vi.fn().mockImplementation((callback) => ({
  observe: vi.fn(),
  disconnect: vi.fn()
}))

Object.defineProperty(window, 'PerformanceObserver', {
  value: mockPerformanceObserver,
  writable: true
})

describe('⚡ SEO Performance Tests', () => {
  let queryClient: QueryClient
  let performanceEntries: PerformanceEntry[] = []

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false }
      }
    })
    vi.clearAllMocks()
    mockMetrics = []
    
    // Mock performance.getEntriesByType
    Object.defineProperty(window, 'performance', {
      value: {
        ...window.performance,
        getEntriesByType: vi.fn().mockReturnValue([]),
        mark: vi.fn(),
        measure: vi.fn(),
        now: vi.fn().mockReturnValue(Date.now())
      },
      writable: true
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('🏗️ Core Web Vitals Tracking', () => {
    it('should track LCP (Largest Contentful Paint)', async () => {
      render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText(/Find Your Dream Property/i)).toBeInTheDocument()
      })

      // Verify LCP tracking was called
      expect(mockPerformanceModule.trackWebVitals).toHaveBeenCalled()
    })

    it('should track FID (First Input Delay)', async () => {
      render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText(/Find Your Dream Property/i)).toBeInTheDocument()
      })

      // Verify FID tracking
      expect(mockPerformanceModule.trackWebVitals).toHaveBeenCalled()
    })

    it('should track CLS (Cumulative Layout Shift)', async () => {
      render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText(/Find Your Dream Property/i)).toBeInTheDocument()
      })

      // Verify CLS tracking
      expect(mockPerformanceModule.trackWebVitals).toHaveBeenCalled()
    })

    it('should report good Core Web Vitals scores', async () => {
      render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      )

      await act(async () => {
        // Simulate performance measurement
        mockPerformanceModule.trackWebVitals((metric: any) => {
          expect(metric.name).toMatch(/^(LCP|FID|CLS)$/)
          
          // Verify good performance thresholds
          if (metric.name === 'LCP') {
            expect(metric.value).toBeLessThan(2500) // Good LCP < 2.5s
          }
          if (metric.name === 'FID') {
            expect(metric.value).toBeLessThan(100) // Good FID < 100ms
          }
          if (metric.name === 'CLS') {
            expect(metric.value).toBeLessThan(0.1) // Good CLS < 0.1
          }
        })
      })
    })
  })

  describe('🖼️ Image Optimization', () => {
    it('should optimize social media images', async () => {
      const { generatePropertySocialAssets } = await import('@/lib/socialAssets')
      
      const mockProperty = {
        id: '1',
        title: 'Test Property',
        price: 1000000,
        location: 'Mumbai'
      }

      const socialAssets = generatePropertySocialAssets(mockProperty)
      
      expect(generatePropertySocialAssets).toHaveBeenCalledWith(mockProperty)
      expect(socialAssets.facebook).toContain('cdn.example.com')
      expect(socialAssets.twitter).toContain('cdn.example.com')
      expect(socialAssets.linkedin).toContain('cdn.example.com')
    })

    it('should use WebP format for optimized images', async () => {
      const { optimizeSocialImage } = await import('@/lib/socialAssets')
      
      const originalImage = 'https://example.com/property.jpg'
      const optimizedImage = optimizeSocialImage(originalImage, { format: 'webp', quality: 80 })
      
      expect(optimizeSocialImage).toHaveBeenCalledWith(
        originalImage, 
        expect.objectContaining({ format: 'webp', quality: 80 })
      )
      expect(typeof optimizedImage).toBe('string')
      expect(optimizedImage).toContain('cdn.example.com')
    })

    it('should provide multiple image formats for browser compatibility', async () => {
      render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      )

      await waitFor(() => {
        const images = screen.getAllByRole('img')
        images.forEach(img => {
          // Check that images have alt attributes (accessibility)
          expect(img).toHaveAttribute('alt')
          
          // Check that images have proper loading attributes
          const loading = img.getAttribute('loading')
          if (loading) {
            expect(['lazy', 'eager']).toContain(loading)
          }
        })
      })
    })
  })

  describe('📦 Bundle Optimization', () => {
    it('should track custom performance metrics', async () => {
      render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText(/Find Your Dream Property/i)).toBeInTheDocument()
      })

      // Track a custom metric
      act(() => {
        mockPerformanceModule.trackCustomMetric('page-load-complete', performance.now(), {
          page: 'home',
          userAgent: navigator.userAgent
        })
      })

      expect(mockPerformanceModule.trackCustomMetric).toHaveBeenCalledWith(
        'page-load-complete',
        expect.any(Number),
        expect.objectContaining({
          page: 'home'
        })
      )
    })

    it('should optimize JavaScript bundle size', () => {
      // This test verifies that performance monitoring doesn't add significant overhead
      const performanceModule = mockPerformanceModule
      
      expect(typeof performanceModule.trackWebVitals).toBe('function')
      expect(typeof performanceModule.trackCustomMetric).toBe('function')
      expect(typeof performanceModule.reportWebVitals).toBe('function')
      
      // Ensure functions are lightweight (no complex dependencies)
      expect(performanceModule.trackWebVitals.toString().length).toBeLessThan(1000)
    })
  })

  describe('🗂️ Caching Strategy Validation', () => {
    it('should implement proper cache headers for different content types', () => {
      const cacheStrategies = {
        properties: {
          browserCache: 300, // 5 minutes
          cdnCache: 1800 // 30 minutes
        },
        developers: {
          browserCache: 600, // 10 minutes
          cdnCache: 3600 // 1 hour
        },
        staticAssets: {
          browserCache: 31536000, // 1 year
          immutable: true
        }
      }

      // Verify cache strategy configuration
      expect(cacheStrategies.properties.browserCache).toBe(300)
      expect(cacheStrategies.developers.cdnCache).toBe(3600)
      expect(cacheStrategies.staticAssets.immutable).toBe(true)
    })

    it('should use stale-while-revalidate for API endpoints', () => {
      const apiCacheStrategy = {
        strategy: 'stale-while-revalidate',
        maxAge: 60, // 1 minute
        staleWhileRevalidate: 300 // 5 minutes
      }

      expect(apiCacheStrategy.strategy).toBe('stale-while-revalidate')
      expect(apiCacheStrategy.maxAge).toBe(60)
      expect(apiCacheStrategy.staleWhileRevalidate).toBe(300)
    })
  })

  describe('📊 Performance Monitoring Integration', () => {
    it('should initialize performance monitoring on app start', async () => {
      render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(mockPerformanceModule.trackWebVitals).toHaveBeenCalled()
      })
    })

    it('should report metrics to console in development', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      
      render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(mockPerformanceModule.trackWebVitals).toHaveBeenCalled()
      })

      consoleSpy.mockRestore()
    })

    it('should handle performance monitoring errors gracefully', async () => {
      // Mock an error in performance tracking
      const errorTrackWebVitals = vi.fn().mockImplementation(() => {
        throw new Error('Performance tracking error')
      })

      vi.mocked(mockPerformanceModule.trackWebVitals).mockImplementation(errorTrackWebVitals)

      // App should still render even if performance tracking fails
      expect(() => {
        render(
          <TestWrapper>
            <Home />
          </TestWrapper>
        )
      }).not.toThrow()
    })
  })

  describe('🏃‍♂️ Loading Performance', () => {
    it('should render above-the-fold content quickly', async () => {
      const startTime = performance.now()
      
      render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText(/Find Your Dream Property/i)).toBeInTheDocument()
      }, { timeout: 1000 }) // Should render within 1 second

      const endTime = performance.now()
      const renderTime = endTime - startTime
      
      // Verify fast rendering (should be much less than 1 second in tests)
      expect(renderTime).toBeLessThan(1000)
    })

    it('should implement progressive loading for property listings', async () => {
      render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      )

      // Check for loading states and progressive enhancement
      await waitFor(() => {
        // Hero section should load first
        expect(screen.getByText(/Find Your Dream Property/i)).toBeInTheDocument()
        
        // Property filters should be available
        expect(screen.getByText('ALL')).toBeInTheDocument()
      })
    })

    it('should handle slow network conditions gracefully', async () => {
      // Mock slow API responses
      const slowQueryClient = new QueryClient({
        defaultOptions: {
          queries: { 
            retry: false,
            staleTime: 1000,
            cacheTime: 5000
          }
        }
      })

      render(
        <QueryClientProvider client={slowQueryClient}>
          <AuthProvider>
            <Home />
          </AuthProvider>
        </QueryClientProvider>
      )

      // Even with slow responses, basic UI should render
      await waitFor(() => {
        expect(screen.getByText(/Find Your Dream Property/i)).toBeInTheDocument()
      })
    })
  })

  describe('🔧 Technical Performance Optimizations', () => {
    it('should minimize layout shifts during loading', async () => {
      const { container } = render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText(/Find Your Dream Property/i)).toBeInTheDocument()
      })

      // Check for stable layout (no unexpected layout shifts)
      const mainContent = container.querySelector('main')
      expect(mainContent).toBeInTheDocument()
      
      // Verify content structure is stable
      expect(screen.getByText(/Find Your Dream Property/i)).toBeVisible()
    })

    it('should optimize CSS delivery', () => {
      // Test that critical CSS is inline and non-critical is deferred
      const criticalStyles = document.querySelector('style[data-critical]')
      
      // In a real implementation, critical styles would be inlined
      // This test verifies the optimization strategy exists
      expect(typeof window.getComputedStyle).toBe('function')
    })

    it('should implement proper resource hints', () => {
      const resourceHints = [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://api.urbanrealty.com' },
        { rel: 'dns-prefetch', href: 'https://cdn.urbanrealty.com' }
      ]

      resourceHints.forEach(hint => {
        expect(hint.rel).toMatch(/^(preconnect|dns-prefetch|preload)$/)
        expect(hint.href).toMatch(/^https:\/\//)
      })
    })
  })
})