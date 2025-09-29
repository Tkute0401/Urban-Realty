import { MetadataRoute } from 'next'
import { getApiBaseUrl } from '@/lib/services/api.config'

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://urban-realty-production.up.railway.app'

// Helper function to fetch dynamic URLs with timeout and fallback
async function fetchDynamicUrls() {
  try {
    const apiUrl = getApiBaseUrl()
    
    // Create a timeout promise
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout')), 10000) // 10 second timeout
    )
    
    // Fetch latest properties for sitemap with timeout
    const propertiesPromise = fetch(`${apiUrl}/properties?limit=50&sort=-createdAt`, {
      next: { revalidate: 86400 }, // Revalidate every 24 hours
    }).then(res => res.json())
    
    // Fetch developers for sitemap with timeout
    const developersPromise = fetch(`${apiUrl}/developers?limit=25&sort=-createdAt`, {
      next: { revalidate: 86400 }, // Revalidate every 24 hours
    }).then(res => res.json())
    
    // Race against timeout
    const [propertiesData, developersData] = await Promise.race([
      Promise.all([propertiesPromise, developersPromise]),
      timeoutPromise
    ]) as [any, any]
    
    const properties = propertiesData.success ? propertiesData.data : []
    const developers = developersData.success ? developersData.data : []
    
    return { properties, developers }
  } catch (error) {
    console.error('Error fetching dynamic URLs for sitemap:', error)
    // Return empty arrays to prevent build failure
    return { properties: [], developers: [] }
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Skip dynamic URL fetching during build if SKIP_BUILD_STATIC_GENERATION is set
  let properties: any[] = []
  let developers: any[] = []
  
  if (process.env.SKIP_BUILD_STATIC_GENERATION !== 'true') {
    try {
      const dynamicData = await fetchDynamicUrls()
      properties = dynamicData.properties || []
      developers = dynamicData.developers || []
    } catch (error) {
      console.warn('Sitemap: Using static URLs only due to API timeout:', error.message)
      // Continue with empty arrays - build won't fail
    }
  } else {
    console.log('Sitemap: Skipping dynamic URL generation during build')
  }
  
  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/properties`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/properties/buy`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/properties/rent`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/developers`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/register`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/dashboard`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]

  // Add dynamic property URLs
  const propertyUrls: MetadataRoute.Sitemap = properties.map((property: any) => ({
    url: `${baseUrl}/properties/${property._id}`,
    lastModified: new Date(property.updatedAt || property.createdAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // Add dynamic developer URLs  
  const developerUrls: MetadataRoute.Sitemap = developers.map((developer: any) => ({
    url: `${baseUrl}/developers/${developer._id}`,
    lastModified: new Date(developer.updatedAt || developer.createdAt),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...staticUrls, ...propertyUrls, ...developerUrls]
}