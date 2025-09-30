import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import DeveloperDetailsClient from '@/components/developer/DeveloperDetailsClient';
import { getApiBaseUrl } from '@/lib/services/api.config';

// Fetch developer data server-side with Railway-optimized configuration
async function getDeveloper(id: string) {
  try {
    const baseUrl = getApiBaseUrl();
    const response = await fetch(`${baseUrl}/api/v1/developers/${id}`, {
      next: { revalidate: 3600 }, // Revalidate every hour
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
        return null; // Developer not found
      }
      throw new Error(`Failed to fetch developer: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.data || data;
  } catch (error) {
    console.error('Error fetching developer:', error);
    return null;
  }
}

// Generate metadata for developer page
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const developer = await getDeveloper(params.id);
  
  if (!developer) {
    return {
      title: 'Developer Not Found - Squarefooot',
      description: 'The requested developer profile could not be found.',
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://urbanrealty.com';
  const getHeadquarters = () => {
    if (!developer.headquarters) return '';
    const { city, state, country } = developer.headquarters;
    return [city, state, country].filter(Boolean).join(', ');
  };

  const title = `${developer.name} - Real Estate Developer | Squarefooot`;
  const description = developer.description 
    ? developer.description.substring(0, 160) + (developer.description.length > 160 ? '...' : '')
    : `${developer.name} is a leading real estate developer ${getHeadquarters() ? `based in ${getHeadquarters()}` : ''} with ${developer.completedProjects || 0} completed projects.`;

  return {
    title,
    description,
    keywords: [
      developer.name.toLowerCase(),
      'real estate developer',
      'property developer',
      'real estate company',
      ...(developer.headquarters?.city ? [developer.headquarters.city.toLowerCase()] : []),
      ...(developer.headquarters?.state ? [developer.headquarters.state.toLowerCase()] : []),
      'residential projects',
      'commercial projects',
      'property development',
      'real estate investment'
    ],
    authors: [{ name: 'Squarefooot' }],
    openGraph: {
      title,
      description,
      type: 'profile',
      url: `${baseUrl}/developers/${params.id}`,
      images: [
        {
          url: developer.logo?.url || '/developer-placeholder.jpg',
          width: 1200,
          height: 630,
          alt: `${developer.name} - Real Estate Developer`,
        },
      ],
      siteName: 'Squarefooot',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [developer.logo?.url || '/developer-placeholder.jpg'],
    },
    alternates: {
      canonical: `/developers/${params.id}`,
    },
  };
}

// Generate structured data for developer
function generateDeveloperStructuredData(developer: any, baseUrl: string, id: string) {
  const getHeadquarters = () => {
    if (!developer.headquarters) return null;
    const { city, state, country } = developer.headquarters;
    return {
      "@type": "PostalAddress",
      "addressLocality": city,
      "addressRegion": state,
      "addressCountry": country
    };
  };

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${baseUrl}/developers/${id}`,
    "name": developer.name,
    "url": developer.website || `${baseUrl}/developers/${id}`,
    "logo": developer.logo?.url ? {
      "@type": "ImageObject",
      "url": developer.logo.url
    } : undefined,
    "description": developer.description,
    "foundingDate": developer.foundedYear ? `${developer.foundedYear}-01-01` : undefined,
    "address": getHeadquarters(),
    "contactPoint": developer.contactInfo ? [
      ...(developer.contactInfo.phone ? [{
        "@type": "ContactPoint",
        "telephone": developer.contactInfo.phone,
        "contactType": "customer service"
      }] : []),
      ...(developer.contactInfo.email ? [{
        "@type": "ContactPoint",
        "email": developer.contactInfo.email,
        "contactType": "customer service"
      }] : [])
    ] : undefined,
    "sameAs": [
      ...(developer.socialMedia?.facebook ? [developer.socialMedia.facebook] : []),
      ...(developer.socialMedia?.twitter ? [developer.socialMedia.twitter] : []),
      ...(developer.socialMedia?.linkedin ? [developer.socialMedia.linkedin] : []),
      ...(developer.socialMedia?.instagram ? [developer.socialMedia.instagram] : []),
      ...(developer.website ? [developer.website] : [])
    ].filter(Boolean),
    "numberOfEmployees": developer.teamSize ? {
      "@type": "QuantitativeValue",
      "value": developer.teamSize
    } : undefined,
    "slogan": developer.tagline,
    "makesOffer": {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": "Real Estate Development Services",
        "description": "Comprehensive real estate development including residential and commercial projects"
      }
    }
  };
}

export default async function DeveloperPage({ params }: { params: { id: string } }) {
  const developer = await getDeveloper(params.id);
  
  if (!developer) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://urbanrealty.com';
  const structuredData = generateDeveloperStructuredData(developer, baseUrl, params.id);

  return (
    <>
      {/* Structured Data for Developer */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />
      
      {/* Client Component with Interactive Features */}
      <DeveloperDetailsClient developer={developer} />
    </>
  );
}

// Generate static params for popular developers (Railway deployment optimized)
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
    const baseUrl = getApiBaseUrl();
    const response = await fetch(`${baseUrl}/api/v1/developers`, {
      next: { revalidate: 3600 },
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cache-Control': 'public, max-age=300, stale-while-revalidate=600',
      },
      signal: AbortSignal.timeout(5000),
    });
    
    if (!response.ok) {
      console.warn(`Failed to fetch developers for static generation: ${response.status}`);
      return [];
    }
    
    const data = await response.json();
    const developers = data?.data || data?.items || [];
    
    const staticParams = developers.slice(0, 10).map((developer: any) => ({
      id: developer._id?.toString() || developer.id?.toString()
    }));
    
    console.log(`Generated ${staticParams.length} static params for developers`);
    return staticParams;
  } catch (error) {
    console.warn('Error generating static params for developers (expected during Railway build):', error.message);
    return [];
  }
}