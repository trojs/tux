import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  snapshotPathTemplate: '{testDir}/__screenshots__/{testName}-{arg}.png',
  fullyParallel: false,
  workers: 1,
  reporter: [
    ['monocart-reporter', {
        coverage: {
            entryFilter: (entry) => true,
            sourceFilter: (sourcePath) => sourcePath.search(/src\/.+/) !== -1,
            reports: ['lcov']
        }
    }],
    ['html'], ['list', { printSteps: true }]],
  use: {
    baseURL: 'http://localhost:3001',
    trace: 'on',
    screenshot: 'only-on-failure'
  },
  webServer: {
    command: 'npm run serve',
    url: 'http://localhost:3001',
    reuseExistingServer: true
  },
  retries: 3,
  maxFailures: 5,
  expect: {
    timeout: 10000
  }
})
