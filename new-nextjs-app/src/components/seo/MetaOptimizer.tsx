import React from 'react';
import Head from 'next/head';

interface MetaOptimizerProps {
  title?: string;
  description?: string;
  canonical?: string;
  noindex?: boolean;
  schema?: any;
  preloadImages?: string[];
  preloadFonts?: string[];
}

// Advanced meta optimizer for real estate pages
export default function MetaOptimizer({
  title,
  description,
  canonical,
  noindex = false,
  schema,
  preloadImages = [],
  preloadFonts = []
}: MetaOptimizerProps) {
  return (
    <Head>
      {/* Essential Meta Tags */}
      {title && <title>{title}</title>}
      {description && <meta name="description" content={description} />}
      {canonical && <link rel="canonical" href={canonical} />}
      
      {/* Robots Meta */}
      <meta name="robots" content={noindex ? "noindex,nofollow" : "index,follow"} />
      
      {/* Performance Optimization */}
      {preloadImages.map((src, index) => (
        <link
          key={`preload-image-${index}`}
          rel="preload"
          href={src}
          as="image"
          type="image/webp"
        />
      ))}
      
      {preloadFonts.map((href, index) => (
        <link
          key={`preload-font-${index}`}
          rel="preload"
          href={href}
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      ))}
      
      {/* Resource Hints */}
      <link rel="dns-prefetch" href="//images.unsplash.com" />
      <link rel="dns-prefetch" href="//res.cloudinary.com" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* Structured Data */}
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
      
      {/* Real Estate Specific Meta */}
      <meta name="geo.region" content="IN" />
      <meta name="geo.placename" content="India" />
      <meta name="ICBM" content="19.0760, 72.8777" />
      <meta name="DC.title" content={title || "Squarefooot"} />
      
      {/* Mobile Optimization */}
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="Squarefooot" />
      
      {/* Performance Hints */}
      <link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      
      {/* Critical CSS Preload */}
      <link rel="preload" href="/_next/static/css/app/layout.css" as="style" />
      
      {/* Service Worker for Caching */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js', { scope: '/' })
                  .then(function(registration) {
                    console.log('SW registered: ', registration);
                  })
                  .catch(function(registrationError) {
                    console.log('SW registration failed: ', registrationError);
                  });
              });
            }
          `
        }}
      />
    </Head>
  );
}