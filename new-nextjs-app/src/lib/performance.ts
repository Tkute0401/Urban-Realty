// Performance monitoring utilities for Squarefooot

interface PerformanceMetrics {
  pageLoadTime: number;
  firstContentfulPaint?: number;
  largestContentfulPaint?: number;
  firstInputDelay?: number;
  cumulativeLayoutShift?: number;
  timeToInteractive?: number;
}

interface UserTiming {
  name: string;
  startTime: number;
  duration?: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics = { pageLoadTime: 0 };
  private userTimings: UserTiming[] = [];
  private observer?: PerformanceObserver;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeObservers();
      this.measurePageLoadTime();
    }
  }

  private initializeObservers() {
    // Core Web Vitals Observer
    if ('PerformanceObserver' in window) {
      this.observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          switch (entry.entryType) {
            case 'paint':
              if (entry.name === 'first-contentful-paint') {
                this.metrics.firstContentfulPaint = entry.startTime;
              }
              break;
            case 'largest-contentful-paint':
              this.metrics.largestContentfulPaint = entry.startTime;
              break;
            case 'first-input':
              // @ts-ignore
              this.metrics.firstInputDelay = entry.processingStart - entry.startTime;
              break;
            case 'layout-shift':
              // @ts-ignore
              if (!entry.hadRecentInput) {
                // @ts-ignore
                this.metrics.cumulativeLayoutShift = (this.metrics.cumulativeLayoutShift || 0) + entry.value;
              }
              break;
            case 'navigation':
              // @ts-ignore
              this.metrics.timeToInteractive = entry.loadEventEnd - entry.fetchStart;
              break;
          }
        });
      });

      try {
        this.observer.observe({ entryTypes: ['paint', 'largest-contentful-paint', 'first-input', 'layout-shift', 'navigation'] });
      } catch (error) {
        console.warn('Performance observer not supported:', error);
      }
    }

    // Web Vitals polyfill support
    this.initializeWebVitals();
  }

  private async initializeWebVitals() {
    try {
      const { getCLS, getFID, getFCP, getLCP, getTTFB } = await import('web-vitals');
      
      getCLS((metric) => {
        this.metrics.cumulativeLayoutShift = metric.value;
        this.reportMetric('CLS', metric.value);
      });
      
      getFID((metric) => {
        this.metrics.firstInputDelay = metric.value;
        this.reportMetric('FID', metric.value);
      });
      
      getFCP((metric) => {
        this.metrics.firstContentfulPaint = metric.value;
        this.reportMetric('FCP', metric.value);
      });
      
      getLCP((metric) => {
        this.metrics.largestContentfulPaint = metric.value;
        this.reportMetric('LCP', metric.value);
      });
      
      getTTFB((metric) => {
        this.reportMetric('TTFB', metric.value);
      });
    } catch (error) {
      console.warn('Web Vitals library not available:', error);
    }
  }

  private measurePageLoadTime() {
    if (typeof window !== 'undefined' && window.performance) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        this.metrics.pageLoadTime = navigation.loadEventEnd - navigation.fetchStart;
      }
    }
  }

  public markUserTiming(name: string) {
    if (typeof window !== 'undefined' && window.performance) {
      performance.mark(name);
      this.userTimings.push({
        name,
        startTime: performance.now(),
      });
    }
  }

  public measureUserTiming(name: string, startMark: string) {
    if (typeof window !== 'undefined' && window.performance) {
      performance.measure(name, startMark);
      const measure = performance.getEntriesByName(name)[0];
      if (measure) {
        const existingTiming = this.userTimings.find(t => t.name === startMark);
        if (existingTiming) {
          existingTiming.duration = measure.duration;
        }
      }
    }
  }

  private reportMetric(name: string, value: number) {
    // Send metrics to analytics service
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'web_vitals', {
        event_category: 'Performance',
        event_label: name,
        value: Math.round(name === 'CLS' ? value * 1000 : value),
        non_interaction: true,
      });
    }

    // Console log for debugging
    console.log(`Performance Metric - ${name}: ${value}`);
  }

  public getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  public getUserTimings(): UserTiming[] {
    return [...this.userTimings];
  }

  public generateReport(): string {
    const metrics = this.getMetrics();
    const timings = this.getUserTimings();
    
    let report = '=== Performance Report ===\n';
    report += `Page Load Time: ${metrics.pageLoadTime}ms\n`;
    
    if (metrics.firstContentfulPaint) {
      report += `First Contentful Paint: ${metrics.firstContentfulPaint}ms\n`;
    }
    
    if (metrics.largestContentfulPaint) {
      report += `Largest Contentful Paint: ${metrics.largestContentfulPaint}ms\n`;
    }
    
    if (metrics.firstInputDelay) {
      report += `First Input Delay: ${metrics.firstInputDelay}ms\n`;
    }
    
    if (metrics.cumulativeLayoutShift) {
      report += `Cumulative Layout Shift: ${metrics.cumulativeLayoutShift}\n`;
    }
    
    if (metrics.timeToInteractive) {
      report += `Time to Interactive: ${metrics.timeToInteractive}ms\n`;
    }
    
    if (timings.length > 0) {
      report += '\n=== User Timings ===\n';
      timings.forEach(timing => {
        report += `${timing.name}: ${timing.duration || 'pending'}ms\n`;
      });
    }
    
    return report;
  }

  public destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

// Singleton instance
let performanceMonitor: PerformanceMonitor | null = null;

export function getPerformanceMonitor(): PerformanceMonitor {
  if (!performanceMonitor && typeof window !== 'undefined') {
    performanceMonitor = new PerformanceMonitor();
  }
  return performanceMonitor!;
}

export function reportCustomMetric(name: string, value: number) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'custom_metric', {
      event_category: 'Performance',
      event_label: name,
      value: Math.round(value),
      non_interaction: true,
    });
  }
}

// Performance timing utilities
export function measureAsyncOperation<T>(
  name: string,
  operation: () => Promise<T>
): Promise<T> {
  const startTime = performance.now();
  
  return operation().finally(() => {
    const duration = performance.now() - startTime;
    reportCustomMetric(name, duration);
  });
}

export function measureSyncOperation<T>(
  name: string,
  operation: () => T
): T {
  const startTime = performance.now();
  const result = operation();
  const duration = performance.now() - startTime;
  reportCustomMetric(name, duration);
  return result;
}

// Types for global gtag function
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}