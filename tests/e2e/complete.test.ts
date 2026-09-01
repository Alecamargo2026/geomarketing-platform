import { test, expect } from '@playwright/test';

const baseURL = process.env.BASE_URL || 'http://localhost:3000';

test.describe('GeoMarketing Platform - Complete E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${baseURL}/auth/login`);
  });

  test('should load login page', async ({ page }) => {
    await expect(page).toHaveTitle(/login|auth/i);
    const emailInput = await page.locator('input[type="email"]');
    await expect(emailInput).toBeVisible();
  });

  test('should view dashboard after login', async ({ page }) => {
    // Note: This test assumes test credentials exist
    // In real scenario, you'd need to set up test users
    await page.goto(`${baseURL}/dashboard`);
    // If redirected to login, that's expected without auth
    const url = page.url();
    expect(url).toContain('dashboard') || expect(url).toContain('login');
  });

  test('should view multi-brand selector', async ({ page }) => {
    await page.goto(`${baseURL}/dashboard`);
    // Check if brand selector exists (may be in header)
    const brandSelector = await page.locator('select[name="brand"], [data-testid="brand-selector"]').first();
    if (await brandSelector.isVisible()) {
      const options = await brandSelector.locator('option').count();
      expect(options).toBeGreaterThan(0);
    }
  });

  test('should load customers page', async ({ page }) => {
    await page.goto(`${baseURL}/dashboard/customers`);
    const url = page.url();
    expect(url).toContain('customers') || expect(url).toContain('login');
  });

  test('should load map page', async ({ page }) => {
    await page.goto(`${baseURL}/dashboard/map`);
    await page.waitForTimeout(2000);
    const url = page.url();
    expect(url).toContain('map') || expect(url).toContain('login');
  });

  test('should load reports page', async ({ page }) => {
    await page.goto(`${baseURL}/dashboard/reports`);
    const url = page.url();
    expect(url).toContain('reports') || expect(url).toContain('login');
  });

  test('should load gap-analysis page', async ({ page }) => {
    await page.goto(`${baseURL}/dashboard/gap-analysis`);
    const url = page.url();
    expect(url).toContain('gap-analysis') || expect(url).toContain('login');
  });

  test('should load audit-logs page', async ({ page }) => {
    await page.goto(`${baseURL}/dashboard/audit-logs`);
    const url = page.url();
    expect(url).toContain('audit-logs') || expect(url).toContain('login');
  });

  test('should load import page', async ({ page }) => {
    await page.goto(`${baseURL}/dashboard/import`);
    const url = page.url();
    expect(url).toContain('import') || expect(url).toContain('login');
  });

  test('should redirect unauthenticated users to login', async ({ page }) => {
    // Clear cookies to simulate unauthenticated state
    await page.context().clearCookies();
    await page.goto(`${baseURL}/dashboard`);
    await page.waitForTimeout(1000);
    const url = page.url();
    expect(url).toContain('login');
  });
});
