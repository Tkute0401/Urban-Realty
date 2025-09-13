// Performance Optimization System
import { useCallback, useMemo, useRef, useEffect } from 'react';

// Performance metrics interface
export interface PerformanceMetrics {
  componentName: string;
  renderTime: number;
  mountTime: number;
  updateTime: number;
  memoryUsage?: number;
  timestamp: Date;
}

// Performance optimizer class
export class PerformanceOptimizer {
  private static instance: PerformanceOptimizer;
  private metrics: PerformanceMetrics[] = [];
  private observers: Map<string, PerformanceObserver> = new Map();
  private maxMetrics = 1000;

  private constructor() {
    this.initializePerformanceObservers();
  }

  static getInstance(): PerformanceOptimizer {
    if (!PerformanceOptimizer.instance) {
      PerformanceOptimizer.instance = new PerformanceOptimizer();
    }
    return PerformanceOptimizer.instance;
  }

  // Initialize performance observers
  private initializePerformanceObservers(): void {
    if (typeof window === 'undefined') return;

    // Observe long tasks
    if ('PerformanceObserver' in window) {
      try {
        const longTaskObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.duration > 50) {
              console.warn('Long task detected:', {
                duration: entry.duration,
                startTime: entry.startTime,
                name: entry.name,
              });
            }
          }
        });
        longTaskObserver.observe({ entryTypes: ['longtask'] });
        this.observers.set('longtask', longTaskObserver);
      } catch (error) {
        console.warn('Long task observer not supported:', error);
      }

      // Observe layout shifts
      try {
        const layoutShiftObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.hadRecentInput) continue;
            if (entry.value > 0.1) {
              console.warn('Layout shift detected:', {
                value: entry.value,
                startTime: entry.startTime,
              });
            }
          }
        });
        layoutShiftObserver.observe({ entryTypes: ['layout-shift'] });
        this.observers.set('layout-shift', layoutShiftObserver);
      } catch (error) {
        console.warn('Layout shift observer not supported:', error);
      }
    }
  }

  // Measure component performance
  measureComponent(
    componentName: string,
    renderTime: number,
    mountTime?: number,
    updateTime?: number
  ): void {
    const metric: PerformanceMetrics = {
      componentName,
      renderTime,
      mountTime: mountTime || 0,
      updateTime: updateTime || 0,
      memoryUsage: this.getMemoryUsage(),
      timestamp: new Date(),
    };

    this.metrics.unshift(metric);

    // Keep metrics array manageable
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(0, this.maxMetrics);
    }

    // Log slow components
    if (renderTime > 16) {
      console.warn(`Slow component render: ${componentName}`, {
        renderTime,
        mountTime,
        updateTime,
      });
    }
  }

  // Get memory usage
  private getMemoryUsage(): number | undefined {
    if (typeof window === 'undefined') return undefined;
    
    if ('memory' in performance) {
      return (performance as any).memory.usedJSHeapSize;
    }
    return undefined;
  }

  // Get performance metrics
  getMetrics(): PerformanceMetrics[] {
    return [...this.metrics];
  }

  // Get metrics for specific component
  getComponentMetrics(componentName: string): PerformanceMetrics[] {
    return this.metrics.filter(metric => metric.componentName === componentName);
  }

  // Get average render time for component
  getAverageRenderTime(componentName: string): number {
    const componentMetrics = this.getComponentMetrics(componentName);
    if (componentMetrics.length === 0) return 0;
    
    const totalTime = componentMetrics.reduce((sum, metric) => sum + metric.renderTime, 0);
    return totalTime / componentMetrics.length;
  }

  // Get performance summary
  getPerformanceSummary(): {
    totalComponents: number;
    averageRenderTime: number;
    slowComponents: Array<{ name: string; averageTime: number }>;
    memoryUsage: number | undefined;
  } {
    const componentNames = [...new Set(this.metrics.map(m => m.componentName))];
    const slowComponents = componentNames
      .map(name => ({
        name,
        averageTime: this.getAverageRenderTime(name),
      }))
      .filter(comp => comp.averageTime > 16)
      .sort((a, b) => b.averageTime - a.averageTime);

    const totalRenderTime = this.metrics.reduce((sum, metric) => sum + metric.renderTime, 0);
    const averageRenderTime = this.metrics.length > 0 ? totalRenderTime / this.metrics.length : 0;

    return {
      totalComponents: componentNames.length,
      averageRenderTime,
      slowComponents,
      memoryUsage: this.getMemoryUsage(),
    };
  }

  // Clear metrics
  clearMetrics(): void {
    this.metrics = [];
  }

  // Cleanup observers
  cleanup(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
  }
}

// Create singleton instance
export const performanceOptimizer = PerformanceOptimizer.getInstance();

