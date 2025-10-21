import React from "react";
import type { Metadata } from 'next';
import HowWeWorkClient from "@/components/how-we-work/HowWeWorkClient";

// SEO Metadata for How We Work Page
export const metadata: Metadata = {
  title: 'How We Work - Our Real Estate Process | Squarefooot',
  description: 'Learn about Squarefooot\'s streamlined real estate process. Discover how we help clients buy, sell, and rent properties with our proven methodology and expert guidance.',
  keywords: [
    'how we work',
    'real estate process',
    'property buying process',
    'property selling process',
    'real estate methodology',
    'property consultation process',
    'real estate services',
    'property transaction process',
    'real estate workflow',
    'property assistance process'
  ],
  authors: [{ name: 'Squarefooot' }],
  openGraph: {
    title: 'How We Work - Our Real Estate Process | Squarefooot',
    description: 'Discover Squarefooot\'s proven real estate process. We guide clients through every step of buying, selling, and renting properties.',
    type: 'website',
    images: [
      {
        url: '/how-we-work.jpg',
        width: 1200,
        height: 630,
        alt: 'How We Work - Squarefooot Process',
      },
    ],
    siteName: 'Squarefooot',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How We Work - Real Estate Process | Squarefooot',
    description: 'Learn about our streamlined real estate process and how we help clients achieve their property goals.',
    images: ['/how-we-work.jpg'],
  },
  alternates: {
    canonical: '/how-we-work',
  },
};

// Generate structured data for How We Work Page
function generateHowWeWorkStructuredData() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://squarefooot.com';
  
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "How We Work - Real Estate Process",
    "url": `${baseUrl}/how-we-work`,
    "description": "Learn about Squarefooot's comprehensive real estate process and methodology for helping clients with property transactions.",
    "mainEntity": {
      "@type": "HowTo",
      "name": "Squarefooot Real Estate Process",
      "description": "Our step-by-step approach to helping clients with property buying, selling, and renting",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Initial Consultation",
          "text": "We start with understanding your property requirements and goals"
        },
        {
          "@type": "HowToStep", 
          "name": "Property Search & Analysis",
          "text": "Our experts search and analyze properties that match your criteria"
        },
        {
          "@type": "HowToStep",
          "name": "Property Visits & Evaluation", 
          "text": "We arrange property visits and provide detailed evaluation reports"
        },
        {
          "@type": "HowToStep",
          "name": "Negotiation & Documentation",
          "text": "We handle negotiations and manage all documentation processes"
        },
        {
          "@type": "HowToStep",
          "name": "Transaction Completion",
          "text": "We ensure smooth transaction completion and property handover"
        }
      ]
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
          "name": "How We Work",
          "item": `${baseUrl}/how-we-work`
        }
      ]
    }
  };
}

export default function HowWeWorkPage() {
  const structuredData = generateHowWeWorkStructuredData();
  
  return (
    <>
      {/* Structured Data for How We Work Page */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />
      
      <HowWeWorkClient />
    </>
  );
}