import React from "react";
import type { Metadata } from 'next';
import BlogListClient from "@/components/blog/BlogListClient";
import { getApiBaseUrl } from '@/lib/services/api.config';

// SEO Metadata for Blog Listing Page
export const metadata: Metadata = {
  title: 'Real Estate Blog | Property Tips, Market Insights & Guides | Squarefooot',
  description: 'Explore our comprehensive real estate blog featuring property buying guides, market insights, investment tips, home improvement advice, and expert real estate advice. Stay informed with the latest trends in the property market.',
  keywords: [
    'real estate blog',
    'property blog',
    'real estate tips',
    'property buying guide',
    'real estate market insights',
    'property investment advice',
    'home buying tips',
    'real estate news',
    'property market trends',
    'real estate guides',
    'property advice',
    'home selling tips'
  ],
  openGraph: {
    title: 'Real Estate Blog | Property Tips & Market Insights | Squarefooot',
    description: 'Discover expert real estate advice, property buying guides, market insights, and investment tips on our comprehensive blog.',
    type: 'website',
    images: [
      {
        url: '/blog-og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Squarefooot Real Estate Blog',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Real Estate Blog | Property Tips & Market Insights | Squarefooot',
    description: 'Discover expert real estate advice, property buying guides, market insights, and investment tips.',
    images: ['/blog-og-image.jpg'],
  },
  alternates: {
    canonical: '/blog',
  },
};

// Generate structured data for Blog listing page
function generateBlogListStructuredData() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://squarefooot.com';
  
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Squarefooot Real Estate Blog",
    "url": `${baseUrl}/blog`,
    "description": "Expert real estate advice, property buying guides, market insights, and investment tips",
    "publisher": {
      "@type": "Organization",
      "name": "Squarefooot",
      "url": baseUrl,
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/vite.png`
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${baseUrl}/blog`
    }
  };
}

export default async function BlogPage() {
  const structuredData = generateBlogListStructuredData();
  
  return (
    <>
      {/* Structured Data for Blog Listing Page */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />
      
      <BlogListClient />
    </>
  );
}

