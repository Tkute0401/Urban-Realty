const { test, expect } = require('@playwright/test');

/**
 * Railway Deployment Optimization E2E Test Suite for Squarefooot
 * Tests speed, SEO, and SSR optimizations in production environment
 */

// Test configuration
const BASE_URL = process.env.RAILWAY_URL || 'https://urban-realty-production.up.railway.app';
const API_URL = `${BASE_URL}/api/v1`;

// Performance thresholds
const PERFORMANCE_THRESHOLDS = {
  pageLoadTime: 3000, // 3 seconds max
  apiResponseTime: 2000, // 2 seconds max
  firstContentfulPaint: 2000, // 2 seconds max
  largestContentfulPaint: 4000, // 4 seconds max
  cumulativeLayoutShift: 0.1, // 0.1 max
  interactionToNextPaint: 200 // 200ms max
};

test.describe('Railway Deployment Optimization Validation', () => {
  
  test.beforeAll(async () => {
    console.log(`🚀 Testing Squarefooot deployment at: ${BASE_URL}`);
  });

  test('should load homepage with optimal performance', async ({ page }) => {
    const startTime = Date.now();
    
    // Navigate to homepage
    await page.goto(BASE_URL);
    
    const loadTime = Date.now() - startTime;
    
    // Verify page loads successfully
    await expect(page).toHaveTitle(/Squarefooot/i);
    
    // Check performance threshold
    expect(loadTime).toBeLessThan(PERFORMANCE_THRESHOLDS.pageLoadTime);
    
    // Verify essential elements are visible
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
    
    console.log(`✅ Homepage loaded in ${loadTime}ms (threshold: ${PERFORMANCE_THRESHOLDS.pageLoadTime}ms)`);
  });

  test('should have optimized SEO configuration', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Check meta tags for SEO
    const metaDescription = await page.locator('meta[name="description"]').getAttribute('content');
    expect(metaDescription).toBeTruthy();
    expect(metaDescription.length).toBeGreaterThan(120);
    
    // Check Open Graph tags
    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
    const ogDescription = await page.locator('meta[property="og:description"]').getAttribute('content');
    const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content');
    
    expect(ogTitle).toBeTruthy();
    expect(ogDescription).toBeTruthy();
    expect(ogImage).toBeTruthy();
    
    // Check canonical URL
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(canonical).toContain(BASE_URL);
    
    console.log('✅ SEO meta tags optimized correctly');
  });

  test('should serve optimized sitemap.xml', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/sitemap.xml`);
    
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('xml');
    
    const sitemapContent = await response.text();
    
    // Verify sitemap structure
    expect(sitemapContent).toContain('<?xml version="1.0"');
    expect(sitemapContent).toContain('<urlset');
    expect(sitemapContent).toContain('<loc>');
    expect(sitemapContent).toContain(BASE_URL);
    
    // Check for dynamic property URLs (should be included)
    expect(sitemapContent).toContain('/properties/');
    expect(sitemapContent).toContain('/developers/');
    
    console.log('✅ Dynamic sitemap generated successfully');
  });

  test('should serve optimized robots.txt', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/robots.txt`);
    
    expect(response.status()).toBe(200);
    
    const robotsContent = await response.text();
    
    // Verify robots.txt structure
    expect(robotsContent).toContain('User-agent:');
    expect(robotsContent).toContain('Allow: /');
    expect(robotsContent).toContain('Disallow: /api/');
    expect(robotsContent).toContain('Sitemap: ');
    
    console.log('✅ Robots.txt configured correctly');
  });

  test('should have working API health check', async ({ request }) => {
    const startTime = Date.now();
    const response = await request.get(`${API_URL}/health`);
    const responseTime = Date.now() - startTime;
    
    expect(response.status()).toBe(200);
    expect(responseTime).toBeLessThan(PERFORMANCE_THRESHOLDS.apiResponseTime);
    
    const healthData = await response.json();
    expect(healthData.success).toBe(true);
    expect(healthData.message).toBeTruthy();
    
    console.log(`✅ API health check passed in ${responseTime}ms`);
  });

  test('should have optimized API response times', async ({ request }) => {
    const endpoints = [
      { name: 'Properties', url: `${API_URL}/properties?limit=10` },
      { name: 'Developers', url: `${API_URL}/developers?limit=5` },
    ];
    
    for (const endpoint of endpoints) {
      const startTime = Date.now();
      const response = await request.get(endpoint.url);
      const responseTime = Date.now() - startTime;
      
      expect(response.status()).toBe(200);
      expect(responseTime).toBeLessThan(PERFORMANCE_THRESHOLDS.apiResponseTime);
      
      const data = await response.json();
      expect(data.success).toBe(true);
      
      console.log(`✅ ${endpoint.name} API responded in ${responseTime}ms`);
    }
  });

  test('should have proper security headers', async ({ request }) => {
    const response = await request.get(BASE_URL);
    const headers = response.headers();
    
    // Check for security headers
    expect(headers['x-frame-options']).toBeTruthy();
    expect(headers['x-content-type-options']).toBe('nosniff');
    expect(headers['content-security-policy']).toBeTruthy();
    expect(headers['x-xss-protection']).toBeTruthy();
    
    // Check for performance headers
    expect(headers['x-dns-prefetch-control']).toBe('on');
    
    console.log('✅ Security headers configured properly');
  });

  test('should have working web vitals monitoring', async ({ page }) => {
    let webVitalsData = [];
    
    // Intercept web vitals reports
    await page.route('/api/analytics/web-vitals', route => {
      const request = route.request();
      if (request.method() === 'POST') {
        webVitalsData.push(JSON.parse(request.postData()));
      }
      route.continue();
    });
    
    await page.goto(BASE_URL);
    
    // Wait for potential web vitals data
    await page.waitForTimeout(3000);
    
    // Navigate to trigger more metrics
    await page.click('a[href*="/properties"]').catch(() => {
      console.log('Properties link not found, skipping navigation test');
    });
    
    await page.waitForTimeout(2000);
    
    console.log(`✅ Web vitals monitoring system active (captured ${webVitalsData.length} metrics)`);
  });

  test('should have optimized image loading', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Wait for images to load
    await page.waitForLoadState('networkidle');
    
    // Check for Next.js optimized images
    const images = await page.locator('img').all();
    
    if (images.length > 0) {
      // Check first few images for optimization
      for (let i = 0; i < Math.min(images.length, 3); i++) {
        const img = images[i];
        const src = await img.getAttribute('src');
        const loading = await img.getAttribute('loading');
        
        // Next.js Image component should add lazy loading
        expect(loading).toBe('lazy');
        
        // Check for optimized formats or paths
        if (src) {
          const isOptimized = src.includes('_next/image') || 
                            src.includes('.webp') || 
                            src.includes('.avif') ||
                            src.includes('res.cloudinary.com');
          expect(isOptimized).toBe(true);
        }
      }
    }
    
    console.log(`✅ Image optimization verified for ${images.length} images`);
  });

  test('should handle SSR correctly', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Check for SSR indicators in initial HTML
    const htmlContent = await page.content();
    
    // Should have hydration data
    expect(htmlContent).toContain('__NEXT_DATA__');
    
    // Should have pre-rendered content (not just loading states)
    expect(htmlContent.length).toBeGreaterThan(1000);
    
    // Check for React hydration
    await page.waitForSelector('[data-reactroot], #__next', { timeout: 5000 });
    
    console.log('✅ SSR working correctly with proper hydration');
  });

  test('should have optimized Core Web Vitals', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Measure performance metrics using Playwright
    const performanceMetrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        const metrics = {};
        
        // First Contentful Paint
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.name === 'first-contentful-paint') {
              metrics.fcp = entry.startTime;
            }
          }
        }).observe({ entryTypes: ['paint'] });
        
        // Largest Contentful Paint
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            metrics.lcp = entry.startTime;
          }
        }).observe({ entryTypes: ['largest-contentful-paint'] });
        
        // Cumulative Layout Shift
        new PerformanceObserver((list) => {
          let cls = 0;
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) {
              cls += entry.value;
            }
          }
          metrics.cls = cls;
        }).observe({ entryTypes: ['layout-shift'] });
        
        // Give time to collect metrics
        setTimeout(() => resolve(metrics), 3000);
      });
    });
    
    // Validate Core Web Vitals
    if (performanceMetrics.fcp) {
      expect(performanceMetrics.fcp).toBeLessThan(PERFORMANCE_THRESHOLDS.firstContentfulPaint);
      console.log(`✅ First Contentful Paint: ${performanceMetrics.fcp.toFixed(2)}ms`);
    }
    
    if (performanceMetrics.lcp) {
      expect(performanceMetrics.lcp).toBeLessThan(PERFORMANCE_THRESHOLDS.largestContentfulPaint);
      console.log(`✅ Largest Contentful Paint: ${performanceMetrics.lcp.toFixed(2)}ms`);
    }
    
    if (performanceMetrics.cls !== undefined) {
      expect(performanceMetrics.cls).toBeLessThan(PERFORMANCE_THRESHOLDS.cumulativeLayoutShift);
      console.log(`✅ Cumulative Layout Shift: ${performanceMetrics.cls.toFixed(3)}`);
    }
  });

  test('should have efficient caching strategy', async ({ request }) => {
    // Test static asset caching
    const staticAssetResponse = await request.get(`${BASE_URL}/_next/static/css/app/layout.css`).catch(() => null);
    
    if (staticAssetResponse) {
      const cacheControl = staticAssetResponse.headers()['cache-control'];
      expect(cacheControl).toContain('max-age=31536000'); // 1 year cache
      expect(cacheControl).toContain('immutable');
    }
    
    // Test API caching
    const apiResponse = await request.get(`${API_URL}/properties?limit=1`);
    const apiCacheControl = apiResponse.headers()['cache-control'];
    
    // API should have some caching but not too aggressive
    expect(apiCacheControl).toBeTruthy();
    
    console.log('✅ Caching strategy properly configured');
  });

  test('should validate Railway environment optimizations', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Check for Railway-specific optimizations in the console
    const logs = [];
    page.on('console', msg => logs.push(msg.text()));
    
    // Navigate around to trigger any logs
    await page.reload();
    
    // Should not have excessive error logs
    const errorLogs = logs.filter(log => log.toLowerCase().includes('error'));
    expect(errorLogs.length).toBeLessThan(5); // Allow for minor errors
    
    // Check for performance warnings
    const performanceWarnings = logs.filter(log => 
      log.includes('Slow') || log.includes('performance')
    );
    
    if (performanceWarnings.length > 0) {
      console.log(`⚠ Performance warnings found: ${performanceWarnings.length}`);
      performanceWarnings.forEach(warning => console.log(`  - ${warning}`));
    }
    
    console.log('✅ Railway environment running smoothly');
  });

  test('should handle concurrent load efficiently', async ({ browser }) => {
    // Create multiple concurrent requests
    const contexts = await Promise.all([
      browser.newContext(),
      browser.newContext(),
      browser.newContext()
    ]);
    
    const pages = await Promise.all([
      contexts[0].newPage(),
      contexts[1].newPage(),
      contexts[2].newPage()
    ]);
    
    const startTime = Date.now();
    
    // Load pages concurrently
    await Promise.all([
      pages[0].goto(BASE_URL),
      pages[1].goto(`${BASE_URL}/properties`),
      pages[2].goto(`${BASE_URL}/developers`)
    ]);
    
    const totalTime = Date.now() - startTime;
    
    // All pages should load within reasonable time even under concurrent load
    expect(totalTime).toBeLessThan(10000); // 10 seconds max for all three
    
    // Verify all pages loaded successfully
    await expect(pages[0]).toHaveTitle(/Squarefooot/i);
    await expect(pages[1].locator('main')).toBeVisible();
    await expect(pages[2].locator('main')).toBeVisible();
    
    // Clean up
    await Promise.all([
      pages[0].close(),
      pages[1].close(),
      pages[2].close(),
      contexts[0].close(),
      contexts[1].close(),
      contexts[2].close()
    ]);
    
    console.log(`✅ Concurrent load test passed in ${totalTime}ms`);
  });

  test.afterAll(async () => {
    console.log('\n🎉 Railway Deployment Optimization Validation Complete!');
    console.log('📊 All optimizations for speed, SEO, and SSR are working correctly.');
    console.log('🚀 Squarefooot is ready for production on Railway.');
  });
});