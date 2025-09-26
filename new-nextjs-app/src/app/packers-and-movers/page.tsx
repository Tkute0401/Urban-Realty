import React from "react";
import { Metadata } from "next";
import PackersMovers from "@/components/common/footer/PackersMovers";

// SEO Metadata for Packers and Movers Service Page
export const metadata: Metadata = {
  title: "Packers and Movers Services - Reliable Relocation Solutions | Urban Realty",
  description: "Professional packers and movers services for residential and commercial relocations. Safe packing, transportation, unpacking, and storage solutions for your move.",
  keywords: [
    "packers and movers",
    "relocation services",
    "moving company",
    "household shifting",
    "office relocation",
    "packing services",
    "transportation services",
    "moving and packing",
    "relocation solutions",
    "professional movers",
    "safe moving",
    "storage services"
  ],
  alternates: {
    canonical: "/packers-and-movers"
  },
  openGraph: {
    title: "Packers and Movers Services - Reliable Relocation Solutions | Urban Realty",
    description: "Professional packers and movers services for seamless residential and commercial relocations. Safe, reliable, and affordable moving solutions.",
    url: "/packers-and-movers",
    type: "website",
    images: [
      {
        url: "/images/social/packers-movers-og.jpg",
        width: 1200,
        height: 630,
        alt: "Urban Realty Packers and Movers Services"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Packers and Movers Services - Urban Realty",
    description: "Professional relocation services for safe and efficient residential and commercial moves.",
    images: ["/images/social/packers-movers-twitter.jpg"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION
  }
};

// Structured Data for Packers and Movers Service Page
const structuredData = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Packers and Movers Services",
  "description": "Professional relocation services for residential and commercial moves",
  "provider": {
    "@type": "RealEstateAgent",
    "name": "Urban Realty",
    "url": "https://urbanrealty.com",
    "logo": {
      "@type": "ImageObject",
      "url": "https://urbanrealty.com/images/logo.png"
    },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Mumbai",
      "addressCountry": "India"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "availableLanguage": "English",
      "telephone": "+91-1234567890"
    }
  },
  "serviceType": "Moving and Relocation Services",
  "areaServed": {
    "@type": "Country",
    "name": "India"
  },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Packers and Movers Services",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Residential Moving"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Office Relocation"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Packing and Unpacking"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Storage Solutions"
        }
      }
    ]
  },
  "priceRange": "Affordable pricing based on distance and services",
  "url": "https://urbanrealty.com/packers-and-movers"
};

export default function PackersAndMoversPage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <PackersMovers />
    </>
  );
}