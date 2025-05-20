import { tux } from './objects/tux.js'

const walkFrameCount = 8
const walkRow = 1
const idleRow = 0
const animSpeed = 5

/**
 * @param {{ [key: string]: boolean }} keys
 * @param {number} levelWidth
 * @returns {void}
 */
export function handleInput (keys, levelWidth) {
  if (tux.gameOver) return
  if (tux.x < 0) tux.x = 0
  if (tux.x + tux.width > levelWidth) tux.x = levelWidth - tux.width
}

/**
 * @param {HTMLCanvasElement} canvas
 * @returns {void}
 */
export function applyGravity (canvas) {
  if (tux.gameOver) return

  tux.vy += tux.gravity
  tux.y += tux.vy

  tux.onGround = false

  if (tux.y > canvas.height) {
    tux.gameOver = true

    const music = new Audio('./sounds/icecrash.ogg')
    music.play()
  }
}

/**
 * @param {{ [key: string]: boolean }} keys
 * @returns {void}
 */
export function jump (keys) {
  if ((keys['ArrowUp'] || keys[' '] || keys['Space']) && tux.onGround) {
    tux.vy = -10
    tux.onGround = false
  }
}
/**
 * @param {{ [key: string]: boolean }} keys
 * @returns {void}
 */
export function updateTuxAnimation (keys) {
  // Determine direction
  tux.facing = 1

  // Walking animation
  if (tux.onGround) {
    tux.animRow = walkRow
    tux.animTimer++
    if (tux.animTimer >= animSpeed) {
      tux.animFrame = (tux.animFrame + 1) % walkFrameCount
      tux.animTimer = 0
    }
  } else {
    // Idle
    tux.animRow = idleRow
    tux.animFrame = 0
    tux.animTimer = 0
  }
}
