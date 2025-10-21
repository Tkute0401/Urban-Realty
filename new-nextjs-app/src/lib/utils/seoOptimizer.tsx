// SEO Optimization System
import React from 'react';
import Head from 'next/head';

// SEO metadata interface
export interface SEOMetadata {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  ogType?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  structuredData?: any;
  robots?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
}

// Default SEO configuration
const defaultSEO: SEOMetadata = {
  title: 'Squarefooot - Premium Real Estate Platform',
  description: 'Find your dream home with Squarefooot. Premium properties, expert agents, and comprehensive real estate services.',
  keywords: ['real estate', 'properties', 'homes', 'apartments', 'buy', 'sell', 'rent'],
  ogType: 'website',
  twitterCard: 'summary_large_image',
  robots: 'index, follow',
};

// SEO optimizer class
export class SEOOptimizer {
  private static instance: SEOOptimizer;
  public baseUrl: string;
  private defaultImage: string;

  private constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://squarefooot.com';
    this.defaultImage = `${this.baseUrl}/images/og-default.jpg`;
  }

  static getInstance(): SEOOptimizer {
    if (!SEOOptimizer.instance) {
      SEOOptimizer.instance = new SEOOptimizer();
    }
    return SEOOptimizer.instance;
  }

  // Generate SEO metadata for a page
  generateMetadata(pageMetadata: Partial<SEOMetadata>): SEOMetadata {
    const metadata: SEOMetadata = {
      ...defaultSEO,
      ...pageMetadata,
    };

    // Ensure required fields are present
    if (!metadata.ogTitle) metadata.ogTitle = metadata.title;
    if (!metadata.ogDescription) metadata.ogDescription = metadata.description;
    if (!metadata.ogImage) metadata.ogImage = this.defaultImage;
    if (!metadata.ogUrl) metadata.ogUrl = this.baseUrl;
    if (!metadata.twitterTitle) metadata.twitterTitle = metadata.title;
    if (!metadata.twitterDescription) metadata.twitterDescription = metadata.description;
    if (!metadata.twitterImage) metadata.twitterImage = this.defaultImage;

    return metadata;
  }

  // Generate structured data for properties
  generatePropertyStructuredData(property: any): any {
    return {
      '@context': 'https://schema.org',
      '@type': 'RealEstateListing',
      name: property.title,
      description: property.description,
      url: `${this.baseUrl}/properties/${property.id}`,
      image: property.images?.[0] || this.defaultImage,
      address: {
        '@type': 'PostalAddress',
        streetAddress: property.address,
        addressLocality: property.city,
        addressRegion: property.state,
        postalCode: property.zipCode,
        addressCountry: 'IN',
      },
      geo: property.coordinates ? {
        '@type': 'GeoCoordinates',
        latitude: property.coordinates.lat,
        longitude: property.coordinates.lng,
      } : undefined,
      offers: {
        '@type': 'Offer',
        price: property.price,
        priceCurrency: 'INR',
        availability: property.status === 'For Sale' ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      },
      floorSize: property.area ? {
        '@type': 'QuantitativeValue',
        value: property.area,
        unitCode: 'SQM',
      } : undefined,
      numberOfRooms: property.bedrooms,
      numberOfBathroomsTotal: property.bathrooms,
      datePosted: property.createdAt,
      validFrom: property.createdAt,
    };
  }

  // Generate structured data for organization
  generateOrganizationStructuredData(): any {
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Squarefooot',
      url: this.baseUrl,
      logo: `${this.baseUrl}/images/logo.png`,
      description: 'Premium real estate platform offering comprehensive property services',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '123 Business Street',
        addressLocality: 'Mumbai',
        addressRegion: 'Maharashtra',
        postalCode: '400001',
        addressCountry: 'IN',
      },
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+91-9876543210',
        contactType: 'customer service',
        availableLanguage: ['English', 'Hindi'],
      },
      sameAs: [
        'https://facebook.com/squarefooot',
        'https://twitter.com/squarefooot',
        'https://linkedin.com/company/squarefooot',
      ],
    };
  }

  // Generate structured data for breadcrumbs
  generateBreadcrumbStructuredData(breadcrumbs: Array<{ name: string; url: string }>): any {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
        item: `${this.baseUrl}${crumb.url}`,
      })),
    };
  }

  // Generate sitemap data
  generateSitemapData(pages: Array<{ url: string; lastmod?: string; changefreq?: string; priority?: number }>): string {
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `  <url>
    <loc>${this.baseUrl}${page.url}</loc>
    ${page.lastmod ? `<lastmod>${page.lastmod}</lastmod>` : ''}
    ${page.changefreq ? `<changefreq>${page.changefreq}</changefreq>` : ''}
    ${page.priority ? `<priority>${page.priority}</priority>` : ''}
  </url>`).join('\n')}
