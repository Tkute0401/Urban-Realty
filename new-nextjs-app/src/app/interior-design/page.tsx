import React from "react";
import { Metadata } from "next";
import InteriorDesign from "@/components/common/footer/InteriorDesign";

// SEO Metadata for Interior Design Service Page
export const metadata: Metadata = {
  title: "Interior Design Services - Transform Your Property | Squarefooot",
  description: "Professional interior design services for homes, offices, and commercial spaces. Expert designers, custom solutions, 3D visualizations, and complete project management.",
  keywords: [
    "interior design services",
    "home interior design",
    "office interior design",
    "commercial interior design",
    "interior designers",
    "home decoration",
    "space planning",
    "interior architecture",
    "furniture design",
    "3d visualization",
    "property makeover",
    "interior consultation"
  ],
  alternates: {
    canonical: "/interior-design"
  },
  openGraph: {
    title: "Interior Design Services - Transform Your Property | Squarefooot",
    description: "Transform your space with professional interior design services. Expert designers, custom solutions, and complete project management.",
    url: "/interior-design",
    type: "website",
    images: [
      {
        url: "/images/social/interior-design-og.jpg",
        width: 1200,
        height: 630,
        alt: "Squarefooot Interior Design Services"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Interior Design Services - Squarefooot",
    description: "Professional interior design services to transform your residential and commercial spaces.",
    images: ["/images/social/interior-design-twitter.jpg"]
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

// Structured Data for Interior Design Service Page
const structuredData = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Interior Design Services",
  "description": "Professional interior design services for residential and commercial properties",
  "provider": {
    "@type": "RealEstateAgent",
    "name": "Squarefooot",
    "url": "https://squarefooot.com",
    "logo": {
      "@type": "ImageObject",
      "url": "https://squarefooot.com/images/logo.png"
    },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Mumbai",
      "addressCountry": "India"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "availableLanguage": "English"
    }
  },
  "serviceType": "Interior Design",
  "areaServed": {
    "@type": "Country",
    "name": "India"
  },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Interior Design Services",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Home Interior Design"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Office Interior Design"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Commercial Space Design"
        }
      }
    ]
  },
  "url": "https://urbanrealty.com/interior-design"
};

export default function InteriorDesignPage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <InteriorDesign />
    </>
  );
}