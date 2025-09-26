import { onCLS, onINP, onFCP, onLCP, onTTFB, Metric } from 'web-vitals';

// Railway-safe web vitals implementation
const sendToAnalytics = (metric: Metric) => {
  // Skip analytics in Railway build environment
  if (process.env.RAILWAY_ENVIRONMENT && typeof window === 'undefined') {
    return;
  }
  
  // Only send analytics if window is available (client-side)
  if (typeof window !== 'undefined') {
    // Send to your analytics service
    console.log('Web Vital:', metric);
    
    // Example: Send to Google Analytics
    if (window.gtag) {
      window.gtag('event', metric.name, {
        custom_parameter_1: metric.value,
        custom_parameter_2: metric.id,
        custom_parameter_3: metric.name,
      });
    }
  }
};

// Initialize web vitals with Railway safety checks
export const initWebVitals = () => {
  // Only initialize on client-side
  if (typeof window === 'undefined') return;
  
  try {
    onCLS(sendToAnalytics);
    onINP(sendToAnalytics); // Updated from onFID to onINP
    onFCP(sendToAnalytics);
    onLCP(sendToAnalytics);
    onTTFB(sendToAnalytics);
  } catch (error) {
    console.warn('Failed to initialize web vitals:', error);
  }
};

// Legacy exports for compatibility
export const reportWebVitals = initWebVitals;

export const setupPerformanceObserver = () => {
  if (typeof window === 'undefined') return;
  
  // Performance observer setup for Railway-safe monitoring
  try {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          console.log('Performance entry:', entry.name, entry.startTime);
        }
      });
      
      observer.observe({ entryTypes: ['measure', 'navigation', 'resource'] });
    }
  } catch (error) {
    console.warn('Performance observer setup failed:', error);
  }
};

export default initWebVitals;