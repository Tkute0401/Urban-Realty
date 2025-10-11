import React from "react";
import { Metadata } from "next";
import TrustSafety from "@/components/common/footer/TrustSafety";

// SEO Metadata for Trust & Safety Page
export const metadata: Metadata = {
  title: "Trust & Safety - Secure Real Estate Transactions | Squarefooot",
  description: "Learn about Squarefooot's trust and safety measures, secure payment systems, verified property listings, fraud protection, and user safety guidelines.",
  keywords: [
    "trust and safety",
    "secure real estate transactions",
    "property safety",
    "fraud protection",
    "secure payments",
    "verified listings",
    "real estate security",
    "buyer protection",
    "seller verification",
    "safe property deals"
  ],
  alternates: {
    canonical: "/trust"
  },
  openGraph: {
    title: "Trust & Safety - Secure Real Estate Transactions | Squarefooot",
    description: "Discover Squarefooot's comprehensive trust and safety measures for secure property transactions and user protection.",
    url: "/trust",
    type: "website",
    images: [
      {
        url: "/images/social/trust-og.jpg",
        width: 1200,
        height: 630,
        alt: "Squarefooot Trust and Safety"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Trust & Safety - Squarefooot",
    description: "Comprehensive security measures and safety protocols for real estate transactions.",
    images: ["/images/social/trust-twitter.jpg"]
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

// Structured Data for Trust & Safety Page
const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Trust & Safety - Squarefooot",
  "description": "Comprehensive trust and safety measures for secure real estate transactions",
  "url": "http://localhost:3000/trust",
  "isPartOf": {
    "@type": "WebSite",
    "name": "Squarefooot",
    "url": "http://localhost:3000"
  },
  "publisher": {
    "@type": "RealEstateAgent",
    "name": "Squarefooot",
    "url": "http://localhost:3000",
    "logo": {
      "@type": "ImageObject",
      "url": "http://localhost:3000/images/logo.png"
    },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Mumbai",
      "addressCountry": "India"
    }
  },
  "about": {
    "@type": "Thing",
    "name": "Real Estate Security and Trust"
  },
  "dateModified": new Date().toISOString(),
  "inLanguage": "en-US"
};

export default function TrustPage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <TrustSafety />
    </>
  );
}