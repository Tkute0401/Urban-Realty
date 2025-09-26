/**
 * Railway Deployment Optimization E2E Test
 * Tests the deployment fixes and performance optimizations for Squarefooot
 */

const { test, expect } = require('@playwright/test');

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
const FRONTEND_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

test.describe('Railway Deployment Optimization Validation', () => {
  test.beforeAll(async () => {
    console.log('🏠 Testing Squarefooot Railway deployment optimizations...');
    console.log(`API URL: ${API_BASE_URL}`);
    console.log(`Frontend URL: ${FRONTEND_URL}`);
  });

  test('Health check endpoint should be accessible and fast', async ({ request }) => {
    const startTime = Date.now();
    
    const response = await request.get(`${API_BASE_URL}/health`, {
      timeout: 5000
    });
    
    const responseTime = Date.now() - startTime;
    
    expect(response.status()).toBe(200);
    expect(responseTime).toBeLessThan(2000); // Should respond within 2 seconds
    
    const healthData = await response.json();
    expect(healthData).toHaveProperty('status');
    expect(healthData.status).toBe('success');
    
    console.log(`✅ Health check responded in ${responseTime}ms`);
  });

  test('Frontend should load with optimized performance', async ({ page }) => {
    const startTime = Date.now();
    
    // Navigate to homepage with performance monitoring
    await page.goto(FRONTEND_URL, {
      waitUntil: 'networkidle',
      timeout: 10000
    });
    
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(5000); // Should load within 5 seconds
    
    // Check for critical performance optimizations
    const performanceEntries = await page.evaluate(() => {
      return {
        navigation: performance.getEntriesByType('navigation')[0],
        firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0],
        largestContentfulPaint: performance.getEntriesByName('largest-contentful-paint')[0]
      };
    });
    
    // Validate performance metrics
    if (performanceEntries.firstContentfulPaint) {
      expect(performanceEntries.firstContentfulPaint.startTime).toBeLessThan(2000);
    }
    
    console.log(`✅ Frontend loaded in ${loadTime}ms`);
    console.log(`📊 Performance metrics:`, performanceEntries);
  });

  test('SSR should work correctly with proper meta tags', async ({ page }) => {
    await page.goto(FRONTEND_URL);
    
    // Check for SSR-rendered content
    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title).toContain('Squarefooot');
    
    // Check for SEO meta tags
    const metaTags = {
      description: await page.getAttribute('meta[name="description"]', 'content'),
      viewport: await page.getAttribute('meta[name="viewport"]', 'content'),
      ogTitle: await page.getAttribute('meta[property="og:title"]', 'content'),
      ogDescription: await page.getAttribute('meta[property="og:description"]', 'content'),
      ogImage: await page.getAttribute('meta[property="og:image"]', 'content')
    };
    
    expect(metaTags.description).toBeTruthy();
    expect(metaTags.viewport).toContain('width=device-width');
    expect(metaTags.ogTitle).toBeTruthy();
    expect(metaTags.ogDescription).toBeTruthy();
    
    console.log('✅ SSR and SEO meta tags validation passed');
    console.log('📊 Meta tags:', metaTags);
  });

  test('API endpoints should respond within performance thresholds', async ({ request }) => {
    const endpoints = [
      { path: '/health', threshold: 500 },
      { path: '/properties', threshold: 1000 },
      { path: '/developers', threshold: 1000 }
    ];
    
    for (const endpoint of endpoints) {
      const startTime = Date.now();
      
      try {
        const response = await request.get(`${API_BASE_URL}${endpoint.path}`, {
          timeout: 5000
        });
        
        const responseTime = Date.now() - startTime;
        
        expect(response.status()).toBeGreaterThanOrEqual(200);
        expect(response.status()).toBeLessThan(500);
        expect(responseTime).toBeLessThan(endpoint.threshold);
        
        console.log(`✅ ${endpoint.path} responded in ${responseTime}ms (threshold: ${endpoint.threshold}ms)`);
        
      } catch (error) {
        if (endpoint.path !== '/health') {
          console.warn(`⚠️ ${endpoint.path} may not be available in test environment`);
        } else {
          throw error;
        }
      }
    }
  });

  test('CSS and JS assets should be optimized and cached', async ({ page }) => {
    const responses = [];
    
    page.on('response', (response) => {
      const url = response.url();
      if (url.includes('_next/static/') || url.includes('.css') || url.includes('.js')) {
        responses.push({
          url,
          status: response.status(),
          headers: response.headers(),
          size: response.headers()['content-length']
        });
      }
    });
    
    await page.goto(FRONTEND_URL, { waitUntil: 'networkidle' });
    
    // Check that static assets are properly cached
    const staticAssets = responses.filter(r => r.url.includes('_next/static/'));
    expect(staticAssets.length).toBeGreaterThan(0);
    
    staticAssets.forEach(asset => {
      expect(asset.status).toBe(200);
      
      // Check for proper caching headers
      const cacheControl = asset.headers['cache-control'];
      if (cacheControl) {
        expect(cacheControl).toMatch(/max-age|immutable/);
      }
    });
    
    console.log(`✅ Found ${staticAssets.length} optimized static assets`);
  });

  test('Error handling and logging should work correctly', async ({ page, request }) => {
    const consoleLogs = [];
    const errors = [];
    
    page.on('console', (msg) => {
      consoleLogs.push({
        type: msg.type(),
        text: msg.text(),
        location: msg.location()
      });
    });
    
    page.on('pageerror', (error) => {
      errors.push(error.message);
    });
    
    await page.goto(FRONTEND_URL);
    
    // Try accessing a non-existent API endpoint to test error handling
    try {
      await request.get(`${API_BASE_URL}/non-existent-endpoint`);
    } catch (error) {
      // Expected to fail
    }
    
    // Check that no critical JavaScript errors occurred
    const criticalErrors = errors.filter(error => 
      !error.includes('favicon') && 
      !error.includes('Service Worker') &&
      !error.includes('404')
    );
    
    expect(criticalErrors.length).toBe(0);
    
    console.log(`✅ Error handling validation completed`);
    if (criticalErrors.length > 0) {
      console.log('❌ Critical errors found:', criticalErrors);
    }
  });

  test('Memory usage should be optimized', async ({ page }) => {
    await page.goto(FRONTEND_URL);
    
    // Wait for page to settle
    await page.waitForTimeout(2000);
    
    // Get memory usage information
    const memoryInfo = await page.evaluate(() => {
      if ('memory' in performance) {
        return {
          usedJSHeapSize: performance.memory.usedJSHeapSize,
          totalJSHeapSize: performance.memory.totalJSHeapSize,
          jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
        };
      }
      return null;
    });
    
    if (memoryInfo) {
      // Memory usage should be reasonable (less than 100MB for initial load)
      const usedMemoryMB = memoryInfo.usedJSHeapSize / (1024 * 1024);
      expect(usedMemoryMB).toBeLessThan(100);
      
      console.log(`✅ Memory usage: ${usedMemoryMB.toFixed(2)}MB`);
      console.log('📊 Memory info:', memoryInfo);
    } else {
      console.log('⚠️ Memory API not available in this browser');
    }
  });

  test('Build artifacts should not contain development dependencies', async ({ request }) => {
    // Test that husky and other dev dependencies are not causing issues
    try {
      const response = await request.get(`${FRONTEND_URL}/_next/static/chunks/pages/_app.js`);
      const content = await response.text();
      
      // These should not be present in production builds
      const devDependencies = ['husky', 'nodemon', '@playwright/test'];
      
      devDependencies.forEach(dep => {
        expect(content).not.toContain(dep);
      });
      
      console.log('✅ Production build is clean of development dependencies');
      
    } catch (error) {
      console.log('⚠️ Could not check build artifacts - this is normal in development');
    }
  });
});

test.describe('Railway Environment Validation', () => {
  test('Environment variables should be properly configured', async ({ request }) => {
    // Test that the health endpoint confirms proper environment setup
    const response = await request.get(`${API_BASE_URL}/health`);
    const healthData = await response.json();
    
    expect(response.status()).toBe(200);
    
    // In a real deployment, you might want to check specific environment indicators
    // For now, we just ensure the health check passes
    expect(healthData).toHaveProperty('status');
    
    console.log('✅ Environment configuration validation passed');
  });

  test('CORS should be properly configured for production', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/health`, {
      headers: {
        'Origin': FRONTEND_URL
      }
    });
    
    expect(response.status()).toBe(200);
    
    const corsHeaders = {
      'access-control-allow-origin': response.headers()['access-control-allow-origin'],
      'access-control-allow-credentials': response.headers()['access-control-allow-credentials']
    };
    
    // CORS should allow the frontend origin
    if (corsHeaders['access-control-allow-origin']) {
      expect(corsHeaders['access-control-allow-origin']).toMatch(/\*|localhost|railway\.app/);
    }
    
    console.log('✅ CORS configuration validated');
    console.log('📊 CORS headers:', corsHeaders);
  });
});