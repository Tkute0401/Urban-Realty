import React from "react";
import { Metadata } from "next";
import LawyerConsultancy from "@/components/common/footer/LaywerConsultancy";

// SEO Metadata for Lawyer Consultancy Service Page
export const metadata: Metadata = {
  title: "Legal Consultancy Services - Real Estate Law Experts | Squarefooot",
  description: "Expert legal consultancy services for real estate transactions, property law, documentation, title verification, contracts, and legal compliance. Professional lawyers for property deals.",
  keywords: [
    "legal consultancy",
    "real estate lawyer",
    "property law",
    "legal advice",
    "property documentation",
    "title verification",
    "real estate contracts",
    "property legal services",
    "legal compliance",
    "property dispute resolution",
    "real estate attorney",
    "legal consultation"
  ],
  alternates: {
    canonical: "/lawyer-consultancy"
  },
  openGraph: {
    title: "Legal Consultancy Services - Real Estate Law Experts | Squarefooot",
    description: "Professional legal consultancy services for real estate transactions. Expert lawyers for property documentation, title verification, and legal compliance.",
    url: "/lawyer-consultancy",
    type: "website",
    images: [
      {
        url: "/images/social/lawyer-consultancy-og.jpg",
        width: 1200,
        height: 630,
        alt: "Squarefooot Legal Consultancy Services"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Legal Consultancy Services - Squarefooot",
    description: "Expert legal consultancy services for real estate transactions and property law matters.",
    images: ["/images/social/lawyer-consultancy-twitter.jpg"]
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

// Structured Data for Lawyer Consultancy Service Page
const structuredData = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "Legal Consultancy Services",
  "description": "Expert legal consultancy services for real estate transactions and property law matters",
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
  "serviceType": "Legal Consultancy",
  "areaServed": {
    "@type": "Country",
    "name": "India"
  },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Legal Consultancy Services",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Property Documentation"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Title Verification"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Real Estate Contract Review"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Legal Compliance Advisory"
        }
      }
    ]
  },
  "priceRange": "Consultation fees vary based on service complexity",
  "url": "https://squarefooot.com/lawyer-consultancy"
};

export default function LawyerConsultancyPage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <LawyerConsultancy />
    </>
  );
}