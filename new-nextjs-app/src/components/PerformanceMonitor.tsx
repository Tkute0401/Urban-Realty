'use client';

import { useEffect } from 'react';
import { getPerformanceMonitor } from '@/lib/performance';

interface PerformanceMonitorProps {
  enableReporting?: boolean;
  enableConsoleLogging?: boolean;
}

export default function PerformanceMonitor({ 
  enableReporting = true, 
  enableConsoleLogging = false 
}: PerformanceMonitorProps) {
  useEffect(() => {
    if (!enableReporting) return;

    const monitor = getPerformanceMonitor();

    // Report initial page load metrics after a delay
    const reportTimeout = setTimeout(() => {
      if (enableConsoleLogging) {
        console.log(monitor.generateReport());
      }
    }, 3000);

    // Report metrics when page becomes hidden (user navigates away)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        const metrics = monitor.getMetrics();
        
        // Send final metrics to analytics
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'page_performance', {
            event_category: 'Performance',
            page_load_time: Math.round(metrics.pageLoadTime),
            fcp: metrics.firstContentfulPaint ? Math.round(metrics.firstContentfulPaint) : undefined,
            lcp: metrics.largestContentfulPaint ? Math.round(metrics.largestContentfulPaint) : undefined,
            fid: metrics.firstInputDelay ? Math.round(metrics.firstInputDelay) : undefined,
            cls: metrics.cumulativeLayoutShift ? Math.round(metrics.cumulativeLayoutShift * 1000) : undefined,
          });
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearTimeout(reportTimeout);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      monitor.destroy();
    };
  }, [enableReporting, enableConsoleLogging]);

  // This component doesn't render anything
  return null;
}

// Hook for manual performance tracking in components
export function usePerformanceTracking() {
  const monitor = getPerformanceMonitor();
  
  return {
    markStart: (name: string) => monitor.markUserTiming(name),
    markEnd: (name: string, startMark: string) => monitor.measureUserTiming(name, startMark),
    getMetrics: () => monitor.getMetrics(),
  };
}