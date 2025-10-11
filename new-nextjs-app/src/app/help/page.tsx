import React from "react";
import { Metadata } from "next";
import HelpCenter from "@/components/common/footer/HelpCenter";

// SEO Metadata for Help Center Page
export const metadata: Metadata = {
  title: "Help Center - Real Estate Support & FAQs | Squarefooot",
  description: "Get help with property search, buying, selling, renting, account management, and technical support. Find answers to frequently asked questions about Squarefooot.",
  keywords: [
    "help center",
    "real estate support",
    "property help",
    "buyer support",
    "seller help",
    "rental support",
    "frequently asked questions",
    "real estate FAQ",
    "property search help",
    "customer support",
    "urban realty help",
    "technical support"
  ],
  alternates: {
    canonical: "/help"
  },
  openGraph: {
    title: "Help Center - Real Estate Support & FAQs | Squarefooot",
    description: "Get comprehensive support for all your real estate needs. Find answers, guides, and expert assistance.",
    url: "/help",
    type: "website",
    images: [
      {
        url: "/images/social/help-og.jpg",
        width: 1200,
        height: 630,
        alt: "Squarefooot Help Center"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Help Center - Squarefooot",
    description: "Comprehensive support and FAQs for all your real estate needs.",
    images: ["/images/social/help-twitter.jpg"]
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

// Structured Data for Help Center Page
const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Help Center - Squarefooot",
  "description": "Comprehensive help center with support articles, FAQs, and customer assistance for real estate transactions",
  "url": "https://squarefooot.com/help",
  "isPartOf": {
    "@type": "WebSite",
    "name": "Squarefooot",
    "url": "https://squarefooot.com"
  },
  "publisher": {
    "@type": "RealEstateAgent",
    "name": "Squarefooot",
    "url": "https://squarefooot.com",
    "logo": {
      "@type": "ImageObject",
      "url": "https://squarefooot.com/images/logo.png"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "availableLanguage": "English"
    }
  },
  "mainEntity": {
    "@type": "FAQPage",
    "name": "Real Estate Help and Support"
  },
  "dateModified": new Date().toISOString(),
  "inLanguage": "en-US"
};

export default function HelpPage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <HelpCenter />
    </>
  );
}