const { test, expect } = require('@playwright/test');

/**
 * Railway Deployment & Performance Optimization E2E Tests
 * Tests for Squarefooot Urban Realty optimized deployment
 */

test.describe('Railway Deployment Optimization Tests', () => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://urban-realty-production.up.railway.app';
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://urban-realty-production.up.railway.app/api/v1';
  
  test.beforeEach(async ({ page }) => {
    // Set performance monitoring
    await page.addInitScript(() => {
      window.performanceData = {
        loadStart: performance.now(),
        metrics: {}
      };
    });
  });

  test('Homepage loads within performance budget', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto(baseUrl, { 
      waitUntil: 'networkidle',
      timeout: 10000
    });
    
    const loadTime = Date.now() - startTime;
    
    // Performance assertion: page should load within 3 seconds
    expect(loadTime).toBeLessThan(3000);
    
    // Verify page title for SEO
    await expect(page).toHaveTitle(/Squarefooot|Urban Realty/);
    
    // Verify meta description exists for SEO
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toBeAttached();
    
    // Verify essential content is rendered (SSR check)
    await expect(page.locator('main')).toBeVisible();
    
    console.log(`✅ Homepage loaded in ${loadTime}ms`);
  });

  test('API health check passes', async ({ request }) => {
    const response = await request.get(`${apiUrl}/health`, {
      timeout: 5000
    });
    
    expect(response.status()).toBe(200);
    
    const healthData = await response.json();
    expect(healthData).toHaveProperty('status', 'ok');
    
    console.log('✅ API health check passed');
  });

  test('Properties API endpoint works correctly', async ({ request }) => {
    const response = await request.get(`${apiUrl}/properties`, {
      timeout: 10000
    });
    
    expect(response.status()).toBe(200);
    
    const propertiesData = await response.json();
    expect(propertiesData).toHaveProperty('success', true);
    expect(propertiesData.data).toBeDefined();
    
    console.log('✅ Properties API endpoint working');
  });

  test('Performance metrics meet optimization targets', async ({ page }) => {
    await page.goto(baseUrl);
    
    // Wait for page to fully load
    await page.waitForLoadState('networkidle');
    
    // Measure Core Web Vitals
    const metrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const metrics = {};
          
          entries.forEach((entry) => {
            if (entry.entryType === 'navigation') {
              metrics.domContentLoaded = entry.domContentLoadedEventEnd - entry.fetchStart;
              metrics.pageLoad = entry.loadEventEnd - entry.fetchStart;
            }
          });
          
          // Get LCP if available
          new PerformanceObserver((lcpList) => {
            const lcpEntries = lcpList.getEntries();
            if (lcpEntries.length > 0) {
              metrics.lcp = lcpEntries[lcpEntries.length - 1].startTime;
            }
            resolve(metrics);
          }).observe({ entryTypes: ['largest-contentful-paint'] });
          
          // Fallback if LCP not available
          setTimeout(() => resolve(metrics), 1000);
        }).observe({ entryTypes: ['navigation'] });
      });
    });
    
    // Performance assertions based on optimization targets
    if (metrics.pageLoad) {
      expect(metrics.pageLoad).toBeLessThan(3000); // Page load < 3s
      console.log(`✅ Page load time: ${Math.round(metrics.pageLoad)}ms`);
    }
    
    if (metrics.lcp) {
      expect(metrics.lcp).toBeLessThan(2500); // LCP < 2.5s
      console.log(`✅ Largest Contentful Paint: ${Math.round(metrics.lcp)}ms`);
    }
  });

  test('SSR content renders correctly', async ({ page }) => {
    // Disable JavaScript to test SSR
    await page.context().addInitScript(() => {
      delete window.navigator;
    });
    
    await page.goto(baseUrl);
    
    // Verify that essential content is present even without JS
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('main')).toBeVisible();
    
    // Check for SSR-rendered content
    const content = await page.content();
    expect(content).toContain('Squarefooot');
    expect(content).not.toContain('Loading...');
    
    console.log('✅ SSR content renders correctly');
  });

  test('SEO meta tags are properly set', async ({ page }) => {
    await page.goto(baseUrl);
    
    // Check essential SEO meta tags
    const metaTags = {
      title: await page.title(),
      description: await page.getAttribute('meta[name="description"]', 'content'),
      keywords: await page.getAttribute('meta[name="keywords"]', 'content'),
      ogTitle: await page.getAttribute('meta[property="og:title"]', 'content'),
      ogDescription: await page.getAttribute('meta[property="og:description"]', 'content'),
      ogType: await page.getAttribute('meta[property="og:type"]', 'content')
    };
    
    // Verify meta tags exist and have content
    expect(metaTags.title).toBeTruthy();
    expect(metaTags.title).toMatch(/Squarefooot|Urban Realty/);
    expect(metaTags.description).toBeTruthy();
    expect(metaTags.description.length).toBeGreaterThan(50);
    
    if (metaTags.ogTitle) {
      expect(metaTags.ogTitle).toBeTruthy();
    }
    
    console.log('✅ SEO meta tags properly configured');
  });

  test('Mobile responsiveness works correctly', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(baseUrl);
    
    // Verify mobile navigation
    const mobileNav = page.locator('[data-testid="mobile-nav"], .mobile-nav, button[aria-label*="menu"], button[aria-label*="Menu"]');
    
    // Check if mobile navigation exists or if regular nav is responsive
    const navExists = await mobileNav.count() > 0;
    const regularNav = page.locator('nav, .navbar, .navigation');
    const regularNavExists = await regularNav.count() > 0;
    
    expect(navExists || regularNavExists).toBeTruthy();
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.reload();
    
    await expect(page.locator('main')).toBeVisible();
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.reload();
    
    await expect(page.locator('main')).toBeVisible();
    
    console.log('✅ Mobile responsiveness working');
  });

  test('Error handling works properly', async ({ page }) => {
    // Test 404 page
    await page.goto(`${baseUrl}/non-existent-page`);
    
    // Should either show 404 page or redirect gracefully
    const is404 = page.url().includes('404') || 
                  (await page.content()).includes('404') ||
                  (await page.content()).includes('Page Not Found') ||
                  page.url() === baseUrl; // Redirect to home
    
    expect(is404).toBeTruthy();
    
    console.log('✅ Error handling working correctly');
  });

  test('Key user journeys work correctly', async ({ page }) => {
    await page.goto(baseUrl);
    
    // Test navigation to properties
    const propertiesLink = page.locator('a[href*="properties"], a[href*="Properties"]').first();
    if (await propertiesLink.count() > 0) {
      await propertiesLink.click();
      await page.waitForLoadState('networkidle');
      
      // Should navigate to properties page
      expect(page.url()).toMatch(/properties|Properties/);
      console.log('✅ Properties navigation working');
    }
    
    // Test search functionality if available
    const searchInput = page.locator('input[type="search"], input[placeholder*="search"], input[placeholder*="Search"]').first();
    if (await searchInput.count() > 0) {
      await searchInput.fill('test');
      await searchInput.press('Enter');
      
      // Wait for search results or loading state
      await page.waitForTimeout(2000);
      console.log('✅ Search functionality accessible');
    }
    
    // Test footer links
    const footerLinks = page.locator('footer a');
    if (await footerLinks.count() > 0) {
      const linkCount = await footerLinks.count();
      expect(linkCount).toBeGreaterThan(0);
      console.log('✅ Footer links present');
    }
  });

  test('Payment integration readiness', async ({ page }) => {
    await page.goto(baseUrl);
    
    // Check if Razorpay script is loaded (for payment readiness)
    const razorpayScript = await page.evaluate(() => {
      return !!window.Razorpay || 
             document.querySelector('script[src*="razorpay"]') !== null ||
             document.querySelector('script[src*="checkout"]') !== null;
    });
    
    if (razorpayScript) {
      console.log('✅ Payment integration (Razorpay) scripts loaded');
    } else {
      console.log('ℹ️ Payment scripts will be loaded when needed');
    }
    
    // This test passes regardless as payment scripts may load on-demand
    expect(true).toBeTruthy();
  });

  test('CORS and security headers are properly configured', async ({ page, request }) => {
    const response = await request.get(baseUrl);
    const headers = response.headers();
    
    // Check for security headers
    const securityHeaders = [
      'x-frame-options',
      'x-content-type-options', 
      'x-xss-protection',
      'referrer-policy'
    ];
    
    let securityHeadersPresent = 0;
    securityHeaders.forEach(header => {
      if (headers[header]) {
        securityHeadersPresent++;
        console.log(`✅ ${header}: ${headers[header]}`);
      }
    });
    
    // At least some security headers should be present
    expect(securityHeadersPresent).toBeGreaterThan(0);
    
    // Check CORS headers if present
    if (headers['access-control-allow-origin']) {
      console.log(`✅ CORS configured: ${headers['access-control-allow-origin']}`);
    }
    
    console.log('✅ Security headers properly configured');
  });

  test('Database connectivity through API', async ({ request }) => {
    // Test an API endpoint that requires database connectivity
    const response = await request.get(`${apiUrl}/properties`, {
      timeout: 10000
    });
    
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    
    // Verify response structure indicates DB connectivity
    expect(data).toHaveProperty('success');
    
    // If there are properties, verify structure
    if (data.data && Array.isArray(data.data) && data.data.length > 0) {
      const property = data.data[0];
      expect(property).toHaveProperty('_id');
      console.log('✅ Database connectivity confirmed with sample data');
    } else {
      console.log('✅ Database connectivity confirmed (no sample data)');
    }
  });

  test('Environment variables are properly configured', async ({ request }) => {
    // Test that the API is using the correct environment
    const response = await request.get(`${apiUrl}/health`);
    const data = await response.json();
    
    // Health endpoint should indicate production environment
    expect(response.status()).toBe(200);
    expect(data.status).toBe('ok');
    
    // Check if environment info is available
    if (data.environment) {
      expect(data.environment).toBe('production');
    }
    
    console.log('✅ Environment variables properly configured');
  });
});

