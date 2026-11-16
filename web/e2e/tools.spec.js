import { test, expect } from '@playwright/test';
import { TOOL_SLUGS, finishQuiz } from './helpers.js';

test('the tools index lists all 8 tools and the homepage links to internal pages only', async ({ page }) => {
  await page.goto('/tools');
  await expect(page.locator('a.tool')).toHaveCount(8);
  await page.goto('/');
  const hrefs = await page.locator('#tools a.tool').evaluateAll((els) => els.map((e) => e.getAttribute('href')));
  expect(hrefs).toHaveLength(8);
  for (const h of hrefs) expect(h).toMatch(/^\/tools\//);
});

for (const slug of TOOL_SLUGS) {
  test(`quiz "${slug}" completes and shows a scored result`, async ({ page }) => {
    await page.goto(`/tools/${slug}`);
    await finishQuiz(page);
    await expect(page.locator('.tr-band')).not.toBeEmpty();
    await expect(page.locator('.ring b')).toHaveText(/^\d+%$/, { timeout: 5000 });
    await expect(page.locator('.tr-bars .tr-row').first()).toBeVisible();
    await page.getByRole('button', { name: 'Retake' }).click();
    await expect(page.locator('.tq-count')).toHaveText(/Question 1 of/);
  });
}

test('idea generator returns six ideas that respect the selection', async ({ page }) => {
  await page.goto('/tools/startup-idea-generator');
  await page.selectOption('select[name=interest]', 'food');
  await page.selectOption('select[name=audience]', 'students');
  await page.selectOption('select[name=model]', 'app');
  await page.getByRole('button', { name: 'Generate ideas' }).click();
  await expect(page.locator('.tg-card')).toHaveCount(6);
  await expect(page.locator('.tg-pitch').first()).toContainText('A mobile app that helps students');
});

test('unknown tool slug returns 404', async ({ page }) => {
  const res = await page.goto('/tools/does-not-exist');
  expect(res.status()).toBe(404);
});
