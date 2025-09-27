import React from 'react'
import type { Metadata } from 'next'
import './globals.css'
import 'leaflet/dist/leaflet.css'
import Providers from './providers'
import ConditionalHeader from '../components/common/ConditionalHeader'
import Footer from '@/components/common/footer/Footer'
import RealEstateSEO from '@/components/seo/RealEstateSEO'
import PerformanceDashboard from '@/components/seo/PerformanceDashboard'

// SEO Metadata Configuration
export const metadata: Metadata = {
  title: {
    default: 'Squarefooot - Premier Real Estate Platform | Buy, Sell, Rent Properties',
    template: '%s | Squarefooot'
  },
  description: 'Discover your dream property with Squarefooot. Browse thousands of homes, apartments, and commercial properties. Expert agents, competitive prices, and seamless transactions.',
  keywords: [
    'real estate',
    'properties for sale',
    'properties for rent',
    'buy property',
    'sell property',
    'rent property',
    'real estate agents',
    'property listings',
    'homes for sale',
    'apartments for rent',
    'commercial real estate',
    'property investment',
    'real estate platform'
  ],
  authors: [{ name: 'Squarefooot Team' }],
  creator: 'Squarefooot',
  publisher: 'Squarefooot',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://squarefooot.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'Squarefooot',
    title: 'Squarefooot - Premier Real Estate Platform',
    description: 'Discover your dream property with Squarefooot. Browse thousands of properties with expert agents and seamless transactions.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Squarefooot - Real Estate Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@squarefooot',
    creator: '@squarefooot',
    title: 'Squarefooot - Premier Real Estate Platform',
    description: 'Discover your dream property with Squarefooot. Expert agents, competitive prices, seamless transactions.',
    images: ['/twitter-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
  category: 'Real Estate',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta httpEquiv="Permissions-Policy" content="payment=(self)" />
        
        {/* Structured Data for Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "RealEstateAgent",
              "name": "Squarefooot",
              "url": process.env.NEXT_PUBLIC_BASE_URL || "https://squarefooot.com",
              "logo": {
                "@type": "ImageObject",
                "url": `${process.env.NEXT_PUBLIC_BASE_URL || "https://squarefooot.com"}/logo.png`,
                "width": 200,
                "height": 60
              },
              "description": "Premier real estate platform offering comprehensive property buying, selling, and rental services with expert agents and seamless transactions.",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Your City",
                "addressRegion": "Your State",
                "addressCountry": "US"
              },
              "telephone": "+1-XXX-XXX-XXXX",
              "email": "contact@squarefooot.com",
              "sameAs": [
                "https://facebook.com/squarefooot",
                "https://twitter.com/squarefooot",
                "https://linkedin.com/company/squarefooot",
                "https://instagram.com/squarefooot"
              ],
              "areaServed": {
                "@type": "Country",
                "name": "United States"
              },
              "serviceType": [
                "Real Estate Sales",
                "Property Rental",
                "Property Management",
                "Real Estate Consultation",
                "Property Investment Advisory"
              ]
            })
          }}
        />
        
        {/* Additional SEO Meta Tags */}
        <meta name="theme-color" content="#1976d2" />
        <meta name="msapplication-TileColor" content="#1976d2" />
        <meta name="application-name" content="Squarefooot" />
        <meta name="apple-mobile-web-app-title" content="Squarefooot" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://api.mapbox.com" />
        
        {/* DNS prefetch for better performance */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        
        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body>
        <Providers>
          <RealEstateSEO>
            <ConditionalHeader />
            <main id="main-content" role="main">
              {children}
            </main>
            <Footer />
            <PerformanceDashboard />
          </RealEstateSEO>
        </Providers>
      </body>
    </html>
  )
}
