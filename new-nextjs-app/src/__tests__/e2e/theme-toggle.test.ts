import { test, expect } from '@playwright/test';

test.describe('Theme Toggle Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5000/properties');
    await page.waitForLoadState('networkidle');
  });

  test('should toggle between light and dark themes', async ({ page }) => {
    // Check initial theme (should be light by default)
    const htmlElement = page.locator('html');
    const initialTheme = await htmlElement.getAttribute('data-theme');
    expect(initialTheme).toBe('light');

    // Find and click the theme toggle button
    const themeToggleButton = page.locator('button.theme-toggle').first();
    await expect(themeToggleButton).toBeVisible();
    
    // Click to switch to dark mode
    await themeToggleButton.click();
    
    // Wait for theme change
    await page.waitForTimeout(500);
    
    // Verify theme changed to dark
    const darkTheme = await htmlElement.getAttribute('data-theme');
    expect(darkTheme).toBe('dark');
    
    // Verify the icon changed (should show sun icon in dark mode)
    const sunIcon = page.locator('button.theme-toggle svg').first();
    await expect(sunIcon).toBeVisible();
    
    // Click again to switch back to light mode
    await themeToggleButton.click();
    await page.waitForTimeout(500);
    
    // Verify theme changed back to light
    const lightTheme = await htmlElement.getAttribute('data-theme');
    expect(lightTheme).toBe('light');
  });

  test('should persist theme preference in localStorage', async ({ page }) => {
    // Switch to dark mode
    const themeToggleButton = page.locator('button.theme-toggle').first();
    await themeToggleButton.click();
    await page.waitForTimeout(500);
    
    // Check localStorage
    const storedTheme = await page.evaluate(() => localStorage.getItem('theme'));
    expect(storedTheme).toBe('dark');
    
    // Reload page and verify theme persistence
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    const htmlElement = page.locator('html');
    const persistedTheme = await htmlElement.getAttribute('data-theme');
    expect(persistedTheme).toBe('dark');
  });

  test('should show theme toggle in mobile menu', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Open mobile menu
    const menuButton = page.locator('button.menu-button');
    await expect(menuButton).toBeVisible();
    await menuButton.click();
    
    // Find theme toggle in mobile menu
    const mobileThemeToggle = page.locator('.mobile-menu .menu-item').filter({ hasText: /Dark Mode|Light Mode/ });
    await expect(mobileThemeToggle).toBeVisible();
    
    // Click to toggle theme
    await mobileThemeToggle.click();
    
    // Verify theme changed
    const htmlElement = page.locator('html');
    const theme = await htmlElement.getAttribute('data-theme');
    expect(theme).toBe('dark');
  });

  test('should apply correct CSS variables for dark theme', async ({ page }) => {
    // Switch to dark mode
    const themeToggleButton = page.locator('button.theme-toggle').first();
    await themeToggleButton.click();
    await page.waitForTimeout(500);
    
    // Check CSS variables are applied correctly
    const bgColor = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue('--color-bg').trim();
    });
    
    expect(bgColor).toBe('#0b132b');
    
    const textColor = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue('--color-text').trim();
    });
    
    expect(textColor).toBe('#f9fafb');
  });
});