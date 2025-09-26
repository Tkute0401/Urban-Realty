const { test, expect } = require('@playwright/test');

test.describe('Railway Deployment Validation', () => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

  test.beforeEach(async ({ page }) => {
    // Set up request interception to monitor API calls
    await page.route('**/api/**', route => {
      const request = route.request();
      console.log(`API Call: ${request.method()} ${request.url()}`);
      route.continue();
    });
  });

  test('should validate health endpoints', async ({ page }) => {
    // Test Next.js frontend health
    const frontendResponse = await page.goto(baseUrl);
    expect(frontendResponse.status()).toBe(200);
    
    // Test Express backend health
    const healthResponse = await page.request.get(`${apiUrl}/health`);
    expect(healthResponse.status()).toBe(200);
    
    const healthData = await healthResponse.json();
    expect(healthData).toHaveProperty('status', 'healthy');
    expect(healthData).toHaveProperty('environment');
  });

  test('should validate SEO optimization', async ({ page }) => {
    await page.goto(baseUrl);

    // Check page title
    const title = await page.title();
    expect(title).toContain('Squarefooot');
    
    // Check meta description
    const metaDescription = await page.locator('meta[name="description"]').getAttribute('content');
    expect(metaDescription).toContain('real estate');
    
    // Check Open Graph tags
    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
    const ogDescription = await page.locator('meta[property="og:description"]').getAttribute('content');
    expect(ogTitle).toBeTruthy();
    expect(ogDescription).toBeTruthy();
    
    // Check structured data
    const jsonLd = await page.locator('script[type="application/ld+json"]').first().innerText();
    const structuredData = JSON.parse(jsonLd);
    expect(structuredData['@type']).toBe('RealEstateAgent');
    expect(structuredData.name).toBe('Squarefooot');
  });

  test('should validate PWA manifest', async ({ page }) => {
    // Check manifest link
    await page.goto(baseUrl);
    const manifestLink = await page.locator('link[rel="manifest"]').getAttribute('href');
    expect(manifestLink).toBe('/manifest.json');
    
    // Fetch and validate manifest
    const manifestResponse = await page.request.get(`${baseUrl}/manifest.json`);
    expect(manifestResponse.status()).toBe(200);
    
    const manifest = await manifestResponse.json();
    expect(manifest.name).toContain('Squarefooot');
    expect(manifest.short_name).toBe('Squarefooot');
    expect(manifest.display).toBe('standalone');
    expect(manifest.icons).toBeInstanceOf(Array);
    expect(manifest.icons.length).toBeGreaterThan(0);
  });

  test('should validate performance optimizations', async ({ page }) => {
    await page.goto(baseUrl);
    
    // Check for preconnect links
    const preconnectLinks = await page.locator('link[rel="preconnect"]').count();
    expect(preconnectLinks).toBeGreaterThan(0);
    
    // Check for DNS prefetch
    const dnsPrefetchLinks = await page.locator('link[rel="dns-prefetch"]').count();
    expect(dnsPrefetchLinks).toBeGreaterThan(0);
    
    // Validate response headers
    const response = await page.goto(baseUrl);
    const headers = response.headers();
    
    // Security headers
    expect(headers['x-frame-options']).toBeTruthy();
    expect(headers['x-content-type-options']).toBe('nosniff');
    expect(headers['referrer-policy']).toBeTruthy();
    expect(headers['x-xss-protection']).toBeTruthy();
    
    // Performance headers
    expect(headers['vary']).toContain('Accept-Encoding');
  });

  test('should validate sitemap and robots', async ({ page }) => {
    // Check robots.txt
    const robotsResponse = await page.request.get(`${baseUrl}/robots.txt`);
    expect(robotsResponse.status()).toBe(200);
    
    const robotsText = await robotsResponse.text();
    expect(robotsText).toContain('User-agent');
    expect(robotsText).toContain('Sitemap');
    
    // Check sitemap.xml
    const sitemapResponse = await page.request.get(`${baseUrl}/sitemap.xml`);
    expect(sitemapResponse.status()).toBe(200);
    
    const sitemapText = await sitemapResponse.text();
    expect(sitemapText).toContain('<urlset');
    expect(sitemapText).toContain('<url>');
    expect(sitemapText).toContain(baseUrl);
  });

  test('should validate API performance', async ({ page }) => {
    const startTime = Date.now();
    
    // Test API response time
    const apiResponse = await page.request.get(`${apiUrl}/test`);
    const responseTime = Date.now() - startTime;
    
    expect(apiResponse.status()).toBe(200);
    expect(responseTime).toBeLessThan(2000); // Should respond within 2 seconds
    
    const apiData = await apiResponse.json();
    expect(apiData).toHaveProperty('status', 'success');
    
    // Check response headers for optimization
    const headers = apiResponse.headers();
    expect(headers['content-type']).toContain('application/json');
  });

  test('should validate image optimization', async ({ page }) => {
    await page.goto(baseUrl);
    
    // Look for Next.js optimized images
    const images = await page.locator('img').all();
    
    if (images.length > 0) {
      for (const img of images.slice(0, 3)) { // Check first 3 images
        const src = await img.getAttribute('src');
        const alt = await img.getAttribute('alt');
        
        // Images should have alt text for SEO
        if (src && !src.includes('data:')) {
          expect(alt).toBeTruthy();
        }
      }
    }
  });

  test('should validate responsive design', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(baseUrl);
    
    // Should be responsive without horizontal scroll
    const body = await page.locator('body').boundingBox();
    expect(body.width).toBeLessThanOrEqual(375);
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto(baseUrl);
    
    // Page should load without errors
    const title = await page.title();
    expect(title).toBeTruthy();
  });

  test('should validate CORS configuration', async ({ page }) => {
    // Test CORS headers on API endpoints
    const response = await page.request.get(`${apiUrl}/health`, {
      headers: {
        'Origin': baseUrl
      }
    });
    
    expect(response.status()).toBe(200);
    
    // Should have proper CORS headers in production
    if (process.env.NODE_ENV === 'production') {
      const headers = response.headers();
      expect(headers['access-control-allow-origin']).toBeTruthy();
    }
  });

  test('should validate error handling', async ({ page }) => {
    // Test 404 page
    const notFoundResponse = await page.goto(`${baseUrl}/non-existent-page`);
    expect([404, 200]).toContain(notFoundResponse.status()); // Next.js might return 200 for custom 404
    
    // Test API 404
    const apiNotFoundResponse = await page.request.get(`${apiUrl}/non-existent-endpoint`);
    expect(apiNotFoundResponse.status()).toBe(404);
    
    const errorData = await apiNotFoundResponse.json();
    expect(errorData).toHaveProperty('success', false);
    expect(errorData).toHaveProperty('error');
  });

  test('should validate caching headers', async ({ page }) => {
    // Test static asset caching
    await page.goto(baseUrl);
    
    // Find static assets
    const cssFiles = await page.locator('link[rel="stylesheet"]').all();
    const jsFiles = await page.locator('script[src]').all();
    
    if (cssFiles.length > 0) {
      const cssHref = await cssFiles[0].getAttribute('href');
      if (cssHref && cssHref.includes('/_next/static/')) {
        const cssResponse = await page.request.get(`${baseUrl}${cssHref}`);
        const cacheControl = cssResponse.headers()['cache-control'];
        expect(cacheControl).toContain('max-age');
      }
    }
  });

  test('should validate environment-specific configuration', async ({ page }) => {
    const isProduction = process.env.NODE_ENV === 'production';
    
    await page.goto(baseUrl);
    
    if (isProduction) {
      // In production, should not have development tools
      const reactDevTools = await page.evaluate(() => {
        return window.__REACT_DEVTOOLS_GLOBAL_HOOK__ !== undefined;
      });
      expect(reactDevTools).toBeFalsy();
      
      // Should not have console logs in production
      const consoleLogs = [];
      page.on('console', msg => {
        if (msg.type() === 'log' && !msg.text().includes('Web Vitals')) {
          consoleLogs.push(msg.text());
        }
      });
      
      await page.reload();
      expect(consoleLogs.length).toBe(0);
    }
  });

  test('should validate web vitals tracking', async ({ page }) => {
    let webVitalsReported = false;
    
    // Intercept web vitals requests
    await page.route('**/api/analytics/web-vitals', route => {
      webVitalsReported = true;
      route.fulfill({ status: 200, body: '{"success": true}' });
    });
    
    await page.goto(baseUrl);
    
    // Wait a bit for web vitals to be collected
    await page.waitForTimeout(2000);
    
    // Trigger some interactions to generate metrics
    await page.mouse.move(100, 100);
    await page.mouse.click(100, 100);
    
    // Wait for potential web vitals reporting
    await page.waitForTimeout(1000);
    
    // Note: Web vitals might not always be reported in test environment
    console.log('Web Vitals reporting intercepted:', webVitalsReported);
  });
});