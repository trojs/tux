/* eslint-disable no-await-in-loop */
import { expect, test } from '@playwright/test'

test('Tux can complete level 5 and collect coins', async ({ page }) => {
  await page.goto('http://localhost:3001/')

  // Set the game to start at level 5 (index 4)
  await page.evaluate(() => { globalThis.level = 4 })

  // Restart the level to ensure it loads level 5
  await page.evaluate(() => { globalThis.restartLevel() })

  // Define jump points for level 5 (tune as needed for your level design)
  const jumpPoints = [
    32 * 7,
    32 * 15,
    32 * 22,
    32 * 30,
    32 * 38
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

  await page.waitForFunction(() => globalThis.level > 4 || globalThis.tux.gameOver === true, null, { timeout: 30000 })

  const level = await page.evaluate(() => globalThis.level)
  const score = await page.evaluate(() => globalThis.score)
  const storedScore = await page.evaluate(() => Number(localStorage.getItem('tux_score')) || 0)
  expect(level).toBeGreaterThan(4)
  expect(score).toBeGreaterThan(0)
  expect(storedScore).toBeGreaterThan(0)
})
