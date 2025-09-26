// Advanced Performance Utilities for Squarefooot
// Optimized for real estate website navigation and SEO

declare global {
  interface Window {
    webVitals?: {
      getLCP: (callback: (lcp: { value: number }) => void) => void;
      getFID: (callback: (fid: { value: number }) => void) => void;
      getCLS: (callback: (cls: { value: number }) => void) => void;
      getFCP: (callback: (fcp: { value: number }) => void) => void;
      getTTFB: (callback: (ttfb: { value: number }) => void) => void;
    };
  }
}

// Real Estate Specific Performance Metrics
export class RealEstatePerformanceMonitor {
  private metrics: Record<string, number> = {};
  private isProduction = process.env.NODE_ENV === 'production';

  constructor() {
    if (typeof window !== 'undefined') {
      this.initWebVitals();
      this.trackCustomMetrics();
    }
  }

  // Initialize Web Vitals monitoring
  private initWebVitals() {
    if (window.webVitals) {
      window.webVitals.getLCP((metric) => {
        this.reportMetric('LCP', metric.value, 'ms');
      });

      window.webVitals.getFID((metric) => {
        this.reportMetric('FID', metric.value, 'ms');
      });

      window.webVitals.getCLS((metric) => {
        this.reportMetric('CLS', metric.value, 'score');
      });

      window.webVitals.getFCP((metric) => {
        this.reportMetric('FCP', metric.value, 'ms');
      });

      window.webVitals.getTTFB((metric) => {
        this.reportMetric('TTFB', metric.value, 'ms');
      });
    }
  }

  // Track real estate specific metrics
  private trackCustomMetrics() {
    // Property listing load time
    this.trackPropertyListingPerformance();
    
    // Property details page performance
    this.trackPropertyDetailsPerformance();
    
    // Search functionality performance
    this.trackSearchPerformance();
    
    // Image loading performance for property galleries
    this.trackImageLoadingPerformance();
  }

  // Track property listing page performance
  private trackPropertyListingPerformance() {
    if (window.location.pathname === '/properties') {
      const startTime = performance.now();
      
      // Track when properties are fully loaded
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            const propertyCards = document.querySelectorAll('[data-property-card]');
            if (propertyCards.length > 0) {
              const loadTime = performance.now() - startTime;
              this.reportMetric('PropertyListingLoad', loadTime, 'ms');
              observer.disconnect();
            }
          }
        });
      });

      observer.observe(document.body, { childList: true, subtree: true });
    }
  }

  // Track property details page performance
  private trackPropertyDetailsPerformance() {
    if (window.location.pathname.includes('/properties/')) {
      const startTime = performance.now();
      
      // Track when property details are fully loaded
      const checkPropertyDetailsLoad = () => {
        const propertyTitle = document.querySelector('[data-property-title]');
        const propertyImages = document.querySelector('[data-property-gallery]');
        const propertyDetails = document.querySelector('[data-property-details]');
        
        if (propertyTitle && propertyImages && propertyDetails) {
          const loadTime = performance.now() - startTime;
          this.reportMetric('PropertyDetailsLoad', loadTime, 'ms');
          return true;
        }
        return false;
      };

      // Check immediately and then use observer
      if (!checkPropertyDetailsLoad()) {
        const observer = new MutationObserver(() => {
          if (checkPropertyDetailsLoad()) {
            observer.disconnect();
          }
        });

        observer.observe(document.body, { childList: true, subtree: true });
      }
    }
  }

  // Track search performance
  private trackSearchPerformance() {
    let searchStartTime = 0;
    
    // Listen for search input events
    document.addEventListener('input', (event) => {
      const target = event.target as HTMLInputElement;
      if (target.type === 'search' || target.name?.includes('search')) {
        searchStartTime = performance.now();
      }
    });

    // Listen for search results
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          const searchResults = document.querySelector('[data-search-results]');
          if (searchResults && searchStartTime > 0) {
            const searchTime = performance.now() - searchStartTime;
            this.reportMetric('SearchResponseTime', searchTime, 'ms');
            searchStartTime = 0;
          }
        }
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  // Track image loading performance for property galleries
  private trackImageLoadingPerformance() {
    const imageStartTimes = new Map<HTMLImageElement, number>();
    
    // Track when images start loading
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node instanceof Element) {
              const images = node.querySelectorAll('img[data-property-image]');
              images.forEach((img) => {
                const imageElement = img as HTMLImageElement;
                imageStartTimes.set(imageElement, performance.now());
                
                imageElement.onload = () => {
                  const startTime = imageStartTimes.get(imageElement);
                  if (startTime) {
                    const loadTime = performance.now() - startTime;
                    this.reportMetric('PropertyImageLoad', loadTime, 'ms');
                    imageStartTimes.delete(imageElement);
                  }
                };
              });
            }
          });
        }
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  // Report performance metrics
  private reportMetric(name: string, value: number, unit: string) {
    this.metrics[name] = value;
    
    if (!this.isProduction) {
      console.log(`🚀 Performance Metric - ${name}: ${value.toFixed(2)}${unit}`);
    }

    // Send to analytics in production
    if (this.isProduction && typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'performance_metric', {
        metric_name: name,
        metric_value: Math.round(value),
        metric_unit: unit,
        custom_parameter: true
      });
    }
  }

  // Get performance report
  public getPerformanceReport() {
    return {
      ...this.metrics,
      timestamp: new Date().toISOString(),
      page: window.location.pathname,
      userAgent: navigator.userAgent,
      connection: (navigator as any).connection ? {
        effectiveType: (navigator as any).connection.effectiveType,
        downlink: (navigator as any).connection.downlink,
        rtt: (navigator as any).connection.rtt
      } : null
    };
  }

  // Manual performance tracking for specific operations
  public trackOperation(name: string, operation: () => Promise<any> | any) {
    const startTime = performance.now();
    
    if (operation instanceof Promise || (operation && typeof operation.then === 'function')) {
      return operation.then((result: any) => {
        const endTime = performance.now();
        this.reportMetric(name, endTime - startTime, 'ms');
        return result;
      });
    } else {
      const result = operation();
      const endTime = performance.now();
      this.reportMetric(name, endTime - startTime, 'ms');
      return result;
    }
  }
}

