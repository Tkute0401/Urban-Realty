import React from 'react';
import type { Metadata } from 'next';
import DevelopersPageWrapper from './DevelopersPageWrapper';

// Force dynamic rendering to prevent static generation issues
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Real Estate Developers | Squarefooot',
  description: 'Browse our network of trusted real estate developers. Find developers for your next property investment or development project.',
  keywords: [
    'real estate developers',
    'property developers',
    'construction companies',
    'real estate investment',
    'property development',
    'developer listings'
  ],
  openGraph: {
    title: 'Real Estate Developers | Squarefooot',
    description: 'Browse our network of trusted real estate developers. Find developers for your next property investment or development project.',
    type: 'website',
    images: [
      {
        url: '/og-developers-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Squarefooot Real Estate Developers',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Real Estate Developers | Squarefooot',
    description: 'Browse our network of trusted real estate developers. Find developers for your next property investment or development project.',
    images: ['/twitter-developers-image.jpg'],
  },
  alternates: {
    canonical: '/developers',
  },
};

export default function DevelopersPage() {
  return <DevelopersPageWrapper />;
}