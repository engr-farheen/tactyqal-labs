import { expect } from '@playwright/test';

export const API = 'http://localhost:4100';
export const TOKEN = 'e2e-token';
export const TOOL_SLUGS = ['fundability-assessment', 'team-evaluation-tool', 'pitch-deck-analyzer', 'top-10-traits-for-business-success', 'cofounder-compatibility-test', 'problem-solution-fit', 'landing-page-assessment'];

/** Scroll through the page so lazy images load and scroll-driven animations settle. */
export async function scrollThrough(page) {
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += 500) { await page.evaluate((v) => window.scrollTo(0, v), y); await page.waitForTimeout(80); }
  await page.evaluate(() => window.scrollTo(0, 0));
}

/** Answers every question with the third option and waits for the result screen. */
export async function finishQuiz(page) {
  for (let guard = 0; guard < 14; guard++) {
    if (await page.locator('.tr').isVisible()) break;
    const label = await page.locator('.tq-count').innerText();
    await page.locator('.tq-opt').nth(2).click();
    await page.waitForFunction((l) => { const c = document.querySelector('.tq-count'); return !c || c.textContent !== l; }, label);
  }
  await expect(page.locator('.tr')).toBeVisible();
}