// Prefetch resources for real estate navigation
export class RealEstatePrefetcher {
  private prefetchedUrls = new Set<string>();
  private prefetchQueue: string[] = [];
  private isProcessing = false;

  // Prefetch property-related resources
  public prefetchPropertyResources(propertyIds: string[]) {
    propertyIds.forEach(id => {
      const url = `/properties/${id}`;
      if (!this.prefetchedUrls.has(url)) {
        this.prefetchQueue.push(url);
        this.prefetchedUrls.add(url);
      }
    });
    
    this.processPrefetchQueue();
  }

  // Prefetch developer resources
  public prefetchDeveloperResources(developerIds: string[]) {
    developerIds.forEach(id => {
      const url = `/developers/${id}`;
      if (!this.prefetchedUrls.has(url)) {
        this.prefetchQueue.push(url);
        this.prefetchedUrls.add(url);
      }
    });
    
    this.processPrefetchQueue();
  }

  // Process prefetch queue
  private async processPrefetchQueue() {
    if (this.isProcessing || this.prefetchQueue.length === 0) return;
    
    this.isProcessing = true;
    
    while (this.prefetchQueue.length > 0) {
      const url = this.prefetchQueue.shift();
      if (url) {
        await this.prefetchUrl(url);
        // Add delay to avoid overwhelming the server
        await this.delay(100);
      }
    }
    
    this.isProcessing = false;
  }

  // Prefetch a specific URL
  private prefetchUrl(url: string): Promise<void> {
    return new Promise((resolve) => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = url;
      link.onload = () => resolve();
      link.onerror = () => resolve(); // Continue even if prefetch fails
      document.head.appendChild(link);
      
      // Cleanup after timeout
      setTimeout(() => {
        if (link.parentNode) {
          document.head.removeChild(link);
        }
        resolve();
      }, 5000);
    });
  }

  // Utility delay function
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Initialize performance monitoring globally
export const initRealEstatePerformance = () => {
  if (typeof window !== 'undefined') {
    window.realEstatePerformance = new RealEstatePerformanceMonitor();
    window.realEstatePrefetcher = new RealEstatePrefetcher();
  }
};

// Global type definitions
declare global {
  interface Window {
    realEstatePerformance?: RealEstatePerformanceMonitor;
    realEstatePrefetcher?: RealEstatePrefetcher;
    gtag?: (...args: any[]) => void;
  }
}

// Utilities are already exported above