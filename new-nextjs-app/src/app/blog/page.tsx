import React from "react";
import type { Metadata } from 'next';
import BlogListClient from "@/components/blog/BlogListClient";

// SEO Metadata for Blog Listing Page
export const metadata: Metadata = {
  title: 'Real Estate Blog - Property Tips, Market Insights & Guides | Squarefooot',
  description: 'Stay informed with Squarefooot\'s real estate blog. Expert insights on property buying, selling, renting, market trends, home improvement tips, and investment strategies. Your trusted source for real estate knowledge.',
  keywords: [
    'real estate blog',
    'property tips',
    'real estate guides',
    'property market insights',
    'home buying tips',
    'property investment advice',
    'real estate news',
    'property market trends',
    'home selling guide',
    'rental property tips',
    'real estate articles',
    'property advice'
  ],
  openGraph: {
    title: 'Real Estate Blog - Property Tips & Market Insights | Squarefooot',
    description: 'Expert real estate insights, property tips, market trends, and comprehensive guides to help you make informed property decisions.',
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
    title: 'Real Estate Blog - Property Tips & Market Insights | Squarefooot',
    description: 'Expert real estate insights, property tips, market trends, and comprehensive guides.',
    images: ['/blog-og-image.jpg'],
  },
  alternates: {
    canonical: '/blog',
  },
};

// Generate structured data for Blog listing page
function generateBlogListingStructuredData() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://squarefooot.com';
  
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Squarefooot Real Estate Blog",
    "url": `${baseUrl}/blog`,
    "description": "Expert real estate insights, property tips, market trends, and comprehensive guides to help you make informed property decisions.",
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

export default function BlogPage() {
  const structuredData = generateBlogListingStructuredData();
  
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

