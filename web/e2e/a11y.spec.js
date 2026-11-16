import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const PAGES = ['/', '/blog', '/tools', '/tools/fundability-assessment', '/blog/the-elevator-pitch-for-business-entrepreneurs'];

for (const theme of ['light', 'dark']) {
  for (const path of PAGES) {
    test(`no axe violations: ${path} (${theme})`, async ({ page, isMobile }) => {
      test.skip(isMobile, 'covered on desktop; mobile is checked in the menu test');
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.addInitScript((t) => localStorage.setItem('theme', t), theme);
      await page.goto(path);
      await page.waitForTimeout(800);
      const { violations } = await new AxeBuilder({ page }).analyze();
      expect(violations.map((v) => `${v.id} x${v.nodes.length}`)).toEqual([]);
    });
  }
}
