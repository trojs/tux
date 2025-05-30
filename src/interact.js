const walkFrameCount = 8
const walkRow = 1
const idleRow = 0
const animSpeed = 5

const gameOverSound = typeof Audio !== 'undefined'
  ? new Audio('./sounds/icecrash.ogg')
  : { play () {} }

/**
 * @typedef {import('./objects/character.js').Character} Character
 * @param {Character} tux
 * @param {number} levelWidth
 * @returns {Character}
 */
export function handleInput (tux, levelWidth) {
  const newTux = { ...tux }
  if (newTux.gameOver) return newTux
  if (newTux.x < 0) newTux.x = 0
  if (newTux.x + newTux.width > levelWidth) newTux.x = levelWidth - newTux.width
  return newTux
}

/**
 * @param {Character} tux
 * @param {number} canvasHeight
 * @returns {Character}
 */
export function applyGravity (tux, canvasHeight) {
  const newTux = { ...tux }
  if (newTux.gameOver) return newTux

  newTux.vy += newTux.gravity
  newTux.y += newTux.vy
  newTux.onGround = false

  if (newTux.y + newTux.height > canvasHeight * 2) {
    newTux.gameOver = true
    gameOverSound.play()
  }
  return newTux
}

/**
 * @param {Character} tux
 * @param {{ [key: string]: boolean }} keys
 * @returns {Character}
 */
export function jump (tux, keys) {
  const newTux = { ...tux }
  if ((keys['ArrowUp'] || keys[' '] || keys['Space']) && newTux.onGround) {
    newTux.vy = -10
    newTux.onGround = false
  }
  return newTux
}
/**
 * @param {Character} tux
 * @returns {Character}
 */
export function updateTuxAnimation (tux) {
  const newTux = { ...tux }
  newTux.facing = 1

  if (newTux.onGround) {
    newTux.animRow = walkRow
    newTux.animTimer = (newTux.animTimer || 0) + 1
    if (newTux.animTimer >= animSpeed) {
      newTux.animFrame = ((newTux.animFrame || 0) + 1) % walkFrameCount
      newTux.animTimer = 0
    }
  } else {
    newTux.animRow = idleRow
    newTux.animFrame = 0
    newTux.animTimer = 0
  }
  return newTux
}
