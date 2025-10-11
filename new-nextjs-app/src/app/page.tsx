import React from "react";
import type { Metadata } from 'next'
import HomePageWrapper from "./HomePageWrapper";

// SEO Metadata for Homepage
export const metadata: Metadata = {
  title: 'Find Your Dream Property | Squarefooot - Buy, Sell, Rent Real Estate',
  description: 'Discover thousands of properties with Squarefooot. Search homes, apartments, and commercial spaces for sale or rent. Expert real estate agents, competitive prices, and seamless property transactions nationwide.',
  keywords: [
    'find property',
    'dream home',
    'real estate search',
    'property finder',
    'homes for sale',
    'apartments for rent',
    'real estate listings',
    'property search engine',
    'buy house online',
    'rent apartment',
    'property marketplace'
  ],
  openGraph: {
    title: 'Find Your Dream Property | Squarefooot',
    description: 'Discover thousands of properties with Squarefooot. Expert agents, competitive prices, seamless transactions.',
    type: 'website',
    images: [
      {
        url: '/og-home-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Squarefooot - Find Your Dream Property',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Find Your Dream Property | Squarefooot',
    description: 'Discover thousands of properties with Squarefooot. Expert agents, competitive prices, seamless transactions.',
    images: ['/twitter-home-image.jpg'],
  },
  alternates: {
    canonical: '/',
  },
}

// Generate structured data for the homepage
function generateHomePageStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Squarefooot",
    "url": process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
    "description": "Premier real estate platform for buying, selling, and renting properties",
    "publisher": {
      "@type": "Organization",
      "name": "Squarefooot",
      "logo": {
        "@type": "ImageObject",
        "url": `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/logo.png`
      }
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${process.env.NEXT_PUBLIC_BASE_URL || "https://urbanrealty.com"}/properties?search={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    },
    "sameAs": [
      "https://facebook.com/urbanrealty",
      "https://twitter.com/urbanrealty",
      "https://linkedin.com/company/urbanrealty",
      "https://instagram.com/urbanrealty"
    ]
  }
}

export default function HomePage() {
  const structuredData = generateHomePageStructuredData()
  
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />
      
      <HomePageWrapper />
    </>
  );
}

