import React from "react";
import { Metadata } from "next";
import TermsConditions from "@/components/common/footer/TermsConditions";

// SEO Metadata for Terms & Conditions Page
export const metadata: Metadata = {
  title: "Terms & Conditions - Urban Realty Legal Agreement",
  description: "Read Urban Realty's terms and conditions, legal agreements, user responsibilities, and platform policies for buying, selling, and renting properties.",
  keywords: [
    "terms and conditions",
    "legal agreement",
    "real estate terms",
    "property platform policy",
    "user agreement",
    "urban realty terms",
    "real estate legal",
    "platform terms of service",
    "property listing terms",
    "user responsibilities"
  ],
  alternates: {
    canonical: "/terms"
  },
  openGraph: {
    title: "Terms & Conditions - Urban Realty Legal Agreement",
    description: "Read Urban Realty's comprehensive terms and conditions for real estate transactions and platform usage.",
    url: "/terms",
    type: "website",
    images: [
      {
        url: "/images/social/terms-og.jpg",
        width: 1200,
        height: 630,
        alt: "Urban Realty Terms and Conditions"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms & Conditions - Urban Realty",
    description: "Comprehensive legal agreements and policies for Urban Realty platform users.",
    images: ["/images/social/terms-twitter.jpg"]
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

// Structured Data for Terms Page
const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Terms & Conditions - Urban Realty",
  "description": "Comprehensive terms and conditions for Urban Realty real estate platform",
  "url": "https://urbanrealty.com/terms",
  "isPartOf": {
    "@type": "WebSite",
    "name": "Urban Realty",
    "url": "https://urbanrealty.com"
  },
  "publisher": {
    "@type": "RealEstateAgent",
    "name": "Urban Realty",
    "url": "https://urbanrealty.com",
    "logo": {
      "@type": "ImageObject",
      "url": "https://urbanrealty.com/images/logo.png"
    }
  },
  "dateModified": new Date().toISOString(),
  "inLanguage": "en-US"
};

export default function TermsPage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <TermsConditions />
    </>
  );
}