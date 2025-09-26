import { onCLS, onINP, onFCP, onLCP, onTTFB, Metric } from 'web-vitals'

function sendToAnalytics(metric: Metric) {
  // Send to your analytics service
  const body = JSON.stringify(metric)
  
  // Use `navigator.sendBeacon()` if available, falling back to `fetch()`
  if (navigator.sendBeacon) {
    navigator.sendBeacon('/api/analytics/web-vitals', body)
  } else {
    fetch('/api/analytics/web-vitals', {
      body,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      keepalive: true,
    }).catch((error) => {
      console.error('Failed to send web vitals:', error)
    })
  }
}

export function reportWebVitals() {
  try {
    onCLS(sendToAnalytics)
    onINP(sendToAnalytics) // onFID has been replaced with onINP (Interaction to Next Paint)
    onFCP(sendToAnalytics)
    onLCP(sendToAnalytics)
    onTTFB(sendToAnalytics)
  } catch (err) {
    console.error('Web Vitals reporting failed:', err)
  }
}

// Performance observer for monitoring
export function setupPerformanceObserver() {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
    return
  }

  try {
    // Monitor resource loading performance
    const resourceObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > 1000) { // Resources taking longer than 1s
          console.warn('Slow resource detected:', {
            name: entry.name,
            duration: entry.duration,
            type: (entry as any).initiatorType,
          })
        }
      }
    })
    
    resourceObserver.observe({ entryTypes: ['resource'] })

    // Monitor long tasks
    const longTaskObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        console.warn('Long task detected:', {
          duration: entry.duration,
          startTime: entry.startTime,
        })
      }
    })

    longTaskObserver.observe({ entryTypes: ['longtask'] })

    // Monitor layout shifts
    const layoutShiftObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if ((entry as any).value > 0.1) { // Significant layout shift
          console.warn('Layout shift detected:', {
            value: (entry as any).value,
            sources: (entry as any).sources,
          })
        }
      }
    })

    layoutShiftObserver.observe({ entryTypes: ['layout-shift'] })

  } catch (err) {
    console.error('Performance observer setup failed:', err)
  }
}