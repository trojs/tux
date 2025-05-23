import assert from 'node:assert/strict'
import test from 'node:test'
import { applyGravity, handleInput, jump, updateTuxAnimation } from './interact.js'
import { tux } from './objects/tux.js'

global.Audio = class { play () {} }

test('handleInput clamps tux.x to 0', () => {
  const newTux = { ...tux, x: -5, width: 10, gameOver: false }
  const result = handleInput(newTux, 100)
  assert.equal(result.x, 0)
})

test('handleInput clamps tux.x to levelWidth - tux.width', () => {
  const newTux = { ...tux, x: 95, width: 10, gameOver: false }
  const result = handleInput(newTux, 100)
  assert.equal(result.x, 90)
})

test('applyGravity increases vy and y, sets gameOver if fallen', () => {
  const newTux = { ...tux, y: 50, vy: 2, gravity: 1, gameOver: false }
  const result = applyGravity(newTux, 40)
  assert.equal(result.gameOver, true)
})

test('jump sets vy and onGround if jump key pressed and on ground', () => {
  const newTux = { ...tux, vy: 0, onGround: true }
  const keys = { ' ': true }
  const result = jump(newTux, keys)
  assert.equal(result.vy, -10)
  assert.equal(result.onGround, false)
})

test('jump does nothing if not on ground', () => {
  const newTux = { ...tux, vy: 0, onGround: false }
  const keys = { ' ': true }
  const result = jump(newTux, keys)
  assert.equal(result.vy, 0)
  assert.equal(result.onGround, false)
})

test('updateTuxAnimation advances walk frame on ground', () => {
  const newTux = { ...tux, onGround: true, animFrame: 0, animRow: 0, animTimer: 4 }
  const result = updateTuxAnimation(newTux)
  assert.equal(result.animRow, 1) // walkRow
  assert.equal(result.animFrame, 1) // advanced by 1
  assert.equal(result.animTimer, 0) // reset after animSpeed
})

test('updateTuxAnimation resets to idle in air', () => {
  const newTux = { ...tux, onGround: false, animFrame: 2, animRow: 1, animTimer: 3 }
  const result = updateTuxAnimation(newTux)
  assert.equal(result.animRow, 0) // idleRow
  assert.equal(result.animFrame, 0)
  assert.equal(result.animTimer, 0)
})
