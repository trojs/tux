/* eslint-disable no-await-in-loop */
import { expect, test } from '@playwright/test'

test('Tux can complete level 4 and collect coins', async ({ page }) => {
  await page.goto('http://localhost:3001/')

  await page.keyboard.press(' ')
  await page.keyboard.press('ArrowDown')
  await page.keyboard.press('ArrowDown')
  await page.keyboard.press('ArrowDown')
  await page.keyboard.press(' ')

  const jumpPoints = [
    32 * 13,
    32 * 18,
    32 * 20,
    32 * 22,
    32 * 32,
    32 * 48,
    32 * 62,
    32 * 68,
    32 * 75,
    32 * 80,
    32 * 85,
    32 * 90,
    32 * 95,
    32 * 100,
    32 * 112,
    32 * 123,
    32 * 125,
    32 * 127,
    32 * 129,
    32 * 131,
    32 * 133,
    32 * 135

  ]

  for (const x of jumpPoints) {
    await page.waitForFunction(
      (xVal) => globalThis.tux && globalThis.tux.x >= xVal && globalThis.tux.onGround === true,
      x,
      { timeout: 10000 }
    )
    await page.keyboard.down(' ')
    await page.waitForTimeout(100)
    await page.keyboard.up(' ')
  }

  await page.waitForFunction(() => globalThis.level > 3 || globalThis.tux.gameOver === true, null, { timeout: 30000 })

  const level = await page.evaluate(() => globalThis.level)
  const score = await page.evaluate(() => globalThis.score)
  const storedScore = await page.evaluate(() => Number(localStorage.getItem('tux_score')) || 0)
  expect(level).toBeGreaterThan(3)
  expect(score).toBeGreaterThan(0)
  expect(storedScore).toBeGreaterThan(0)
})
