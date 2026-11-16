import { test, expect } from '@playwright/test';
import { scrollThrough } from './helpers.js';

test('homepage renders every section without console errors', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error' && !/Failed to load|net::|ERR_/.test(m.text())) errors.push(m.text()); });
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Real apps');
  for (const id of ['success', 'program', 'why', 'tools', 'blog', 'pricing', 'faq', 'contact']) await expect(page.locator(`#${id}`)).toBeAttached();
  await expect(page.locator('.posts article')).toHaveCount(6);
  expect(errors).toEqual([]);
});

test('every image on the homepage ends up loaded (original or local fallback)', async ({ page }) => {
  await page.goto('/');
  await scrollThrough(page);
  await page.waitForTimeout(1500);
  const broken = await page.evaluate(() => [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.src));
  expect(broken).toEqual([]);
});

test('desktop navigation: animated underline and scroll-spy', async ({ page, isMobile }) => {
  test.skip(isMobile, 'desktop only');
  await page.goto('/');
  const link = page.locator('.links a.nl', { hasText: 'Program' });
  await expect.poll(() => link.evaluate((e) => getComputedStyle(e, '::after').transform)).toBe('matrix(0, 0, 0, 1, 0, 0)');
  await link.hover();
  await expect.poll(() => link.evaluate((e) => getComputedStyle(e, '::after').transform)).toBe('matrix(1, 0, 0, 1, 0, 0)');
  await page.evaluate(() => document.querySelector('#pricing').scrollIntoView({ block: 'center', behavior: 'instant' }));
  await expect(page.locator('.links a.nl[aria-current]')).toContainText('Pricing');
});

test('mobile menu opens, locks scroll, navigates and closes', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'mobile only');
  await page.goto('/');
  const burger = page.locator('.burger');
  await burger.click();
  await expect(burger).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('.links li')).toHaveCount(8);
  await expect(page.locator('html')).toHaveClass(/menu-lock/);
  await page.keyboard.press('Escape');
  await expect(burger).toHaveAttribute('aria-expanded', 'false');
  await burger.click();
  await page.locator('.links a.nl', { hasText: 'Tools' }).click();
  await expect(page).toHaveURL(/\/tools$/);
  await expect(burger).toHaveAttribute('aria-expanded', 'false');
});

test('theme toggle switches and persists across reloads', async ({ page }) => {
  await page.goto('/');
  const before = await page.evaluate(() => document.documentElement.dataset.theme);
  await page.locator('.theme:not(.search-btn)').click();
  const after = await page.evaluate(() => document.documentElement.dataset.theme);
  expect(after).not.toBe(before);
  await page.reload();
  expect(await page.evaluate(() => document.documentElement.dataset.theme)).toBe(after);
});
