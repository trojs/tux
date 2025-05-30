/* eslint-disable no-await-in-loop */
import { expect, test } from '@playwright/test'

test('Tux can complete level 2 and collect coins', async ({ page }) => {
  await page.goto('http://localhost:3001/')

  await page.keyboard.press(' ')
  await page.keyboard.press('ArrowDown')
  await page.keyboard.press(' ')

  // Define jump points for level 2 (adjust as needed for your level design)
  const jumpPoints = [
    32 * 5,
    32 * 17,
    32 * 32
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
    await page.waitForTimeout(100)
    await page.keyboard.up(' ')
  }

  await page.waitForFunction(() => globalThis.level > 1 || globalThis.tux.gameOver === true, null, { timeout: 20000 })

  const level = await page.evaluate(() => globalThis.level)
  const score = await page.evaluate(() => globalThis.score)
  const storedScore = await page.evaluate(() => Number(localStorage.getItem('tux_score')) || 0)
  expect(level).toBeGreaterThan(1)
  expect(score).toBeGreaterThan(0)
  expect(storedScore).toBeGreaterThan(0)
})