</urlset>`;

    return sitemap;
  }

  // Generate robots.txt content
  generateRobotsTxt(): string {
    return `User-agent: *
Allow: /

Sitemap: ${this.baseUrl}/sitemap.xml

# Disallow admin and private areas
Disallow: /admin/
Disallow: /agent/
Disallow: /user/
Disallow: /api/
Disallow: /_next/
Disallow: /static/`;
  }

  // Optimize images for SEO
  optimizeImageForSEO(src: string, alt: string, width?: number, height?: number): string {
    // Add proper alt text and dimensions for better SEO
    return src;
  }

  // Generate meta tags for Next.js Head component
  generateMetaTags(metadata: SEOMetadata): React.JSX.Element {
    return (
      <Head>
        {/* Basic Meta Tags */}
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        {metadata.keywords && <meta name="keywords" content={metadata.keywords.join(', ')} />}
        {metadata.author && <meta name="author" content={metadata.author} />}
        {metadata.robots && <meta name="robots" content={metadata.robots} />}
        
        {/* Canonical URL */}
        {metadata.canonical && <link rel="canonical" href={metadata.canonical} />}
        
        {/* Open Graph Tags */}
        <meta property="og:title" content={metadata.ogTitle} />
        <meta property="og:description" content={metadata.ogDescription} />
        <meta property="og:image" content={metadata.ogImage} />
        <meta property="og:url" content={metadata.ogUrl} />
        <meta property="og:type" content={metadata.ogType} />
        {metadata.publishedTime && <meta property="article:published_time" content={metadata.publishedTime} />}
        {metadata.modifiedTime && <meta property="article:modified_time" content={metadata.modifiedTime} />}
        {metadata.section && <meta property="article:section" content={metadata.section} />}
        {metadata.tags && metadata.tags.map(tag => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}
        
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content={metadata.twitterCard} />
        <meta name="twitter:title" content={metadata.twitterTitle} />
        <meta name="twitter:description" content={metadata.twitterDescription} />
        <meta name="twitter:image" content={metadata.twitterImage} />
        
        {/* Structured Data */}
        {metadata.structuredData && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(metadata.structuredData),
            }}
          />
        )}
      </Head>
    );
  }
}

// Create singleton instance
export const seoOptimizer = SEOOptimizer.getInstance();

// React hook for SEO
export const useSEO = (metadata: Partial<SEOMetadata>) => {
  const seoMetadata = seoOptimizer.generateMetadata(metadata);
  
  return {
    metadata: seoMetadata,
    metaTags: seoOptimizer.generateMetaTags(seoMetadata),
  };
};

// SEO component for pages
export const SEOHead: React.FC<{ metadata: Partial<SEOMetadata> }> = ({ metadata }) => {
  const { metaTags } = useSEO(metadata);
  return metaTags;
};

// Utility functions for common SEO scenarios
export const generatePropertySEO = (property: any): Partial<SEOMetadata> => {
  return {
    title: `${property.title} - ${property.city} | Squarefooot`,
    description: `${property.description.substring(0, 160)}... Find this ${property.type} in ${property.city} for ${property.status.toLowerCase()}.`,
    keywords: [
      property.type.toLowerCase(),
      property.city.toLowerCase(),
      property.state.toLowerCase(),
      'real estate',
      'property',
      'home',
      'apartment',
      'villa',
    ],
    ogImage: property.images?.[0] || undefined,
    structuredData: seoOptimizer.generatePropertyStructuredData(property),
  };
};

export const generatePageSEO = (pageName: string, description: string): Partial<SEOMetadata> => {
  return {
    title: `${pageName} | Squarefooot`,
    description,
    keywords: [pageName.toLowerCase(), 'real estate', 'urban realty'],
  };
};

export const generateBlogSEO = (post: any): Partial<SEOMetadata> => {
  return {
    title: `${post.title} | Squarefooot Blog`,
    description: post.excerpt || post.content.substring(0, 160) + '...',
    keywords: post.tags || [],
    ogType: 'article',
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt,
    section: post.category,
    tags: post.tags,
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.excerpt,
      datePublished: post.publishedAt,
      dateModified: post.updatedAt,
      author: {
        '@type': 'Organization',
        name: 'Squarefooot',
      },
      publisher: {
        '@type': 'Organization',
        name: 'Squarefooot',
        logo: {
          '@type': 'ImageObject',
          url: `${SEOOptimizer.getInstance().baseUrl}/images/logo.png`,
        },
      },
    },
  };
};

export default seoOptimizer;