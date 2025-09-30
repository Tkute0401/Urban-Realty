import React from 'react';
import type { Metadata } from 'next'
import { notFound } from 'next/navigation';
import { getPropertySocialAssets, getOptimizedImageUrl } from '@/lib/socialAssets';
import { getApiBaseUrl } from '@/lib/services/api.config';

// Import client component for interactive functionality - Railway Build Fix
import PropertyInteractiveWrapper from './PropertyInteractiveWrapper';

// Server-side data fetching function - Railway optimized
// This function is kept for server-side rendering and SEO purposes
// The actual data fetching will be handled by the PropertiesContext on the client side
async function getProperty(id: string) {
  try {
    // For server-side rendering, we need the full URL
    // In production, use the same domain since Express serves both API and frontend
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BASE_URL || 
                   (process.env.NODE_ENV === 'production' ? 'https://www.squarefooot.com' : 'http://localhost:5000');
    
    // Ensure /api/v1 prefix is always included for property details
    const url = `${baseUrl}/api/v1/properties/${id}`;
    
    console.log('🔍 Server-side getProperty - Fetching property:', { id, url, baseUrl });
    
    const response = await fetch(url, {
      next: { 
        revalidate: 3600 // Revalidate every hour for ISR
      },
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cache-Control': 'public, max-age=300, stale-while-revalidate=600',
      },
      // Add timeout for Railway deployment
      signal: AbortSignal.timeout(10000),
    });
    
    console.log('🔍 Server-side getProperty - Response status:', response.status);
    
    if (!response.ok) {
      if (response.status === 404) {
        console.log('🔍 Server-side getProperty - Property not found (404)');
        // Try to get a fallback property for testing
        console.log('🔍 Server-side getProperty - Attempting to get fallback property...');
        try {
          const fallbackResponse = await fetch(`${baseUrl}/api/v1/properties/featured`, {
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
          });
          if (fallbackResponse.ok) {
            const fallbackData = await fallbackResponse.json();
            const fallbackProperties = fallbackData?.data || [];
            if (fallbackProperties.length > 0) {
              console.log('🔍 Server-side getProperty - Using fallback property:', fallbackProperties[0]._id);
              return fallbackProperties[0];
            }
          }
        } catch (fallbackError) {
          console.error('🔍 Server-side getProperty - Fallback failed:', fallbackError);
        }
        return null; // Property not found
      }
      console.error('🔍 Server-side getProperty - Error response:', response.status, response.statusText);
      throw new Error(`Failed to fetch property: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('🔍 Server-side getProperty - Response data:', { 
      hasData: !!data, 
      dataKeys: data ? Object.keys(data) : 'no data',
      propertyId: data?.data?.data?._id || data?.data?._id || data?._id
    });
    
    return data?.data?.data || data?.data || data;
  } catch (error) {
    console.error('🔍 Server-side getProperty - Error fetching property:', error);
    return null;
  }
}

// Dynamic metadata generation
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const property = await getProperty(params.id);
  
  if (!property) {
    return {
      title: 'Property Not Found | Squarefooot',
      description: 'The requested property could not be found.',
    };
  }

  const title = `${property.title || `${property.bedrooms || 'N/A'} BR ${property.propertyType || 'Property'}`} in ${property.address?.city || 'Prime Location'} | Squarefooot`;
  const description = `${property.description || `Discover this ${property.bedrooms || 'N/A'} bedroom ${property.propertyType || 'property'} in ${property.address?.city || 'prime location'}. Price: $${property.price?.toLocaleString() || 'Contact for pricing'}. ${property.area || property.sqft ? `Size: ${property.area || property.sqft} sqft.` : ''} ${property.amenities?.length ? `Features: ${property.amenities.slice(0, 3).join(', ')}.` : ''}`}`.slice(0, 160);
  
  const propertyImage = property.images?.[0];
  const optimizedImage = propertyImage ? getOptimizedImageUrl(propertyImage, 1200, 630) : undefined;
  
  // Get optimized social media assets
  const socialAssets = getPropertySocialAssets(
    property.title || `${property.bedrooms} BR ${property.propertyType}`,
    property.price ? `$${property.price.toLocaleString()}` : 'Contact for pricing',
    property.address?.city || 'Prime Location',
    optimizedImage
  );
  
  return {
    title,
    description,
    keywords: [
      property.propertyType,
      `${property.bedrooms} bedroom`,
      property.address?.city,
      property.address?.state,
      'property for sale',
      'property for rent',
      'real estate',
      ...(property.amenities || []).slice(0, 5)
    ].filter(Boolean),
    openGraph: {
      title,
      description,
      type: 'website',
      images: [
        {
          url: socialAssets.facebook.url,
          width: socialAssets.facebook.width,
          height: socialAssets.facebook.height,
          alt: socialAssets.facebook.alt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [{
        url: socialAssets.twitter.url,
        alt: socialAssets.twitter.alt,
      }],
    },
    alternates: {
      canonical: `/properties/${params.id}`,
    },
  };
}

// Generate structured data for property
function generatePropertyStructuredData(property: any) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://urbanrealty.com';
  
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "name": property.title || `${property.bedrooms} BR ${property.propertyType} in ${property.address?.city}`,
    "description": property.description || `Beautiful ${property.bedrooms} bedroom ${property.propertyType} in ${property.address?.city}`,
    "url": `${baseUrl}/properties/${property._id}`,
    "image": property.images?.[0] || `${baseUrl}/default-property-image.jpg`,
    "datePosted": property.createdAt || new Date().toISOString(),
    "validThrough": property.validThrough || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days from now
    "priceSpecification": {
      "@type": "PriceSpecification",
      "price": property.price || 0,
      "priceCurrency": "USD"
    },
    "availabilityStarts": property.availableFrom || new Date().toISOString(),
    "address": {
      "@type": "PostalAddress",
      "streetAddress": property.address?.street || "",
      "addressLocality": property.address?.city || "",
      "addressRegion": property.address?.state || "",
      "postalCode": property.address?.zipCode || "",
      "addressCountry": "US"
    },
    "geo": property.location?.coordinates ? {
      "@type": "GeoCoordinates",
      "latitude": property.location.coordinates[1],
      "longitude": property.location.coordinates[0]
    } : undefined,
    "floorSize": {
      "@type": "QuantitativeValue",
      "value": property.area || property.sqft || 0,
      "unitCode": "SQF"
    },
    "numberOfRooms": property.bedrooms || 0,
    "numberOfBathroomsTotal": property.bathrooms || 0,
    "amenityFeature": (property.amenities || []).map((amenity: string) => ({
      "@type": "LocationFeatureSpecification",
      "name": amenity
    })),
    "category": property.propertyType || "Residential",
    "yearBuilt": property.yearBuilt,
    "occupancy": {
      "@type": "Occupancy",
      "occupancyType": property.listingType === 'rent' ? 'rental' : 'owner'
    }
  };
}

// Static generation for popular properties (Railway deployment optimized)

export async function generateStaticParams() {
  // Force skip static generation during Railway builds to prevent event handler serialization
  const isRailwayBuild = 
    process.env.RAILWAY_ENVIRONMENT ||
    process.env.RAILWAY_PROJECT_ID ||
    process.env.SKIP_BUILD_STATIC_GENERATION === 'true' ||
    process.env.NODE_ENV === 'production';  // Skip all production builds for now
  
  console.log('🚆 Railway Static Generation Check:', {
    nodeEnv: process.env.NODE_ENV,
    railwayEnv: process.env.RAILWAY_ENVIRONMENT,
    railwayProject: process.env.RAILWAY_PROJECT_ID,
    skipFlag: process.env.SKIP_BUILD_STATIC_GENERATION,
    isRailwayBuild
  });
  
  // Always skip static generation to prevent event handler serialization errors
  if (isRailwayBuild) {
    console.log('🚆 Skipping static generation to prevent event handler serialization errors');
    return [];
  }

  // Development or non-Railway production builds
  try {
    // For server-side rendering, we need the full URL
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5000';
    const apiBaseUrl = getApiBaseUrl();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    
    const response = await fetch(`${baseUrl}/api/v1/properties/featured`, {
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      console.log('Failed to fetch properties for static generation, using dynamic rendering');
      return [];
    }
    
    const data = await response.json();
    const properties = data?.data?.data || data?.data || data || [];
    
    console.log(`Generating static params for ${properties.length} properties`);
    
    return properties.slice(0, 20).map((property: any) => ({
      id: property._id || property.id,
    }));
  } catch (error) {
    console.log('Error generating static params for properties, using dynamic rendering:', error);
    return [];
  }
}

// Main page component - Server Component
export default async function PropertyDetailsPage({ params }: { params: { id: string } }) {
  console.log('🔍 PropertyDetailsPage - Rendering for property ID:', params.id);
  
  const property = await getProperty(params.id);
  
  console.log('🔍 PropertyDetailsPage - Property data:', { 
    hasProperty: !!property, 
    propertyId: property?._id,
    propertyTitle: property?.title 
  });
  
  if (!property) {
    console.log('🔍 PropertyDetailsPage - Property not found, calling notFound()');
    notFound();
  }

  const structuredData = generatePropertyStructuredData(property);

  return (
    <>
      {/* Structured Data for Property */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />
      
      {/* Client Component for Interactive Features - Railway Build Fix */}
      <PropertyInteractiveWrapper property={property} />
    </>
  );
}