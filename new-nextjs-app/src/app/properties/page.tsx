import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import styles from './Properties.module.css';

// Import components
import PropertiesPageClient from './PropertiesPageClient';
import PropertiesLoading from './PropertiesLoading';

// Server-side data fetching
async function getInitialProperties() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5000';
    const response = await fetch(`${baseUrl}/api/v1/properties`, {
      next: { 
        revalidate: 300 // Revalidate every 5 minutes for fresh listings
      }
    });
    
    if (!response.ok) {
      return [];
    }
    
    const data = await response.json();
    return Array.isArray(data.data) ? data.data : data.items || [];
  } catch (error) {
    console.error('Error fetching properties:', error);
    return [];
  }
}

// Dynamic metadata generation based on search params
export async function generateMetadata({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }): Promise<Metadata> {
  const listingType = searchParams.type || 'all';
  const location = searchParams.location || '';
  const page = searchParams.page || '1';
  
  let title = 'Properties for Sale & Rent | Squarefooot Real Estate Listings';
  let description = 'Browse thousands of properties for sale and rent. Find your dream home, apartment, or commercial space with Squarefooot. Expert agents and competitive prices.';
  
  // Customize based on search parameters
  if (listingType === 'sale' || listingType === 'buy') {
    title = `Properties for Sale${location ? ` in ${location}` : ''} | Squarefooot`;
    description = `Find properties for sale${location ? ` in ${location}` : ''}. Browse homes, apartments, and commercial spaces with competitive prices and expert guidance.`;
  } else if (listingType === 'rent') {
    title = `Properties for Rent${location ? ` in ${location}` : ''} | Squarefooot`;
    description = `Discover rental properties${location ? ` in ${location}` : ''}. Find apartments, houses, and commercial spaces for rent with flexible terms.`;
  }
  
  if (location) {
    description += ` Serving ${location} and surrounding areas.`;
  }
  
  return {
    title,
    description,
    keywords: [
      'properties for sale',
      'properties for rent',
      'real estate listings',
      'property search',
      'homes for sale',
      'apartments for rent',
      'commercial real estate',
      'property finder',
      ...(location ? [Array.isArray(location) ? location[0] : location, `properties in ${Array.isArray(location) ? location[0] : location}`] : [])
    ].filter(Boolean),
    openGraph: {
      title,
      description,
      type: 'website',
      images: [
        {
          url: '/og-properties-image.jpg',
          width: 1200,
          height: 630,
          alt: 'Squarefooot Properties Listings',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/twitter-properties-image.jpg'],
    },
    alternates: {
      canonical: `/properties${page !== '1' ? `?page=${page}` : ''}`,
    },
  };
}

// Generate structured data for properties listing
function generatePropertiesListingStructuredData(properties: any[]) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://urbanrealty.com';
  
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Urban Realty Property Listings",
    "description": "Browse our comprehensive collection of properties for sale and rent",
    "url": `${baseUrl}/properties`,
    "numberOfItems": properties.length,
    "itemListElement": properties.slice(0, 20).map((property, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "RealEstateListing",
        "name": property.title || `${property.bedrooms} BR ${property.propertyType} in ${property.address?.city}`,
        "url": `${baseUrl}/properties/${property._id}`,
        "image": property.images?.[0] || `${baseUrl}/default-property-image.jpg`,
        "priceSpecification": {
          "@type": "PriceSpecification",
          "price": property.price || 0,
          "priceCurrency": "USD"
        },
        "address": {
          "@type": "PostalAddress",
          "addressLocality": property.address?.city || "",
          "addressRegion": property.address?.state || "",
          "addressCountry": "US"
        },
        "floorSize": {
          "@type": "QuantitativeValue",
          "value": property.area || property.sqft || 0,
          "unitCode": "SQF"
        },
        "numberOfRooms": property.bedrooms || 0,
        "numberOfBathroomsTotal": property.bathrooms || 0
      }
    }))
  };
}


export default async function PropertiesPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const initialProperties = await getInitialProperties();
  const structuredData = generatePropertiesListingStructuredData(initialProperties);
  
  return (
    <>
      {/* Structured Data for Properties Listing */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />
      
      <Suspense fallback={<PropertiesLoading />}>
        <PropertiesPageClient 
          initialProperties={initialProperties}
          initialSearchParams={searchParams}
        />
      </Suspense>
    </>
  );
}