import React from "react";
import type { Metadata } from 'next';
import PrivacyPolicyClient from "@/components/privacy/PrivacyPolicyClient";

// SEO Metadata for Privacy Policy Page
export const metadata: Metadata = {
  title: 'Privacy Policy - Squarefooot | Data Protection & Privacy',
  description: 'Read Squarefooot\'s privacy policy to understand how we collect, use, and protect your personal information. Learn about your privacy rights and our data protection practices.',
  keywords: [
    'privacy policy',
    'data protection',
    'privacy rights',
    'personal information',
    'data security',
    'information privacy',
    'user privacy',
    'data collection',
    'privacy practices',
    'gdpr compliance'
  ],
  authors: [{ name: 'Squarefooot' }],
  openGraph: {
    title: 'Privacy Policy - Squarefooot',
    description: 'Learn about Squarefooot\'s privacy policy and how we protect your personal information and data.',
    type: 'website',
    images: [
      {
        url: '/privacy-policy.jpg',
        width: 1200,
        height: 630,
        alt: 'Privacy Policy - Squarefooot',
      },
    ],
    siteName: 'Squarefooot',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Privacy Policy - Squarefooot',
    description: 'Read our privacy policy to understand how we protect your personal information and data.',
    images: ['/privacy-policy.jpg'],
  },
  alternates: {
    canonical: '/privacy-policy',
  },
  robots: {
    index: true,
    follow: true,
  },
};

// Generate structured data for Privacy Policy Page
function generatePrivacyPolicyStructuredData() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://squarefooot.com';
  
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Privacy Policy",
    "url": `${baseUrl}/privacy-policy`,
    "description": "Squarefooot's privacy policy outlining our data protection practices and your privacy rights.",
    "mainEntity": {
      "@type": "PrivacyPolicy",
      "name": "Squarefooot Privacy Policy",
      "url": `${baseUrl}/privacy-policy`,
      "datePublished": new Date().toISOString().split('T')[0],
      "dateModified": new Date().toISOString().split('T')[0],
      "publisher": {
        "@type": "Organization",
        "name": "Squarefooot",
        "url": baseUrl
      },
      "about": "Data protection and privacy practices of Squarefooot"
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": baseUrl
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Privacy Policy",
          "item": `${baseUrl}/privacy-policy`
        }
      ]
    }
  };
}

export default function PrivacyPolicyPage() {
  const structuredData = generatePrivacyPolicyStructuredData();
  
  return (
    <>
      {/* Structured Data for Privacy Policy Page */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />
      
      <PrivacyPolicyClient />
    </>
  );
}