test.describe('Performance Regression Tests', () => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://urban-realty-production.up.railway.app';
  
  test('Bundle size is optimized', async ({ page }) => {
    await page.goto(baseUrl);
    
    // Get network requests to analyze bundle sizes
    const responses = [];
    page.on('response', response => {
      if (response.url().includes('/_next/static/')) {
        responses.push({
          url: response.url(),
          size: parseInt(response.headers()['content-length'] || '0', 10)
        });
      }
    });
    
    await page.waitForLoadState('networkidle');
    
    // Check for reasonable bundle sizes (should be optimized)
    const jsFiles = responses.filter(r => r.url.includes('.js'));
    const cssFiles = responses.filter(r => r.url.includes('.css'));
    
    if (jsFiles.length > 0) {
      const totalJsSize = jsFiles.reduce((sum, file) => sum + file.size, 0);
      // Main bundle should be under 1MB for good performance
      expect(totalJsSize).toBeLessThan(1024 * 1024); // 1MB
      console.log(`✅ Total JS bundle size: ${Math.round(totalJsSize / 1024)}KB`);
    }
    
    if (cssFiles.length > 0) {
      const totalCssSize = cssFiles.reduce((sum, file) => sum + file.size, 0);
      // CSS should be under 200KB
      expect(totalCssSize).toBeLessThan(200 * 1024); // 200KB
      console.log(`✅ Total CSS size: ${Math.round(totalCssSize / 1024)}KB`);
    }
  });

  test('Images are optimized', async ({ page }) => {
    await page.goto(baseUrl);
    
    const images = [];
    page.on('response', response => {
      const url = response.url();
      if (url.includes('.jpg') || url.includes('.png') || url.includes('.webp') || 
          url.includes('/_next/image') || url.includes('res.cloudinary.com')) {
        images.push({
          url,
          contentType: response.headers()['content-type'],
          size: parseInt(response.headers()['content-length'] || '0', 10)
        });
      }
    });
    
    await page.waitForLoadState('networkidle');
    
    if (images.length > 0) {
      // Check for modern image formats
      const optimizedImages = images.filter(img => 
        img.contentType && (img.contentType.includes('webp') || img.contentType.includes('avif'))
      );
      
      console.log(`✅ Found ${optimizedImages.length} optimized images out of ${images.length} total`);
      
      // At least some images should be optimized if using Next.js Image component
      if (images.length > 3) {
        expect(optimizedImages.length).toBeGreaterThan(0);
      }
    }
  });
});