import { defineConfig, devices } from '@playwright/test';

// Starts the API (embedded PostgreSQL, no setup) and the built website, then runs the specs on desktop and a phone.
// Run `npm run build` first (the `npm run e2e` script does it for you).
export default defineConfig({
  testDir: './e2e',
  timeout: 45_000,
  expect: { timeout: 8_000 },
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: 'http://localhost:3100',
    trace: 'on-first-retry',
    launchOptions: process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {},
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  webServer: [
    { command: 'node src/server.js', cwd: '../api', url: 'http://localhost:4100/api/health', timeout: 60_000, reuseExistingServer: !process.env.CI,
      env: { PORT: '4100', PGLITE_DIR: 'memory://', ADMIN_TOKEN: 'e2e-token', LEAD_RATE_LIMIT: '100' } },
    { command: 'npx next start -p 3100', url: 'http://localhost:3100', timeout: 60_000, reuseExistingServer: !process.env.CI,
      env: { API_URL: 'http://localhost:4100', SITE_URL: 'http://localhost:3100' } },
  ],
});
