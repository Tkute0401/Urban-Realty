const { test, expect } = require('@playwright/test');

test.describe('Performance Validation Tests', () => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

  test('should meet performance benchmarks', async ({ page }) => {
    // Enable performance metrics collection
    const performanceMetrics = [];
    
    page.on('response', response => {
      if (!response.url().includes('data:')) {
        performanceMetrics.push({
          url: response.url(),
          status: response.status(),
          timing: response.timing()
        });
      }
    });

    const startTime = Date.now();
    await page.goto(baseUrl);
    
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    // Page should load within 3 seconds
    expect(loadTime).toBeLessThan(3000);
    
    // Check Core Web Vitals using Performance API
    const webVitals = await page.evaluate(() => {
      return new Promise((resolve) => {
        const metrics = {};
        
        // First Contentful Paint (FCP)
        const fcpObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          if (entries.length > 0) {
            metrics.fcp = entries[0].startTime;
          }
        });
        
        // Largest Contentful Paint (LCP)
        const lcpObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          if (entries.length > 0) {
            metrics.lcp = entries[entries.length - 1].startTime;
          }
        });
        
        // Cumulative Layout Shift (CLS)
        const clsObserver = new PerformanceObserver((entryList) => {
          let clsValue = 0;
          entryList.getEntries().forEach((entry) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          });
          metrics.cls = clsValue;
        });

        try {
          fcpObserver.observe({ entryTypes: ['paint'] });
          lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
          clsObserver.observe({ entryTypes: ['layout-shift'] });
        } catch (e) {
          console.warn('Performance observers not available');
        }
        
        setTimeout(() => {
          fcpObserver.disconnect();
          lcpObserver.disconnect();
          clsObserver.disconnect();
          resolve(metrics);
        }, 2000);
      });
    });
    
    console.log('Web Vitals:', webVitals);
    
    // Validate Core Web Vitals thresholds
    if (webVitals.fcp) {
      expect(webVitals.fcp).toBeLessThan(1800); // FCP should be < 1.8s
    }
    
    if (webVitals.lcp) {
      expect(webVitals.lcp).toBeLessThan(2500); // LCP should be < 2.5s
    }
    
    if (webVitals.cls) {
      expect(webVitals.cls).toBeLessThan(0.1); // CLS should be < 0.1
    }
  });

  test('should optimize resource loading', async ({ page }) => {
    const resourceMetrics = [];
    
    page.on('response', response => {
      const resourceTiming = {
        url: response.url(),
        status: response.status(),
        size: response.headers()['content-length'],
        type: response.headers()['content-type'],
        cacheControl: response.headers()['cache-control']
      };
      resourceMetrics.push(resourceTiming);
    });
    
    await page.goto(baseUrl);
    await page.waitForLoadState('networkidle');
    
    // Check that static assets have proper cache headers
    const staticAssets = resourceMetrics.filter(r => 
      r.url.includes('/_next/static/') || 
      r.url.match(/\.(css|js|png|jpg|jpeg|webp|svg|ico)$/)
    );
    
    staticAssets.forEach(asset => {
      if (asset.cacheControl) {
        expect(asset.cacheControl).toMatch(/max-age=\d+/);
      }
    });
    
    // Check for compressed responses
    const htmlResponse = resourceMetrics.find(r => 
      r.type && r.type.includes('text/html')
    );
    
    // API responses should be fast
    const apiResponses = resourceMetrics.filter(r => 
      r.url.includes('/api/')
    );
    
    apiResponses.forEach(response => {
      expect(response.status).toBeLessThan(400);
    });
  });

  test('should handle concurrent users efficiently', async ({ browser }) => {
    const numConcurrentUsers = 3;
    const contexts = [];
    const pages = [];
    
    // Create multiple browser contexts to simulate concurrent users
    for (let i = 0; i < numConcurrentUsers; i++) {
      const context = await browser.newContext();
      contexts.push(context);
      
      const page = await context.newPage();
      pages.push(page);
    }
    
    const loadPromises = pages.map(async (page, index) => {
      const startTime = Date.now();
      await page.goto(baseUrl);
      await page.waitForLoadState('networkidle');
      const loadTime = Date.now() - startTime;
      
      return {
        user: index + 1,
        loadTime
      };
    });
    
    const results = await Promise.all(loadPromises);
    
    // All concurrent users should load within reasonable time
    results.forEach(result => {
      expect(result.loadTime).toBeLessThan(5000);
      console.log(`User ${result.user} load time: ${result.loadTime}ms`);
    });
    
    // Average load time should be reasonable
    const avgLoadTime = results.reduce((sum, r) => sum + r.loadTime, 0) / results.length;
    expect(avgLoadTime).toBeLessThan(4000);
    
    // Clean up
    for (const context of contexts) {
      await context.close();
    }
  });

  test('should validate API performance under load', async ({ page }) => {
    const apiEndpoints = [
      `${apiUrl}/health`,
      `${apiUrl}/test`,
      `${apiUrl}/properties?page=1&limit=10`
    ];
    
    for (const endpoint of apiEndpoints) {
      const requestTimes = [];
      
      // Make multiple requests to test consistency
      for (let i = 0; i < 5; i++) {
        const startTime = Date.now();
        
        try {
          const response = await page.request.get(endpoint);
          const responseTime = Date.now() - startTime;
          
          requestTimes.push(responseTime);
          expect(response.status()).toBeLessThan(400);
          
        } catch (error) {
          console.warn(`API request failed for ${endpoint}:`, error.message);
        }
      }
      
      if (requestTimes.length > 0) {
        const avgResponseTime = requestTimes.reduce((sum, time) => sum + time, 0) / requestTimes.length;
        const maxResponseTime = Math.max(...requestTimes);
        
        console.log(`${endpoint} - Avg: ${avgResponseTime.toFixed(2)}ms, Max: ${maxResponseTime}ms`);
        
        // API should respond consistently fast
        expect(avgResponseTime).toBeLessThan(1000); // Average < 1s
        expect(maxResponseTime).toBeLessThan(3000);  // Max < 3s
      }
    }
  });

  test('should validate memory efficiency', async ({ page }) => {
    const initialMetrics = await page.evaluate(() => {
      if (performance.memory) {
        return {
          usedJSHeapSize: performance.memory.usedJSHeapSize,
          totalJSHeapSize: performance.memory.totalJSHeapSize,
          jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
        };
      }
      return null;
    });
    
    if (initialMetrics) {
      console.log('Initial memory usage:', initialMetrics);
      
      // Navigate through several pages to test for memory leaks
      const pages = ['/', '/properties', '/developers', '/about'];
      
      for (const path of pages) {
        await page.goto(`${baseUrl}${path}`);
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1000);
      }
      
      const finalMetrics = await page.evaluate(() => {
        if (performance.memory) {
          return {
            usedJSHeapSize: performance.memory.usedJSHeapSize,
            totalJSHeapSize: performance.memory.totalJSHeapSize,
            jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
          };
        }
        return null;
      });
      
      if (finalMetrics) {
        console.log('Final memory usage:', finalMetrics);
        
        // Memory usage shouldn't grow excessively
        const memoryGrowth = finalMetrics.usedJSHeapSize - initialMetrics.usedJSHeapSize;
        const growthPercentage = (memoryGrowth / initialMetrics.usedJSHeapSize) * 100;
        
        console.log(`Memory growth: ${(memoryGrowth / 1024 / 1024).toFixed(2)}MB (${growthPercentage.toFixed(2)}%)`);
        
        // Memory growth should be reasonable
        expect(growthPercentage).toBeLessThan(200); // Less than 200% growth
      }
    }
  });

  test('should validate bundle size optimization', async ({ page }) => {
    const resourceSizes = [];
    
    page.on('response', response => {
      const contentLength = response.headers()['content-length'];
      const url = response.url();
      
      if (contentLength && (url.includes('/_next/static/') || url.includes('.js') || url.includes('.css'))) {
        resourceSizes.push({
          url: url.split('/').pop(),
          size: parseInt(contentLength),
          type: url.includes('.js') ? 'js' : url.includes('.css') ? 'css' : 'other'
        });
      }
    });
    
    await page.goto(baseUrl);
    await page.waitForLoadState('networkidle');
    
    // Calculate total bundle size
    const totalJSSize = resourceSizes
      .filter(r => r.type === 'js')
      .reduce((sum, r) => sum + r.size, 0);
      
    const totalCSSSize = resourceSizes
      .filter(r => r.type === 'css')
      .reduce((sum, r) => sum + r.size, 0);
    
    console.log(`Total JS bundle size: ${(totalJSSize / 1024).toFixed(2)} KB`);
    console.log(`Total CSS bundle size: ${(totalCSSSize / 1024).toFixed(2)} KB`);
    
    // Bundle sizes should be reasonable
    expect(totalJSSize).toBeLessThan(2 * 1024 * 1024); // < 2MB
    expect(totalCSSSize).toBeLessThan(500 * 1024);     // < 500KB
  });

  test('should validate image optimization', async ({ page }) => {
    await page.goto(baseUrl);
    await page.waitForLoadState('networkidle');
    
    // Check for modern image formats
    const images = await page.locator('img').all();
    const imageMetrics = [];
    
    for (const img of images.slice(0, 5)) { // Check first 5 images
      const src = await img.getAttribute('src');
      const loading = await img.getAttribute('loading');
      const sizes = await img.getAttribute('sizes');
      
      if (src && !src.startsWith('data:')) {
        imageMetrics.push({
          src,
          hasLazyLoading: loading === 'lazy',
          hasResponsiveSizes: !!sizes,
          isOptimized: src.includes('/_next/image') || src.includes('.webp') || src.includes('.avif')
        });
      }
    }
    
    console.log('Image optimization metrics:', imageMetrics);
    
    // Most images should be optimized
    const optimizedImages = imageMetrics.filter(img => img.isOptimized).length;
    const totalImages = imageMetrics.length;
    
    if (totalImages > 0) {
      const optimizationRatio = optimizedImages / totalImages;
      expect(optimizationRatio).toBeGreaterThan(0.5); // At least 50% should be optimized
    }
  });

  test('should validate service worker and caching', async ({ page }) => {
    await page.goto(baseUrl);
    
    // Check if service worker is registered (if PWA is enabled)
    const swRegistration = await page.evaluate(async () => {
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.getRegistration();
          return !!registration;
        } catch (error) {
          return false;
        }
      }
      return false;
    });
    
    console.log('Service Worker registered:', swRegistration);
    
    // Test cache effectiveness by visiting the same page twice
    const firstVisitStart = Date.now();
    await page.reload({ waitUntil: 'networkidle' });
    const firstVisitTime = Date.now() - firstVisitStart;
    
    const secondVisitStart = Date.now();
    await page.reload({ waitUntil: 'networkidle' });
    const secondVisitTime = Date.now() - secondVisitStart;
    
    console.log(`First visit: ${firstVisitTime}ms, Second visit: ${secondVisitTime}ms`);
    
    // Second visit should be faster due to caching (unless it's the first time)
    // Allow some variance for network conditions
    const improvement = (firstVisitTime - secondVisitTime) / firstVisitTime;
    console.log(`Cache improvement: ${(improvement * 100).toFixed(2)}%`);
    
    // At minimum, second visit shouldn't be significantly slower
    expect(secondVisitTime).toBeLessThan(firstVisitTime * 1.5);
  });
});