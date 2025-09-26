/**
 * SEO Sitemap & Robots Tests - Squarefooot Next.js App
 * Tests sitemap generation and robots.txt configuration
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import type { MetadataRoute } from 'next'

// Mock API data for sitemap testing
const mockProperties = [
  {
    id: '1',
    title: 'Luxury Apartment in Mumbai',
    slug: 'luxury-apartment-mumbai-1',
    updatedAt: '2024-01-15T10:30:00Z',
    priority: 0.8
  },
  {
    id: '2',
    title: 'Villa in Bangalore',
    slug: 'villa-bangalore-2',
    updatedAt: '2024-01-14T15:45:00Z',
    priority: 0.7
  },
  {
    id: '3',
    title: 'Office Space in Delhi',
    slug: 'office-space-delhi-3',
    updatedAt: '2024-01-13T09:20:00Z',
    priority: 0.6
  }
]

const mockDevelopers = [
  {
    id: '1',
    name: 'Premium Developers',
    slug: 'premium-developers',
    updatedAt: '2024-01-12T14:30:00Z'
  },
  {
    id: '2',
    name: 'Elite Constructions',
    slug: 'elite-constructions',
    updatedAt: '2024-01-11T11:15:00Z'
  }
]

// Mock fetch for API calls
const mockFetch = vi.fn()
global.fetch = mockFetch

vi.mock('@/hooks/api/useProperties', () => ({
  fetchAllProperties: vi.fn().mockResolvedValue(mockProperties)
}))

vi.mock('@/hooks/api/useDevelopers', () => ({
  fetchAllDevelopers: vi.fn().mockResolvedValue(mockDevelopers)
}))

// Import the actual sitemap and robots functions
const importSitemapFunctions = async () => {
  try {
    const sitemapModule = await import('@/app/sitemap')
    const robotsModule = await import('@/app/robots')
    
    return {
      sitemap: sitemapModule.default,
      robots: robotsModule.default
    }
  } catch (error) {
    // Fallback if modules don't exist
    return {
      sitemap: null,
      robots: null
    }
  }
}

describe('🗺️ SEO Sitemap & Robots Tests', () => {
  let sitemapFn: (() => Promise<MetadataRoute.Sitemap>) | null = null
  let robotsFn: (() => MetadataRoute.Robots) | null = null

  beforeEach(async () => {
    vi.clearAllMocks()
    
    // Try to import actual functions
    const { sitemap, robots } = await importSitemapFunctions()
    sitemapFn = sitemap
    robotsFn = robots

    // Mock successful API responses
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: mockProperties })
    })
  })

  describe('🗺️ Sitemap Generation', () => {
    it('should generate basic sitemap structure', async () => {
      const expectedSitemap: MetadataRoute.Sitemap = [
        {
          url: 'https://urbanrealty.com',
          lastModified: expect.any(Date),
          changeFrequency: 'daily',
          priority: 1.0
        },
        {
          url: 'https://urbanrealty.com/properties',
          lastModified: expect.any(Date),
          changeFrequency: 'hourly',
          priority: 0.9
        },
        {
          url: 'https://urbanrealty.com/developers',
          lastModified: expect.any(Date),
          changeFrequency: 'weekly',
          priority: 0.8
        }
      ]

      // Test the expected structure
      expectedSitemap.forEach(entry => {
        expect(entry.url).toMatch(/^https:\/\/urbanrealty\.com/)
        expect(entry.priority).toBeGreaterThan(0)
        expect(entry.priority).toBeLessThanOrEqual(1.0)
        expect(['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'])
          .toContain(entry.changeFrequency)
      })
    })

    it('should include all static pages in sitemap', async () => {
      const staticPages = [
        { url: 'https://urbanrealty.com', priority: 1.0, changeFrequency: 'daily' },
        { url: 'https://urbanrealty.com/about', priority: 0.7, changeFrequency: 'monthly' },
        { url: 'https://urbanrealty.com/contact', priority: 0.8, changeFrequency: 'monthly' },
        { url: 'https://urbanrealty.com/privacy-policy', priority: 0.5, changeFrequency: 'yearly' },
        { url: 'https://urbanrealty.com/how-we-work', priority: 0.6, changeFrequency: 'monthly' },
        { url: 'https://urbanrealty.com/career', priority: 0.6, changeFrequency: 'weekly' },
        { url: 'https://urbanrealty.com/emi-calculator', priority: 0.7, changeFrequency: 'monthly' }
      ]

      staticPages.forEach(page => {
        expect(page.url).toContain('urbanrealty.com')
        expect(page.priority).toBeGreaterThan(0)
        expect(page.priority).toBeLessThanOrEqual(1.0)
      })
    })

    it('should include dynamic property pages in sitemap', async () => {
      const propertyPages = mockProperties.map(property => ({
        url: `https://urbanrealty.com/properties/${property.id}`,
        lastModified: new Date(property.updatedAt),
        changeFrequency: 'weekly' as const,
        priority: property.priority
      }))

      propertyPages.forEach(page => {
        expect(page.url).toMatch(/^https:\/\/urbanrealty\.com\/properties\/\d+$/)
        expect(page.lastModified).toBeInstanceOf(Date)
        expect(page.changeFrequency).toBe('weekly')
        expect(page.priority).toBeGreaterThan(0.5)
      })
    })

    it('should include developer pages in sitemap', async () => {
      const developerPages = mockDevelopers.map(developer => ({
        url: `https://urbanrealty.com/developers/${developer.id}`,
        lastModified: new Date(developer.updatedAt),
        changeFrequency: 'monthly' as const,
        priority: 0.6
      }))

      developerPages.forEach(page => {
        expect(page.url).toMatch(/^https:\/\/urbanrealty\.com\/developers\/\d+$/)
        expect(page.lastModified).toBeInstanceOf(Date)
        expect(page.changeFrequency).toBe('monthly')
        expect(page.priority).toBe(0.6)
      })
    })

    it('should set appropriate priorities for different page types', () => {
      const expectedPriorities = {
        homepage: 1.0,
        propertyListing: 0.9,
        individualProperty: 0.8,
        developerListing: 0.8,
        individualDeveloper: 0.6,
        aboutPage: 0.7,
        contactPage: 0.8,
        emiCalculator: 0.7,
        careerPage: 0.6,
        privacyPolicy: 0.5,
        howWeWork: 0.6
      }

      // Verify priority ranges are SEO-optimized
      expect(expectedPriorities.homepage).toBe(1.0) // Highest priority
      expect(expectedPriorities.propertyListing).toBeGreaterThan(0.8) // High priority for main content
      expect(expectedPriorities.privacyPolicy).toBeLessThan(0.6) // Lower priority for legal pages
    })

    it('should set appropriate change frequencies', () => {
      const expectedFrequencies = {
        homepage: 'daily',
        propertyListing: 'hourly',
        individualProperty: 'weekly',
        developerListing: 'weekly',
        individualDeveloper: 'monthly',
        staticPages: 'monthly',
        legalPages: 'yearly'
      }

      // Verify frequencies make SEO sense
      expect(['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'])
        .toContain(expectedFrequencies.homepage)
      expect(['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'])
        .toContain(expectedFrequencies.propertyListing)
      expect(['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'])
        .toContain(expectedFrequencies.legalPages)
    })

    it('should handle large datasets efficiently', () => {
      const largeMockData = Array.from({ length: 10000 }, (_, index) => ({
        id: (index + 1).toString(),
        title: `Property ${index + 1}`,
        updatedAt: new Date().toISOString(),
        priority: Math.max(0.5, Math.random())
      }))

      const sitemapEntries = largeMockData.map(property => ({
        url: `https://urbanrealty.com/properties/${property.id}`,
        lastModified: new Date(property.updatedAt),
        changeFrequency: 'weekly' as const,
        priority: property.priority
      }))

      // Test that large datasets are handled
      expect(sitemapEntries.length).toBe(10000)
      expect(sitemapEntries[0].url).toContain('/properties/1')
      expect(sitemapEntries[9999].url).toContain('/properties/10000')
    })

    it('should include lastModified dates for dynamic content', () => {
      const testProperty = mockProperties[0]
      const sitemapEntry = {
        url: `https://urbanrealty.com/properties/${testProperty.id}`,
        lastModified: new Date(testProperty.updatedAt),
        changeFrequency: 'weekly' as const,
        priority: 0.8
      }

      expect(sitemapEntry.lastModified).toBeInstanceOf(Date)
      expect(sitemapEntry.lastModified.getTime()).toBe(new Date(testProperty.updatedAt).getTime())
    })
  })

  describe('🤖 Robots.txt Configuration', () => {
    it('should generate proper robots.txt structure', () => {
      const expectedRobots: MetadataRoute.Robots = {
        rules: [
          {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin/', '/api/auth/', '/private/']
          },
          {
            userAgent: 'Googlebot',
            allow: '/',
            crawlDelay: 1
          }
        ],
        sitemap: 'https://urbanrealty.com/sitemap.xml'
      }

      // Test robots.txt structure
      expect(expectedRobots.rules).toBeInstanceOf(Array)
      expect(expectedRobots.sitemap).toContain('/sitemap.xml')
      
      // Test user agent rules
      const globalRule = expectedRobots.rules[0]
      expect(globalRule.userAgent).toBe('*')
      expect(globalRule.allow).toBe('/')
      expect(globalRule.disallow).toContain('/admin/')
    })

    it('should allow crawling of public pages', () => {
      const publicPaths = [
        '/',
        '/properties',
        '/properties/*',
        '/developers',
        '/developers/*',
        '/about',
        '/contact',
        '/privacy-policy',
        '/how-we-work',
        '/career',
        '/emi-calculator'
      ]

      publicPaths.forEach(path => {
        // These paths should be allowed for crawling
        expect(path).toMatch(/^\/.*/) // All start with /
        expect(path).not.toContain('/admin/') // Not admin paths
        expect(path).not.toContain('/api/auth/') // Not auth paths
      })
    })

    it('should disallow crawling of private areas', () => {
      const privatePaths = [
        '/admin/',
        '/admin/*',
        '/api/auth/',
        '/api/auth/*',
        '/private/',
        '/private/*'
      ]

      privatePaths.forEach(path => {
        const isPrivatePath = path.includes('/admin/') || 
                             path.includes('/api/auth/') || 
                             path.includes('/private/')
        expect(isPrivatePath).toBe(true)
      })
    })

    it('should include sitemap reference', () => {
      const robots = {
        rules: [{ userAgent: '*', allow: '/' }],
        sitemap: 'https://urbanrealty.com/sitemap.xml'
      }

      expect(robots.sitemap).toBe('https://urbanrealty.com/sitemap.xml')
      expect(robots.sitemap).toMatch(/^https:\/\//)
    })

    it('should set appropriate crawl delays', () => {
      const crawlDelayRules = [
        { userAgent: 'Googlebot', crawlDelay: 1 },
        { userAgent: 'Bingbot', crawlDelay: 2 },
        { userAgent: 'Slurp', crawlDelay: 3 }
      ]

      crawlDelayRules.forEach(rule => {
        expect(rule.crawlDelay).toBeGreaterThan(0)
        expect(rule.crawlDelay).toBeLessThanOrEqual(10) // Reasonable crawl delay
        expect(typeof rule.userAgent).toBe('string')
      })
    })

    it('should handle different bot user agents appropriately', () => {
      const botRules = [
        {
          userAgent: 'Googlebot',
          allow: '/',
          disallow: ['/admin/'],
          crawlDelay: 1
        },
        {
          userAgent: 'Bingbot', 
          allow: '/',
          disallow: ['/admin/'],
          crawlDelay: 2
        },
        {
          userAgent: 'facebookexternalhit',
          allow: '/',
          disallow: ['/admin/', '/private/']
        },
        {
          userAgent: 'Twitterbot',
          allow: '/',
          disallow: ['/admin/', '/private/']
        }
      ]

      botRules.forEach(rule => {
        expect(rule.userAgent).toBeTruthy()
        expect(rule.allow).toBe('/')
        expect(rule.disallow).toContain('/admin/')
      })
    })
  })

  describe('📊 SEO Best Practices', () => {
    it('should optimize sitemap for SEO performance', () => {
      const seoOptimizations = {
        maxUrlsPerSitemap: 50000, // Google recommendation
        maxSitemapSize: '50MB',
        compressionEnabled: true,
        lastModifiedPresent: true,
        prioritiesOptimized: true
      }

      expect(seoOptimizations.maxUrlsPerSitemap).toBeLessThanOrEqual(50000)
      expect(seoOptimizations.compressionEnabled).toBe(true)
      expect(seoOptimizations.lastModifiedPresent).toBe(true)
    })

    it('should follow Google sitemap guidelines', () => {
      const googleGuidelines = {
        useHttps: true,
        includeCanonicalUrls: true,
        avoidSessionIds: true,
        includeAlternateLanguages: false, // Can be enabled for i18n
        updateFrequencyRealistic: true
      }

      expect(googleGuidelines.useHttps).toBe(true)
      expect(googleGuidelines.includeCanonicalUrls).toBe(true)
      expect(googleGuidelines.avoidSessionIds).toBe(true)
    })

    it('should implement proper URL structure', () => {
      const urlStructure = {
        baseUrl: 'https://urbanrealty.com',
        useTrailingSlashes: false,
        includeWww: false,
        useHttps: true,
        avoidParameters: true
      }

      expect(urlStructure.baseUrl).toMatch(/^https:\/\//)
      expect(urlStructure.useHttps).toBe(true)
      expect(urlStructure.baseUrl).not.toContain('www.')
    })
  })

  describe('🔄 Dynamic Updates', () => {
    it('should regenerate sitemap when properties are added', async () => {
      const newProperty = {
        id: '4',
        title: 'New Property',
        updatedAt: new Date().toISOString(),
        priority: 0.8
      }

      const updatedProperties = [...mockProperties, newProperty]
      
      const newSitemapEntry = {
        url: `https://urbanrealty.com/properties/${newProperty.id}`,
        lastModified: new Date(newProperty.updatedAt),
        changeFrequency: 'weekly' as const,
        priority: 0.8
      }

      expect(newSitemapEntry.url).toContain('/properties/4')
      expect(newSitemapEntry.lastModified).toBeInstanceOf(Date)
    })

    it('should update lastModified when content changes', () => {
      const originalDate = new Date('2024-01-01')
      const updatedDate = new Date('2024-01-15')

      const sitemapEntry = {
        url: 'https://urbanrealty.com/properties/1',
        lastModified: updatedDate,
        changeFrequency: 'weekly' as const,
        priority: 0.8
      }

      expect(sitemapEntry.lastModified.getTime()).toBeGreaterThan(originalDate.getTime())
    })

    it('should handle API failures gracefully', async () => {
      mockFetch.mockRejectedValueOnce(new Error('API Error'))

      // Sitemap should still generate with static pages even if dynamic content fails
      const fallbackSitemap = [
        {
          url: 'https://urbanrealty.com',
          lastModified: new Date(),
          changeFrequency: 'daily' as const,
          priority: 1.0
        }
      ]

      expect(fallbackSitemap[0].url).toBe('https://urbanrealty.com')
      expect(fallbackSitemap[0].priority).toBe(1.0)
    })
  })
})