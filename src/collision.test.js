import assert from 'node:assert/strict'
import test from 'node:test'
import { handleObstacleCollisions } from './collision.js'
import { tux } from './objects/tux.js'

test('Tux lands on top of an obstacle', () => {
  const newTux = { ...tux, x: 10, y: 91, width: 10, height: 10, vy: 5 }
  const obstacles = [{ x: 0, y: 100, width: 50, height: 10 }]
  const result = handleObstacleCollisions(newTux, obstacles)
  assert.equal(result.y, 90) // Should be on top of obstacle
  assert.equal(result.vy, 0)
  assert.equal(result.onGround, true)
})

test('Tux collides with left side of obstacle', () => {
  const newTux = { ...tux, x: 40, y: 90, width: 10, height: 10, vy: 0 }
  const obstacles = [{ x: 50, y: 90, width: 10, height: 10 }]
  const result = handleObstacleCollisions(newTux, obstacles)
  assert.equal(result.x, 40) // Should be pushed to the left of obstacle
})

test('Tux collides with right side of obstacle', () => {
  const newTux = { ...tux, x: 59, y: 90, width: 10, height: 10, vy: 0 }
  const obstacles = [{ x: 50, y: 90, width: 10, height: 10 }]
  const result = handleObstacleCollisions(newTux, obstacles)
  assert.equal(result.x, 60) // Should be pushed to the right of obstacle
})

test('Tux does not collide when not overlapping', () => {
  const newTux = { ...tux, x: 0, y: 0, width: 10, height: 10, vy: 0 }
  const obstacles = [{ x: 50, y: 50, width: 10, height: 10 }]
  const result = handleObstacleCollisions(newTux, obstacles)
  assert.equal(result.onGround, false)
})
