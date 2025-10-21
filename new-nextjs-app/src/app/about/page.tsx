import React from "react";
import type { Metadata } from 'next';
import AboutUsClient from "@/components/about/AboutUsClient";

// SEO Metadata for About Page
export const metadata: Metadata = {
  title: 'About Squarefooot - Leading Real Estate Platform Since 2020',
  description: 'Learn about Squarefooot, your trusted real estate partner. We connect buyers, sellers, and renters with dream properties through innovative technology and expert guidance. Discover our mission, values, and commitment to exceptional service.',
  keywords: [
    'about urban realty',
    'real estate company',
    'property platform',
    'real estate services',
    'company history',
    'real estate mission',
    'property experts',
    'real estate team',
    'trusted real estate',
    'property platform story'
  ],
  openGraph: {
    title: 'About Squarefooot - Your Trusted Real Estate Partner',
    description: 'Discover Squarefooot\'s story, mission, and commitment to helping you find your dream property. Expert real estate services with innovative technology.',
    type: 'website',
    images: [
      {
        url: '/about-us.jpg',
        width: 1200,
        height: 630,
        alt: 'Squarefooot Team - About Us',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Squarefooot - Your Trusted Real Estate Partner',
    description: 'Discover Squarefooot\'s story, mission, and commitment to helping you find your dream property.',
    images: ['/about-us.jpg'],
  },
  alternates: {
    canonical: '/about',
  },
};

// Generate structured data for About page
function generateAboutPageStructuredData() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://squarefooot.com';
  
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "About Squarefooot",
    "url": `${baseUrl}/about`,
    "description": "Learn about Squarefooot, your trusted real estate partner connecting buyers, sellers, and renters with dream properties.",
    "mainEntity": {
      "@type": "RealEstateAgent",
      "name": "Squarefooot",
      "url": baseUrl,
      "description": "Premier real estate platform offering comprehensive property buying, selling, and rental services with expert agents and innovative technology.",
      "foundingDate": "2020",
      "areaServed": {
        "@type": "Country",
        "name": "United States"
      },
      "serviceType": [
        "Real Estate Sales",
        "Property Rental",
        "Property Management",
        "Real Estate Consultation",
        "Property Investment Advisory"
      ],
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Your City",
        "addressRegion": "Your State",
        "addressCountry": "US"
      },
      "telephone": "+1-XXX-XXX-XXXX",
      "email": "contact@squarefooot.com"
    }
  };
}

export default function AboutPage() {
  const structuredData = generateAboutPageStructuredData();
  
  return (
    <>
      {/* Structured Data for About Page */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />
      
      <AboutUsClient />
    </>
  );
}