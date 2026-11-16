import { test, expect } from '@playwright/test';
import { API, TOKEN } from './helpers.js';

test('contact form saves a lead through the server action and the API', async ({ page, request }, info) => {
  const email = `e2e-${info.project.name}-${Date.now()}@example.com`;
  await page.goto('/#contact');
  await page.fill('#f-name', 'E2E Parent');
  await page.fill('#f-email', email);
  await page.fill('#f-phone', '+91 98047 72106');
  await page.fill('#f-msg', 'Automated end-to-end test');
  await page.getByRole('button', { name: 'Send request' }).click();
  await expect(page.locator('.form.ok')).toBeVisible();
  const res = await request.get(`${API}/api/leads`, { headers: { authorization: `Bearer ${TOKEN}` } });
  expect((await res.json()).data.map((l) => l.email)).toContain(email);
});

test('contact form shows a validation error and keeps what the visitor typed', async ({ page }) => {
  await page.goto('/#contact');
  await page.fill('#f-name', 'Ravi');
  await page.fill('#f-email', 'ravi@example.com');
  await page.fill('#f-phone', 'abc');
  await page.getByRole('button', { name: 'Send request' }).click();
  await expect(page.locator('.err')).toContainText('phone');
  await expect(page.locator('#f-name')).toHaveValue('Ravi');
});
