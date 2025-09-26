'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { initRealEstatePerformance } from '@/utils/performance';

interface RealEstateSEOProps {
  children: React.ReactNode;
}

// Real Estate SEO optimization component
export default function RealEstateSEO({ children }: RealEstateSEOProps) {
  const pathname = usePathname();

  useEffect(() => {
    // Initialize performance monitoring
    initRealEstatePerformance();

    // Optimize images for real estate listings
    optimizePropertyImages();

    // Implement advanced prefetching strategies
    implementSmartPrefetching();

    // Track real estate specific user interactions
    trackRealEstateInteractions();

    // Optimize for Core Web Vitals
    optimizeCoreWebVitals();

  }, [pathname]);

  // Optimize property images for better performance
  const optimizePropertyImages = () => {
    // Lazy load property images with intersection observer
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          
          // Load high-quality image when in viewport
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }

          // Preload next property images
          preloadNearbyPropertyImages(img);
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: 0.1
    });

    // Observe all property images
    setTimeout(() => {
      const propertyImages = document.querySelectorAll('img[data-property-image]');
      propertyImages.forEach(img => imageObserver.observe(img));
    }, 100);
  };

  // Preload nearby property images for faster navigation
  const preloadNearbyPropertyImages = (currentImg: HTMLImageElement) => {
    const propertyCard = currentImg.closest('[data-property-card]');
    if (!propertyCard) return;

    // Find nearby property cards
    const allPropertyCards = document.querySelectorAll('[data-property-card]');
    const currentIndex = Array.from(allPropertyCards).indexOf(propertyCard);
    
    // Preload next 2 property images
    for (let i = currentIndex + 1; i <= currentIndex + 2 && i < allPropertyCards.length; i++) {
      const nextCard = allPropertyCards[i];
      const nextImg = nextCard.querySelector('img[data-src]') as HTMLImageElement;
      if (nextImg && nextImg.dataset.src) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = nextImg.dataset.src;
        link.as = 'image';
        document.head.appendChild(link);
      }
    }
  };

  // Smart prefetching for real estate navigation
  const implementSmartPrefetching = () => {
    // Prefetch property details on hover
    let hoverTimeout: NodeJS.Timeout;
    
    document.addEventListener('mouseenter', (event) => {
      const target = event.target as HTMLElement;
      const propertyLink = target.closest('a[href*="/properties/"]') as HTMLAnchorElement;
      
      if (propertyLink) {
        // Delay prefetching to avoid unnecessary requests
        hoverTimeout = setTimeout(() => {
          if (window.realEstatePrefetcher) {
            const propertyId = propertyLink.href.split('/').pop();
            if (propertyId) {
              window.realEstatePrefetcher.prefetchPropertyResources([propertyId]);
            }
          }
        }, 300);
      }
    }, true);

    document.addEventListener('mouseleave', () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
    }, true);

    // Prefetch visible property links
    const prefetchObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const link = entry.target as HTMLAnchorElement;
          const propertyId = link.href.split('/').pop();
          if (propertyId && window.realEstatePrefetcher) {
            window.realEstatePrefetcher.prefetchPropertyResources([propertyId]);
          }
          prefetchObserver.unobserve(link);
        }
      });
    }, {
      rootMargin: '200px 0px',
      threshold: 0.1
    });

    // Observe property links
    setTimeout(() => {
      const propertyLinks = document.querySelectorAll('a[href*="/properties/"]:not([data-prefetched])');
      propertyLinks.forEach(link => {
        link.setAttribute('data-prefetched', 'true');
        prefetchObserver.observe(link);
      });
    }, 1000);
  };

  // Track real estate specific interactions for SEO insights
  const trackRealEstateInteractions = () => {
    // Track property views
    if (pathname.includes('/properties/')) {
      setTimeout(() => {
        const propertyTitle = document.querySelector('[data-property-title]');
        if (propertyTitle && window.gtag) {
          window.gtag('event', 'view_item', {
            item_id: pathname.split('/').pop(),
            item_name: propertyTitle.textContent,
            item_category: 'property'
          });
        }
      }, 1000);
    }

    // Track search interactions
    document.addEventListener('input', (event) => {
      const target = event.target as HTMLInputElement;
      if (target.type === 'search' || target.name?.includes('search')) {
        setTimeout(() => {
          if (target.value.length > 2 && window.gtag) {
            window.gtag('event', 'search', {
              search_term: target.value,
              content_type: 'property_search'
            });
          }
        }, 500);
      }
    });

    // Track filter usage
    document.addEventListener('change', (event) => {
      const target = event.target as HTMLInputElement | HTMLSelectElement;
      if (target.name?.includes('filter') || target.dataset.filter) {
        if (window.gtag) {
          window.gtag('event', 'filter_used', {
            filter_type: target.name || target.dataset.filter,
            filter_value: target.value,
            content_type: 'property_listing'
          });
        }
      }
    });
  };

  // Optimize Core Web Vitals for real estate website
  const optimizeCoreWebVitals = () => {
    // Reduce Cumulative Layout Shift (CLS)
    const observeLayoutShifts = () => {
      let cumulativeLayoutShiftScore = 0;
      
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            cumulativeLayoutShiftScore += (entry as any).value;
          }
        }
      }).observe({ type: 'layout-shift', buffered: true });
      
      // Report high CLS scores
      setTimeout(() => {
        if (cumulativeLayoutShiftScore > 0.25) {
          console.warn('High CLS detected:', cumulativeLayoutShiftScore);
          if (window.gtag) {
            window.gtag('event', 'performance_issue', {
              issue_type: 'high_cls',
              cls_score: cumulativeLayoutShiftScore,
              page_path: pathname
            });
          }
        }
      }, 5000);
    };

    // Optimize Largest Contentful Paint (LCP)
    const optimizeLCP = () => {
      // Preload LCP elements
      const lcpCandidates = [
        'img[data-property-featured]',
        '.hero-image',
        '.property-main-image',
        '.property-gallery img:first-child'
      ];

      lcpCandidates.forEach(selector => {
        const element = document.querySelector(selector) as HTMLImageElement;
        if (element && element.src) {
          const link = document.createElement('link');
          link.rel = 'preload';
          link.href = element.src;
          link.as = 'image';
          document.head.appendChild(link);
        }
      });
    };

    // Optimize First Input Delay (FID)
    const optimizeFID = () => {
      // Defer non-critical JavaScript
      const deferredScripts = document.querySelectorAll('script[data-defer-load]');
      
      setTimeout(() => {
        deferredScripts.forEach(script => {
          if (script.dataset.src) {
            (script as HTMLScriptElement).src = script.dataset.src;
          }
        });
      }, 2000);
    };

    // Run optimizations
    setTimeout(() => {
      observeLayoutShifts();
      optimizeLCP();
      optimizeFID();
    }, 100);
  };

  return (
    <>
      {children}
      
      {/* Web Vitals monitoring script */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              // Web Vitals monitoring
              function vitals() {
                try {
                  new PerformanceObserver((entryList) => {
                    for (const entry of entryList.getEntries()) {
                      if (entry.entryType === 'largest-contentful-paint') {
                        console.log('LCP:', entry.startTime);
                      }
                    }
                  }).observe({entryTypes: ['largest-contentful-paint']});

                  new PerformanceObserver((entryList) => {
                    for (const entry of entryList.getEntries()) {
                      console.log('FID:', entry.processingStart - entry.startTime);
                    }
                  }).observe({entryTypes: ['first-input']});
                } catch (e) {
                  console.log('Performance observer not supported');
                }
              }

              if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', vitals);
              } else {
                vitals();
              }
            })();
          `
        }}
      />
    </>
  );
}