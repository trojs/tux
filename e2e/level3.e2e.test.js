/* eslint-disable no-await-in-loop */
import { expect, test } from '@playwright/test'

test('Tux can complete level 3 and collect coins', async ({ page }) => {
  await page.goto('http://localhost:3001/')

  // Set the game to start at level 3 (index 2)
  await page.evaluate(() => { globalThis.level = 2 })

  // Restart the level to ensure it loads level 3
  await page.evaluate(() => { globalThis.restartLevel() })

  const jumpPoints = [
    32 * 5,
    32 * 10,
    32 * 15,
    32 * 25,
    32 * 44
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

  await page.waitForFunction(() => globalThis.level > 2 || globalThis.tux.gameOver === true, null, { timeout: 20000 })

  const level = await page.evaluate(() => globalThis.level)
  const score = await page.evaluate(() => globalThis.score)
  const storedScore = await page.evaluate(() => Number(localStorage.getItem('tux_score')) || 0)
  expect(level).toBeGreaterThan(2)
  expect(score).toBeGreaterThan(0)
  expect(storedScore).toBeGreaterThan(0)
})
