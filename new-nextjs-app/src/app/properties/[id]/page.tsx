import React from 'react';
import type { Metadata } from 'next'
import { notFound } from 'next/navigation';
import PropertyImageGallery from '@/components/property/PropertyImageGallery';
import PropertyMap from '@/components/property/PropertyMap';
import { getPropertySocialAssets, getOptimizedImageUrl } from '@/lib/socialAssets';
import { getApiBaseUrl } from '@/lib/services/api.config';
import { 
  Box, Grid, Container
} from '@mui/material';

// Import the new modular components
import {
  PropertyHeader,
  PropertyNavigation,
  PropertyOverview,
  PropertyHighlights,
  PropertyNearby,
  PropertyMoreInfo,
  PropertyFloorPlan,
  PropertyAmenities,
  PropertyDeveloper,
  PropertySimilar,
  PropertySidebar
} from '@/components/property/PropertyDetailsComponents';

// Import client component for interactive functionality
import PropertyDetailsClient from './PropertyDetailsClient';

// Server-side data fetching function - Railway optimized
async function getProperty(id: string) {
  try {
    const baseUrl = getApiBaseUrl();
    const response = await fetch(`${baseUrl}/properties/${id}`, {
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
    
    if (!response.ok) {
      if (response.status === 404) {
        return null; // Property not found
      }
      throw new Error(`Failed to fetch property: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data?.data?.data || data?.data || data;
  } catch (error) {
    console.error('Error fetching property:', error);
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
  // For Railway deployment, skip static generation during build to avoid connection issues
  const nodeEnv = process.env.NODE_ENV;
  const isRailwayBuild = process.env.RAILWAY_ENVIRONMENT || process.env.RAILWAY_PROJECT_ID;
  
  // Skip static generation during Railway build to prevent connection errors
  if (nodeEnv === 'production' && isRailwayBuild) {
    console.log('Skipping property static params generation for Railway deployment - using dynamic rendering');
    return [];
  }
  
  try {
    const baseUrl = getApiBaseUrl();
    const response = await fetch(`${baseUrl}/properties?limit=10&featured=true`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      // Short timeout to fail fast during build
      signal: AbortSignal.timeout(5000),
    });
    
    if (!response.ok) {
      console.warn(`Failed to fetch properties for static generation: ${response.status}`);
      return [];
    }
    
    const data = await response.json();
    const properties = data?.data || data?.items || [];
    
    const staticParams = properties.slice(0, 10).map((property: any) => ({
      id: property._id?.toString() || property.id?.toString()
    }));
    
    console.log(`Generated ${staticParams.length} static params for properties`);
    return staticParams;
  } catch (error) {
    // This is expected during Railway build - log but don't fail
    console.warn('Error generating static params for properties (expected during Railway build):', error.message);
    return [];
  }
}

export default async function PropertyDetailsPage({ params }: { params: { id: string } }) {
  const property = await getProperty(params.id);
  
  if (!property) {
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
      
      {/* Client Component for Interactive Features */}
      <PropertyDetailsClient property={property} />
    </>
  );
}