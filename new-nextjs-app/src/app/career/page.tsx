import React from "react";
import type { Metadata } from 'next';
import CareerClient from "@/components/career/CareerClient";

// SEO Metadata for Career Page
export const metadata: Metadata = {
  title: 'Careers - Join Squarefooot Team | Real Estate Jobs',
  description: 'Explore exciting career opportunities at Squarefooot. Join our team of real estate professionals and grow your career in property development, sales, and customer service.',
  keywords: [
    'urban realty careers',
    'real estate jobs',
    'property careers',
    'real estate agent jobs',
    'property developer jobs',
    'real estate sales careers',
    'property management careers',
    'real estate marketing jobs',
    'property consultant careers',
    'real estate company jobs'
  ],
  authors: [{ name: 'Squarefooot' }],
  openGraph: {
    title: 'Careers at Squarefooot - Join Our Real Estate Team',
    description: 'Build your career in real estate with Squarefooot. Discover opportunities in property sales, development, and customer service.',
    type: 'website',
    images: [
      {
        url: '/careers.jpg',
        width: 1200,
        height: 630,
        alt: 'Careers at Squarefooot - Real Estate Jobs',
      },
    ],
    siteName: 'Squarefooot',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Careers at Squarefooot - Real Estate Opportunities',
    description: 'Join Squarefooot and build your career in real estate. Explore opportunities in property sales, development, and more.',
    images: ['/careers.jpg'],
  },
  alternates: {
    canonical: '/career',
  },
};

// Generate structured data for Career Page
function generateCareerStructuredData() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://squarefooot.com';
  
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Careers at Squarefooot",
    "url": `${baseUrl}/career`,
    "description": "Explore career opportunities at Squarefooot. Join our team of real estate professionals and grow your career in the property industry.",
    "mainEntity": {
      "@type": "Organization",
      "name": "Squarefooot",
      "url": baseUrl,
      "description": "Leading real estate company offering career opportunities in property sales, development, and customer service",
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Squarefooot Career Opportunities",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "JobPosting",
              "title": "Real Estate Sales Agent",
              "description": "Join our sales team and help clients find their dream properties"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "JobPosting",
              "title": "Property Consultant",
              "description": "Provide expert advice to clients on property investments"
            }
          }
        ]
      }
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": baseUrl
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Careers",
          "item": `${baseUrl}/career`
        }
      ]
    }
  };
}

export default function CareerPage() {
  const structuredData = generateCareerStructuredData();
  
  return (
    <>
      {/* Structured Data for Career Page */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />
      
      <CareerClient />
    </>
  );
}