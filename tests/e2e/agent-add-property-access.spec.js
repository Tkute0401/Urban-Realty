// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Agent Add Property Access', () => {
  // Test agent can access add-property page directly
  test('agent should access add-property page via direct URL without login redirect', async ({ page }) => {
    // Navigate to home page first
    await page.goto('http://localhost:5173');
    
    // Wait for page to load
    await expect(page.locator('body')).toBeVisible();
    
    // Navigate to login page
    await page.goto('http://localhost:5173/login');
    
    // Wait for login form to be visible
    await expect(page.locator('form')).toBeVisible();
    
    // Fill in agent credentials (using typical agent test credentials)
    await page.fill('input[type="email"], input[name="email"]', 'agent@test.com');
    await page.fill('input[type="password"], input[name="password"]', 'password123');
    
    // Submit login form
    await page.click('button[type="submit"], button:has-text("Login"), button:has-text("Sign In")');
    
    // Wait for successful login and redirect
    await page.waitForURL(/^http:\/\/localhost:5173\/?.*$/, { timeout: 10000 });
    
    // Verify we're logged in by checking for user-specific elements
    await expect(page.locator('body')).not.toContainText('Login');
    
    // Now test direct navigation to add-property page
    await page.goto('http://localhost:5173/add-property');
    
    // Verify we're on the add-property page, not redirected to login
    await expect(page).toHaveURL('http://localhost:5173/add-property');
    
    // Verify the add property page content is visible
    await expect(page.locator('body')).toContainText(/Add.*Property|Property.*Add|Create.*Property/i);
    
    // Verify form fields are present (typical add property form elements)
    const formSelectors = [
      'input[name*="title"], input[placeholder*="title"], input[placeholder*="Title"]',
      'input[name*="price"], input[placeholder*="price"], input[placeholder*="Price"]',
      'textarea, input[name*="description"], input[placeholder*="description"]'
    ];
    
    // Check if at least one form element exists
    let formElementFound = false;
    for (const selector of formSelectors) {
      try {
        await expect(page.locator(selector).first()).toBeVisible({ timeout: 2000 });
        formElementFound = true;
        break;
      } catch (e) {
        // Continue to next selector
      }
    }
    
    // If no standard form elements found, check for any form or input elements
    if (!formElementFound) {
      await expect(page.locator('form, input, textarea, select').first()).toBeVisible();
    }
  });

  // Test non-agent user redirection
  test('regular user should be redirected from add-property page', async ({ page }) => {
    // Navigate to home page first
    await page.goto('http://localhost:5173');
    
    // Navigate to login page
    await page.goto('http://localhost:5173/login');
    
    // Wait for login form
    await expect(page.locator('form')).toBeVisible();
    
    // Login as regular user (non-agent)
    await page.fill('input[type="email"], input[name="email"]', 'user@test.com');
    await page.fill('input[type="password"], input[name="password"]', 'password123');
    
    // Submit login
    await page.click('button[type="submit"], button:has-text("Login"), button:has-text("Sign In")');
    
    // Wait for login to complete
    await page.waitForTimeout(2000);
    
    // Try to access add-property page directly
    await page.goto('http://localhost:5173/add-property');
    
    // Should be redirected away from add-property (to home page)
    await expect(page).not.toHaveURL('http://localhost:5173/add-property');
    
    // Should be on home page
    await expect(page).toHaveURL('http://localhost:5173/');
  });

  // Test unauthenticated access
  test('unauthenticated user should be redirected to login from add-property page', async ({ page }) => {
    // Clear any existing authentication
    await page.goto('http://localhost:5173/login');
    await page.evaluate(() => localStorage.clear());
    
    // Try to access add-property page directly without authentication
    await page.goto('http://localhost:5173/add-property');
    
    // Should be redirected to login page
    await expect(page).toHaveURL(/.*\/login/);
    
    // Should see login form
    await expect(page.locator('form')).toBeVisible();
    await expect(page.locator('input[type="email"], input[name="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"], input[name="password"]')).toBeVisible();
  });

  // Test admin access (should also work)
  test('admin should access add-property page via direct URL', async ({ page }) => {
    // Navigate to home page first
    await page.goto('http://localhost:5173');
    
    // Navigate to login page
    await page.goto('http://localhost:5173/login');
    
    // Wait for login form
    await expect(page.locator('form')).toBeVisible();
    
    // Login as admin
    await page.fill('input[type="email"], input[name="email"]', 'admin@test.com');
    await page.fill('input[type="password"], input[name="password"]', 'admin123');
    
    // Submit login
    await page.click('button[type="submit"], button:has-text("Login"), button:has-text("Sign In")');
    
    // Wait for admin redirect
    await page.waitForTimeout(3000);
    
    // Navigate directly to add-property page
    await page.goto('http://localhost:5173/add-property');
    
    // Verify we can access the page
    await expect(page).toHaveURL('http://localhost:5173/add-property');
    
    // Verify add property content is visible
    await expect(page.locator('body')).toContainText(/Add.*Property|Property.*Add|Create.*Property/i);
  });
});