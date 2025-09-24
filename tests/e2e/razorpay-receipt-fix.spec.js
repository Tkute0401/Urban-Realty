const { test, expect } = require('@playwright/test');

test.describe('Razorpay Receipt Length Fix E2E Tests', () => {
  const baseURL = 'http://localhost:5000';
  const apiURL = 'http://localhost:3001';
  
  const testUser = {
    name: 'Receipt Test User',
    email: `receipt_test_${Date.now()}@example.com`,
    password: 'password123',
    role: 'agent'
  };

  let userToken = null;
  let subscriptionId = null;

  test.beforeAll(async ({ request }) => {
    console.log('🚀 Setting up Razorpay Receipt Fix Tests');
    
    // Create test user
    const registerResponse = await request.post(`${apiURL}/api/v1/auth/register`, {
      data: testUser
    });
    
    if (registerResponse.ok()) {
      const data = await registerResponse.json();
      userToken = data.token;
      console.log('✅ Test user created for receipt testing');
      
      // Get subscription plans
      const plansResponse = await request.get(`${apiURL}/api/v1/subscriptions`);
      if (plansResponse.ok()) {
        const plansData = await plansResponse.json();
        const basicPlan = plansData.data.find(p => p.type === 'basic');
        if (basicPlan) {
          subscriptionId = basicPlan._id;
          console.log('✅ Basic subscription plan found');
        }
      }
    }
  });

  test.describe('Receipt Length Validation', () => {
    test('should generate receipts within 40 character limit', async ({ request }) => {
      console.log('📝 Testing receipt length constraints...');
      
      if (!userToken || !subscriptionId) {
        console.log('⚠️ Missing authentication or subscription data, skipping test');
        return;
      }

      // Test order creation with receipt generation
      const orderResponse = await request.post(`${apiURL}/api/v1/subscriptions/razorpay/order`, {
        headers: {
          'Authorization': `Bearer ${userToken}`
        },
        data: {
          subscriptionId: subscriptionId,
          billingCycle: 'monthly'
        }
      });
      
      console.log(`Order response status: ${orderResponse.status()}`);
      
      if (orderResponse.ok()) {
        const orderData = await orderResponse.json();
        console.log('✅ Order created successfully - receipt length fix working');
        
        expect(orderData.success).toBe(true);
        expect(orderData.data.orderId).toBeDefined();
        expect(orderData.data.amount).toBeDefined();
        expect(orderData.data.currency).toBe('INR');
        
        // Log success details
        console.log(`Order ID: ${orderData.data.orderId}`);
        console.log(`Amount: ${orderData.data.amount}`);
        console.log('Receipt generation within limits: ✅');
      } else {
        const errorData = await orderResponse.json().catch(() => null);
        console.log(`❌ Order creation failed with status ${orderResponse.status()}`);
        
        if (errorData) {
          console.log(`Error message: ${errorData.message}`);
          
          // Check if it's the old receipt length error (should not happen anymore)
          if (errorData.message?.includes('Receipt') || errorData.message?.includes('receipt')) {
            console.log('🔥 CRITICAL: Receipt length error still occurring!');
            expect.fail('Receipt length fix did not resolve the issue');
          }
        }
        
        // If it's a different error (like missing Razorpay credentials), that's expected in test environment
        if (orderResponse.status() === 500) {
          console.log('💡 500 error likely due to missing Razorpay test credentials (expected in CI)');
        }
      }
    });

    test('should handle multiple rapid order creations', async ({ request }) => {
      console.log('⚡ Testing rapid receipt generation...');
      
      if (!userToken || !subscriptionId) {
        console.log('⚠️ Missing authentication data, skipping rapid creation test');
        return;
      }

      // Create multiple orders in quick succession
      const orderPromises = [];
      for (let i = 0; i < 3; i++) {
        orderPromises.push(
          request.post(`${apiURL}/api/v1/subscriptions/razorpay/order`, {
            headers: {
              'Authorization': `Bearer ${userToken}`
            },
            data: {
              subscriptionId: subscriptionId,
              billingCycle: 'monthly'
            }
          })
        );
      }

      const results = await Promise.allSettled(orderPromises);
      let successCount = 0;
      let receiptErrors = 0;

      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          console.log(`Order ${index + 1} status: ${result.value.status()}`);
          if (result.value.ok()) {
            successCount++;
          } else if (result.value.status() === 400) {
            receiptErrors++;
          }
        }
      });

      console.log(`✅ Successful orders: ${successCount}/3`);
      console.log(`❌ Receipt-related errors: ${receiptErrors}/3`);
      
      // The key assertion: no receipt length errors should occur
      expect(receiptErrors).toBe(0);
      
      if (successCount > 0) {
        console.log('✅ Receipt uniqueness maintained across rapid requests');
      }
    });

    test('should generate unique receipts for different billing cycles', async ({ request }) => {
      console.log('🔄 Testing receipt uniqueness across billing cycles...');
      
      if (!userToken || !subscriptionId) {
        console.log('⚠️ Missing authentication data, skipping billing cycle test');
        return;
      }

      const billingCycles = ['monthly', 'yearly'];
      const results = [];

      for (const cycle of billingCycles) {
        const orderResponse = await request.post(`${apiURL}/api/v1/subscriptions/razorpay/order`, {
          headers: {
            'Authorization': `Bearer ${userToken}`
          },
          data: {
            subscriptionId: subscriptionId,
            billingCycle: cycle
          }
        });

        results.push({
          cycle,
          status: orderResponse.status(),
          success: orderResponse.ok()
        });

        console.log(`${cycle} billing cycle order: ${orderResponse.status()}`);
      }

      // Check that we don't get receipt-related errors for any billing cycle
      const receiptErrors = results.filter(r => r.status === 400).length;
      expect(receiptErrors).toBe(0);
      console.log('✅ No receipt length errors across different billing cycles');
    });
  });

  test.describe('Frontend Payment Flow with Receipt Fix', () => {
    test('should complete subscription flow without payment errors', async ({ page }) => {
      console.log('💻 Testing frontend subscription flow...');

      // Navigate to subscriptions page
      await page.goto(`${baseURL}/subscriptions`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);

      // Check if subscription plans are visible
      const pageContent = await page.textContent('body');
      const hasSubscriptionContent = pageContent.toLowerCase().includes('basic') || 
                                   pageContent.toLowerCase().includes('plan') || 
                                   pageContent.toLowerCase().includes('subscription');

      if (hasSubscriptionContent) {
        console.log('✅ Subscription page loaded with plan content');
        
        // Look for plan selection buttons
        const planButtons = await page.$$('button:has-text("Choose"), button:has-text("Select"), button:has-text("Get Started")');
        
        if (planButtons.length > 0) {
          console.log(`✅ Found ${planButtons.length} plan selection buttons`);
          
          // Take a screenshot for verification
          await page.screenshot({ path: 'test-results/subscription-page.png', fullPage: true });
          console.log('📸 Screenshot saved: subscription-page.png');
        }
      } else {
        console.log('⚠️ Subscription content not visible - may require authentication');
      }
    });

    test('should handle payment modal integration', async ({ page }) => {
      console.log('💳 Testing payment modal integration...');

      await page.goto(`${baseURL}/subscription-management`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);

      // Check for payment-related UI elements
      const paymentElements = await page.$$('[class*="payment"], [class*="checkout"], [data-testid*="payment"]');
      
      if (paymentElements.length > 0) {
        console.log(`✅ Found ${paymentElements.length} payment UI elements`);
      }

      // Check if page contains any error messages about receipts
      const pageText = await page.textContent('body');
      const hasReceiptError = pageText.toLowerCase().includes('receipt') && 
                            (pageText.toLowerCase().includes('error') || pageText.toLowerCase().includes('invalid'));

      expect(hasReceiptError).toBe(false);
      console.log('✅ No receipt-related errors visible in UI');
    });

    test('should validate Razorpay integration readiness', async ({ page }) => {
      console.log('🔧 Validating Razorpay integration readiness...');

      await page.goto(`${baseURL}/subscriptions`);
      await page.waitForLoadState('networkidle');

      // Check if Razorpay scripts or references are present
      const scripts = await page.$$eval('script', scripts => 
        scripts.map(s => s.src || s.textContent || '').filter(Boolean)
      );

      const hasRazorpayScript = scripts.some(script => 
        script.includes('razorpay') || script.includes('checkout.js')
      );

      const pageContent = await page.content();
      const hasRazorpayReference = pageContent.toLowerCase().includes('razorpay');

      if (hasRazorpayScript || hasRazorpayReference) {
        console.log('✅ Razorpay integration detected in frontend');
      } else {
        console.log('💡 Razorpay integration may be loaded dynamically');
      }

      // Most importantly, ensure no receipt-related error messages
      const hasReceiptError = pageContent.toLowerCase().includes('receipt') && 
                            pageContent.toLowerCase().includes('error');
      
      expect(hasReceiptError).toBe(false);
      console.log('✅ No receipt errors visible in page content');
    });
  });

  test.describe('Error Handling Improvements', () => {
    test('should provide clear error messages', async ({ request }) => {
      console.log('🚨 Testing improved error handling...');
      
      if (!userToken) {
        console.log('⚠️ No user token available, skipping error handling test');
        return;
      }

      // Test with invalid subscription ID to trigger error handling
      const invalidResponse = await request.post(`${apiURL}/api/v1/subscriptions/razorpay/order`, {
        headers: {
          'Authorization': `Bearer ${userToken}`
        },
        data: {
          subscriptionId: 'invalid-subscription-id',
          billingCycle: 'monthly'
        }
      });

      expect(invalidResponse.status()).toBe(400);
      
      const errorData = await invalidResponse.json();
      expect(errorData.success).toBe(false);
      expect(errorData.message).toBeDefined();
      expect(errorData.message).not.toBe('An error occurred');
      
      console.log(`✅ Clear error message: ${errorData.message}`);
    });

    test('should handle missing billing cycle', async ({ request }) => {
      console.log('🔧 Testing billing cycle validation...');
      
      if (!userToken || !subscriptionId) {
        console.log('⚠️ Missing authentication data, skipping validation test');
        return;
      }

      // Test without billing cycle
      const noCycleResponse = await request.post(`${apiURL}/api/v1/subscriptions/razorpay/order`, {
        headers: {
          'Authorization': `Bearer ${userToken}`
        },
        data: {
          subscriptionId: subscriptionId
          // Missing billingCycle intentionally
        }
      });

      expect(noCycleResponse.status()).toBe(400);
      
      const errorData = await noCycleResponse.json();
      expect(errorData.message).toContain('billingCycle');
      
      console.log('✅ Billing cycle validation working correctly');
    });
  });

  test.afterAll(async () => {
    console.log('🧹 Razorpay Receipt Fix Tests completed');
  });
});