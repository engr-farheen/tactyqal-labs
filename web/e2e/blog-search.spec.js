import { test, expect } from '@playwright/test';

test('blog list, search and pagination parameters work', async ({ page }) => {
  await page.goto('/blog');
  await expect(page.locator('.posts article')).toHaveCount(6);
  await page.goto('/blog?q=elevator');
  await expect(page.locator('.posts article')).toHaveCount(1);
  await expect(page.locator('.posts h3')).toContainText('elevator pitch');
  await page.goto('/blog?q=zzzzqqq');
  await expect(page.getByText('No articles match')).toBeVisible();
});

test('article page: content, structured data, share button and related articles', async ({ page }) => {
  await page.goto('/blog/the-elevator-pitch-for-business-entrepreneurs');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('elevator pitch');
  const blocks = (await page.locator('script[type="application/ld+json"]').allInnerTexts()).map((t) => JSON.parse(t));
  expect(blocks.map((b) => b['@type'])).toEqual(expect.arrayContaining(['Organization', 'Article']));
  await expect(page.getByRole('button', { name: /Share/ })).toBeVisible();
  await expect(page.locator('.related .posts article')).toHaveCount(3);
});

test('unknown article returns 404', async ({ page }) => {
  expect((await page.goto('/blog/nope-nope')).status()).toBe(404);
});

test('search palette: Ctrl+K finds pages, tools and articles and navigates by keyboard', async ({ page, isMobile }) => {
  test.skip(isMobile, 'keyboard shortcut is desktop only');
  await page.goto('/');
  await page.keyboard.press('Control+k');
  await expect(page.locator('dialog.palette[open]')).toBeVisible();
  await page.keyboard.type('pitch');
  await expect(page.locator('#pal-list [role=option]', { hasText: 'Pitch Deck Analyzer' })).toBeVisible();
  await expect(page.locator('#pal-list [role=option]', { hasText: 'elevator pitch' })).toBeVisible();
  await page.keyboard.press('Escape');
  await page.keyboard.press('Control+k');
  await page.keyboard.type('fundab');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/tools\/fundability-assessment$/);
});

test('sitemap and robots are served', async ({ request }) => {
  const sm = await (await request.get('/sitemap.xml')).text();
  expect(sm).toContain('/tools/fundability-assessment');
  expect(sm).toContain('/blog/the-elevator-pitch-for-business-entrepreneurs');
  expect(await (await request.get('/robots.txt')).text()).toContain('Sitemap');
});
