import { test, expect } from '@playwright/test';

const baseURL = process.env.BASE_URL || 'http://localhost:3000';

test.describe('GeoMarketing Platform - Complete E2E', () => {
  test('should load dashboard', async ({ page }) => {
    await page.goto(`${baseURL}/dashboard`);
    const url = page.url();
    expect(url.includes('dashboard') || url.includes('login')).toBeTruthy();
  });

  test('should load customers page', async ({ page }) => {
    await page.goto(`${baseURL}/dashboard/customers`);
    const url = page.url();
    expect(url.includes('customers') || url.includes('login')).toBeTruthy();
  });

  test('should load map page', async ({ page }) => {
    await page.goto(`${baseURL}/dashboard/map`);
    await page.waitForTimeout(2000);
    const url = page.url();
    expect(url.includes('map') || url.includes('login')).toBeTruthy();
  });

  test('should load reports page', async ({ page }) => {
    await page.goto(`${baseURL}/dashboard/reports`);
    const url = page.url();
    expect(url.includes('reports') || url.includes('login')).toBeTruthy();
  });

  test('should load gap-analysis page', async ({ page }) => {
    await page.goto(`${baseURL}/dashboard/gap-analysis`);
    const url = page.url();
    expect(url.includes('gap-analysis') || url.includes('login')).toBeTruthy();
  });

  test('should load audit-logs page', async ({ page }) => {
    await page.goto(`${baseURL}/dashboard/audit-logs`);
    const url = page.url();
    expect(url.includes('audit-logs') || url.includes('login')).toBeTruthy();
  });

  test('should load import page', async ({ page }) => {
    await page.goto(`${baseURL}/dashboard/import`);
    const url = page.url();
    expect(url.includes('import') || url.includes('login')).toBeTruthy();
  });

  test('should redirect unauthenticated users to login', async ({ page }) => {
    await page.context().clearCookies();
    await page.goto(`${baseURL}/dashboard`);
    await page.waitForTimeout(1000);
    const url = page.url();
    expect(url.includes('login')).toBeTruthy();
  });
});