// React hook for performance measurement
export const usePerformanceMeasurement = (componentName: string) => {
  const renderStartTime = useRef<number>(0);
  const mountStartTime = useRef<number>(0);
  const updateStartTime = useRef<number>(0);
  const isFirstRender = useRef<boolean>(true);

  // Measure render start
  const startRender = useCallback(() => {
    renderStartTime.current = performance.now();
  }, []);

  // Measure render end
  const endRender = useCallback(() => {
    const renderTime = performance.now() - renderStartTime.current;
    const mountTime = isFirstRender.current ? performance.now() - mountStartTime.current : 0;
    const updateTime = !isFirstRender.current ? performance.now() - updateStartTime.current : 0;

    performanceOptimizer.measureComponent(componentName, renderTime, mountTime, updateTime);

    if (isFirstRender.current) {
      isFirstRender.current = false;
    }
  }, [componentName]);

  // Measure mount start
  const startMount = useCallback(() => {
    mountStartTime.current = performance.now();
  }, []);

  // Measure update start
  const startUpdate = useCallback(() => {
    updateStartTime.current = performance.now();
  }, []);

  // Auto-measure on mount
  useEffect(() => {
    startMount();
    startRender();
    
    return () => {
      endRender();
    };
  }, [startMount, startRender, endRender]);

  // Auto-measure on update
  useEffect(() => {
    if (!isFirstRender.current) {
      startUpdate();
      startRender();
      
      return () => {
        endRender();
      };
    }
  }, [startUpdate, startRender, endRender]);

  return {
    startRender,
    endRender,
    startMount,
    startUpdate,
  };
};

// Higher-order component for performance measurement
export const withPerformanceMeasurement = <P extends object>(
  Component: React.ComponentType<P>,
  componentName?: string
) => {
  const WrappedComponent = (props: P) => {
    const name = componentName || Component.displayName || Component.name || 'Unknown';
    const { startRender, endRender } = usePerformanceMeasurement(name);

    useEffect(() => {
      startRender();
      return endRender;
    }, [startRender, endRender]);

    return <Component {...props} />;
  };

  WrappedComponent.displayName = `withPerformanceMeasurement(${componentName || Component.displayName || Component.name})`;
  return WrappedComponent;
};

// Image optimization utilities
export const optimizeImage = (
  src: string,
  width?: number,
  height?: number,
  quality: number = 80
): string => {
  if (!src) return src;

  // If it's already an optimized URL, return as is
  if (src.includes('w_') || src.includes('h_') || src.includes('q_')) {
    return src;
  }

  // For Cloudinary URLs
  if (src.includes('cloudinary.com')) {
    const parts = src.split('/');
    const uploadIndex = parts.findIndex(part => part === 'upload');
    
    if (uploadIndex !== -1) {
      const transformations = [];
      if (width) transformations.push(`w_${width}`);
      if (height) transformations.push(`h_${height}`);
      transformations.push(`q_${quality}`);
      transformations.push('f_auto');
      
      parts.splice(uploadIndex + 1, 0, transformations.join(','));
      return parts.join('/');
    }
  }

  // For other image URLs, you might want to use a different optimization service
  return src;
};

// Lazy loading utilities
export const createLazyComponent = <P extends object>(
  importFunc: () => Promise<{ default: React.ComponentType<P> }>,
  fallback?: React.ComponentType
) => {
  return React.lazy(importFunc);
};

// Memoization utilities
export const createMemoizedSelector = <T, R>(
  selector: (state: T) => R,
  equalityFn?: (a: R, b: R) => boolean
) => {
  let lastResult: R;
  let lastState: T;

  return (state: T): R => {
    if (state === lastState) {
      return lastResult;
    }

    const result = selector(state);
    
    if (equalityFn ? equalityFn(result, lastResult) : result === lastResult) {
      return lastResult;
    }

    lastState = state;
    lastResult = result;
    return result;
  };
};

// Debounce utility
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle utility
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Virtual scrolling utilities
export const calculateVirtualScrollItems = (
  containerHeight: number,
  itemHeight: number,
  scrollTop: number,
  totalItems: number
) => {
  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(startIndex + visibleCount + 1, totalItems);
  
  return {
    startIndex,
    endIndex,
    visibleCount,
    totalHeight: totalItems * itemHeight,
    offsetY: startIndex * itemHeight,
  };
};

// Bundle size optimization
export const createCodeSplitRoute = (importFunc: () => Promise<any>) => {
  return React.lazy(importFunc);
};

// Service worker utilities
export const registerServiceWorker = async (): Promise<void> => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service worker registered:', registration);
    } catch (error) {
      console.error('Service worker registration failed:', error);
    }
  }
};

// Preload utilities
export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
};

export const preloadComponent = async (importFunc: () => Promise<any>): Promise<void> => {
  try {
    await importFunc();
  } catch (error) {
    console.warn('Failed to preload component:', error);
  }
};

// Performance monitoring hook
export const usePerformanceMonitoring = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(performanceOptimizer.getMetrics());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getPerformanceSummary = useCallback(() => {
    return performanceOptimizer.getPerformanceSummary();
  }, []);

  const clearMetrics = useCallback(() => {
    performanceOptimizer.clearMetrics();
    setMetrics([]);
  }, []);

  return {
    metrics,
    getPerformanceSummary,
    clearMetrics,
  };
};

export default performanceOptimizer;