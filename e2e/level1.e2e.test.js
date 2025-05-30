/* eslint-disable no-await-in-loop */
import { expect, test } from '@playwright/test'

test('Tux can move and collect coins', async ({ page }) => {
  await page.goto('http://localhost:3001/')

  await page.keyboard.press(' ')
  await page.keyboard.press(' ')

  // Define jump points (in pixels)
  const jumpPoints = [
    32 * 5, // First gap 4+3 = 7
    32 * 17, // Second gap 9+11 = 20
    32 * 33 // Third gap 25+11 = 36
  ]

  for (const x of jumpPoints) {
    // Wait until Tux reaches the jump point and is on the ground
    await page.waitForFunction(
      (xVal) => globalThis.tux && globalThis.tux.x >= xVal && globalThis.tux.onGround === true,
      x,
      { timeout: 10000 }
    )
    // Jump (press and release space)
    await page.keyboard.down(' ')
    await page.waitForTimeout(100) // Hold jump for a short time
    await page.keyboard.up(' ')
  }

  // Wait for level completion or game over
  await page.waitForFunction(() => globalThis.score > 0 || globalThis.tux.gameOver === true, null, { timeout: 20000 })

  const level = await page.evaluate(() => globalThis.level)
  const score = await page.evaluate(() => globalThis.score)
  const storedScore = await page.evaluate(() => Number(localStorage.getItem('tux_score')) || 0)
  expect(score).toBeGreaterThan(0)
  expect(storedScore).toBeGreaterThan(0)
  expect(level).toBeGreaterThan(0)
})
