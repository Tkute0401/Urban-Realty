import React from "react";
import type { Metadata } from 'next';
import ContactUsClient from "@/components/contact/ContactUsClient";

// SEO Metadata for Contact Page
export const metadata: Metadata = {
  title: 'Contact Squarefooot - Get Expert Real Estate Assistance',
  description: 'Contact Squarefooot for expert real estate assistance. Whether you\'re buying, selling, or renting, our professional team is here to help. Get in touch via phone, email, or our contact form.',
  keywords: [
    'contact urban realty',
    'real estate contact',
    'property assistance',
    'real estate help',
    'contact real estate agents',
    'property support',
    'real estate inquiry',
    'contact form',
    'real estate phone number',
    'property consultation'
  ],
  openGraph: {
    title: 'Contact Squarefooot - Expert Real Estate Assistance',
    description: 'Get in touch with Squarefooot for professional real estate services. Our expert team is ready to help with all your property needs.',
    type: 'website',
    images: [
      {
        url: '/contact-us.jpg',
        width: 1200,
        height: 630,
        alt: 'Contact Squarefooot - Real Estate Experts',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Squarefooot - Expert Real Estate Assistance',
    description: 'Get in touch with Squarefooot for professional real estate services. Our expert team is ready to help.',
    images: ['/contact-us.jpg'],
  },
  alternates: {
    canonical: '/contact',
  },
};

// Generate structured data for Contact page
function generateContactPageStructuredData() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://squarefooot.com';
  
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact Squarefooot",
    "url": `${baseUrl}/contact`,
    "description": "Get in touch with Squarefooot for expert real estate assistance and professional property services.",
    "mainEntity": {
      "@type": "RealEstateAgent",
      "name": "Squarefooot",
      "url": baseUrl,
      "telephone": "+1-XXX-XXX-XXXX",
      "email": "contact@squarefooot.com",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Your City",
        "addressRegion": "Your State",
        "addressCountry": "US"
      },
      "openingHours": [
        "Mo-Fr 09:00-18:00",
        "Sa 09:00-16:00",
        "Su 10:00-15:00"
      ],
      "contactPoint": [
        {
          "@type": "ContactPoint",
          "telephone": "+1-XXX-XXX-XXXX",
          "contactType": "customer service",
          "availableLanguage": ["English"],
          "areaServed": "US"
        },
        {
          "@type": "ContactPoint",
          "email": "contact@squarefooot.com",
          "contactType": "customer service"
        },
        {
          "@type": "ContactPoint",
          "telephone": "+1-XXX-XXX-XXXX",
          "contactType": "sales",
          "availableLanguage": ["English"]
        }
      ],
      "sameAs": [
        "https://facebook.com/squarefooot",
        "https://twitter.com/squarefooot",
        "https://linkedin.com/company/squarefooot",
        "https://instagram.com/squarefooot"
      ]
    }
  };
}

export default function ContactPage() {
  const structuredData = generateContactPageStructuredData();
  
  return (
    <>
      {/* Structured Data for Contact Page */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />
      
      <ContactUsClient />
    </>
  );
}