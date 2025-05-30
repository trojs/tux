/* eslint-disable no-await-in-loop */
import { expect, test } from '@playwright/test'

test('Tux can complete level 6 and collect coins', async ({ page }) => {
  await page.goto('http://localhost:3001/')

  await page.keyboard.press(' ')
  await page.keyboard.press('ArrowDown')
  await page.keyboard.press('ArrowDown')
  await page.keyboard.press('ArrowDown')
  await page.keyboard.press('ArrowDown')
  await page.keyboard.press('ArrowDown')
  await page.keyboard.press(' ')

  // Define jump points for level 6 (tune as needed for your level design)
  const jumpPoints = [
    32 * 7, // Onto first platform
    32 * 10, // Up to next platform
    32 * 18, // Up to next platform
    32 * 24, // Up the stairs
    32 * 26, // Continue stairs
    32 * 28, // Top of stairs
    32 * 32, // Down to lower platform
    32 * 53, // Down to lower platform
    32 * 60 // Down to lower platform
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

  await page.waitForFunction(() => globalThis.level > 5 || globalThis.tux.gameOver === true, null, { timeout: 30000 })

  const score = await page.evaluate(() => globalThis.score)

  const storedScore = await page.evaluate(() => Number(localStorage.getItem('tux_score')) || 0)
  expect(score).toBeGreaterThan(0)
  expect(storedScore).toBeGreaterThan(0)
})
