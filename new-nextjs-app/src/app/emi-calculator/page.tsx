import React from "react";
import type { Metadata } from 'next';
import EMICalculatorClient from "@/components/calculator/EMICalculatorClient";

// SEO Metadata for EMI Calculator Page
export const metadata: Metadata = {
  title: 'EMI Calculator - Calculate Home Loan EMI | Squarefooot',
  description: 'Calculate your home loan EMI with our free EMI calculator. Get instant results for loan amount, interest rate, and tenure. Plan your property purchase with accurate EMI calculations.',
  keywords: [
    'emi calculator',
    'home loan emi calculator',
    'loan calculator',
    'mortgage calculator',
    'property loan calculator',
    'real estate finance',
    'home loan planning',
    'property financing',
    'loan emi calculation',
    'mortgage planning'
  ],
  authors: [{ name: 'Squarefooot' }],
  openGraph: {
    title: 'EMI Calculator - Plan Your Home Loan | Squarefooot',
    description: 'Use our free EMI calculator to calculate home loan EMIs and plan your property purchase. Get instant, accurate results.',
    type: 'website',
    images: [
      {
        url: '/emi-calculator.jpg',
        width: 1200,
        height: 630,
        alt: 'EMI Calculator - Home Loan Planning Tool',
      },
    ],
    siteName: 'Squarefooot',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EMI Calculator - Plan Your Home Loan | Squarefooot',
    description: 'Calculate home loan EMIs with our free calculator. Plan your property purchase with accurate EMI calculations.',
    images: ['/emi-calculator.jpg'],
  },
  alternates: {
    canonical: '/emi-calculator',
  },
};

// Generate structured data for EMI Calculator
function generateEMICalculatorStructuredData() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://squarefooot.com';
  
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "EMI Calculator",
    "url": `${baseUrl}/emi-calculator`,
    "description": "Free home loan EMI calculator to help you plan your property purchase with accurate monthly installment calculations.",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "INR"
    },
    "featureList": [
      "Calculate EMI for home loans",
      "Instant calculation results",
      "Loan amount planning",
      "Interest rate comparison",
      "Tenure optimization"
    ],
    "provider": {
      "@type": "Organization",
      "name": "Squarefooot",
      "url": baseUrl
    },
    "mainEntity": {
      "@type": "SoftwareApplication",
      "name": "Home Loan EMI Calculator",
      "applicationCategory": "FinanceApplication",
      "description": "Calculate your monthly EMI payments for home loans with different loan amounts, interest rates, and tenure options."
    }
  };
}

export default function EMICalculatorPage() {
  const structuredData = generateEMICalculatorStructuredData();
  
  return (
    <>
      {/* Structured Data for EMI Calculator */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />
      
      <EMICalculatorClient />
    </>
  );
}