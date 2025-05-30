/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable no-param-reassign */
/* eslint-disable max-statements */
import getCharacter from './objects/character.js'
import { getLevel } from './levels/levels.js'
import { applyGravity, handleInput, jump, updateTuxAnimation } from './interact.js'
import { handleObstacleCollisions } from './collision.js'
import { playMusic } from './music.js'
import { canvas, ctx } from './gui.js'
import { drawProgressBar, showGameOver } from './gui/draw-ui.js'

/**
 * @typedef {import('./objects/character.js').Character} Character
 */

globalThis.level = Number(localStorage.getItem('tux_level')) || 0
globalThis.score = Number(localStorage.getItem('tux_score')) || 0
let obstacles, coins, levelWidth, levelHeight, music, backgroundColor
globalThis.allLevelsCompleted = false
let scale = 1
let cameraX = 0
const character = 'tux'

const completeMusic = new Audio('./music/credits.ogg')
const frameWidth = 32
const frameHeight = 32

/** @type {{ [key: string]: boolean }} */
const keys = {}

/**
 * @param {object} levelData
 * @returns {void}
 */
function updateScale (levelData) {
  scale = Math.min(1, window.innerHeight / levelData.levelHeight)
}

/**
 *
 */
function resizeCanvas () {
  const dpr = window.devicePixelRatio > 1 ? window.devicePixelRatio / 2 : 1
  canvas.width = (window.innerWidth / scale) * dpr
  canvas.height = (window.innerHeight / scale) * dpr
  canvas.style.width = `${window.innerWidth}px`
  canvas.style.height = `${window.innerHeight}px`
  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.scale((1 / scale) * dpr, (1 / scale) * dpr)
}

/**
 * @param {number} newLevel
 * @returns {number}
 */
function loadLevel (newLevel) {
  const tux = getCharacter(character)
  resetCoins()
  completeMusic.pause()
  if (globalThis.allLevelsCompleted) {
    globalThis.level = 0
    tux.gameOver = false
    globalThis.allLevelsCompleted = false
    return loadLevel(0)
  }
  const levelData = getLevel(newLevel)
  if (!levelData) return 0
  obstacles = levelData.obstacles
  coins = levelData.coins || []
  levelWidth = levelData.levelWidth || canvas.width
  levelHeight = Math.max(levelData.levelHeight, canvas.height)

  if (music) {
    music.pause()
  }
  music = levelData.music
  backgroundColor = levelData.backgroundColor
  canvas.style.backgroundColor = backgroundColor
  tux.x = 0
  tux.y = 300
  tux.vy = 0
  tux.gameOver = false
  if (music) {
    playMusic(music)
    music.play()
  }
  updateScale(levelData)
  return newLevel
}

/**
 * @param {Character} tux
 * @returns {void}
 */
function draw (tux) {
  ctx.setTransform(scale, 0, 0, scale, 0, 0)
  ctx.clearRect(0, 0, canvas.width / scale, canvas.height / scale)

  obstacles.forEach((ob) => ob.draw(ctx, cameraX))

  // Draw coins
  if (coins) {
    coins.forEach((coin) => coin.draw(ctx, cameraX, 0))
  }

  ctx.save()
  // Flip for left-facing
  if (tux.facing === -1) {
    ctx.translate(tux.x - cameraX + tux.width / 2, tux.y + tux.height / 2)
    ctx.scale(-1, 1)
    ctx.translate(-tux.width / 2, -tux.height / 2)
    ctx.drawImage(
      tux.img,
      tux.animFrame * frameWidth, tux.animRow * frameHeight,
      frameWidth, frameHeight,
      0, 0,
      tux.width, tux.height
    )
  } else {
    ctx.drawImage(
      tux.img,
      tux.animFrame * frameWidth, tux.animRow * frameHeight,
      frameWidth, frameHeight,
      tux.x - cameraX, tux.y,
      tux.width, tux.height
    )
    ctx.setTransform(1, 0, 0, 1, 0, 0)
  }

  // Show current level at the top center
  ctx.font = 'bold 20px sans-serif'
  ctx.fillStyle = '#fff'
  ctx.textAlign = 'center'
  // Get level name if available
  const levelData = getLevel(globalThis.level)
  ctx.fillText(`Level ${globalThis.level + 1}: ${levelData.name}`, canvas.width / 2, 32)

  let levelScore = globalThis.score

  if (coins) {
    const collected = coins.filter((c) => c.collected).length
    levelScore += collected
    const total = coins.length
    ctx.font = 'bold 20px sans-serif'
    ctx.fillStyle = '#ffd700'
    ctx.textAlign = 'left'
    ctx.fillText(`Coins: ${collected} / ${total}`, 32, 32)
  }
  ctx.font = 'bold 20px sans-serif'
  ctx.fillStyle = '#fff'
  ctx.textAlign = 'right'
  ctx.fillText(`Score: ${levelScore}`, canvas.width - 32, 32)

  const progress = Math.max(0, Math.min(1, tux.x / (levelWidth - tux.width)))
  drawProgressBar(ctx, progress, canvas, scale)

  if (tux.gameOver) {
    showGameOver(ctx, canvas, globalThis.allLevelsCompleted, music, completeMusic)
  }
}

/**
 *
 * @param {Character} tux
 * returns {void}
 */
function updateCamera (tux) {
  cameraX = tux.x + tux.width / 2 - canvas.width / 2

  if (cameraX < 0) cameraX = 0
  if (cameraX > levelWidth - canvas.width) cameraX = levelWidth - canvas.width
}
/**
 *
 */
function resetCoins () {
  if (coins) {
    coins.forEach((coin) => {
      coin.collected = false
    })
  }
}
// Restart current level (after game over or manual restart)
/**
 *
 */
globalThis.restartLevel = () => {
  loadLevel(globalThis.level)
}
/**
 *
 */
function update () {
  const tux = getCharacter(character)
  if (!tux.gameOver) {
    tux.x += tux.speed
  } else if (keys['ArrowUp'] || keys[' '] || keys['Space']) {
    globalThis.restartLevel()
  }

  Object.assign(tux, handleInput(tux, levelWidth))
  Object.assign(tux, jump(tux, keys))
  Object.assign(tux, applyGravity(tux, levelHeight))
  Object.assign(tux, handleObstacleCollisions(tux, obstacles))
  Object.assign(tux, updateTuxAnimation(tux))

  // --- Coin collection logic ---
  if (coins) {
    coins.forEach((coin) => {
      if (coin.collidesWith(tux)) {
        coin.collected = true
      }
    })
  }

  if (tux.x + tux.width >= levelWidth) {
    globalThis.score += coins.filter((c) => c.collected).length
    if (getLevel(globalThis.level + 1)) {
      globalThis.level++
      loadLevel(globalThis.level)
    } else {
      tux.gameOver = true
      globalThis.allLevelsCompleted = true
    }
    saveProgress()
  }

  updateCamera(tux)
  draw(tux)
  globalThis.tux = tux
  requestAnimationFrame(update)
}

/**
 *
 */
function saveProgress () {
  localStorage.setItem('tux_level', globalThis.level)
  localStorage.setItem('tux_score', globalThis.score)
}

document.addEventListener('keydown', (event) => {
  keys[event.key] = true
})

document.addEventListener('keyup', (event) => {
  keys[event.key] = false
})

canvas.addEventListener('touchstart', (event) => {
  event.preventDefault()
  keys[' '] = true
  setTimeout(() => {
    keys[' '] = false
  }, 100)
})

canvas.addEventListener('mousedown', (event) => {
  event.preventDefault()
  keys[' '] = true
  setTimeout(() => {
    keys[' '] = false
  }, 100)
})

window.addEventListener('resize', resizeCanvas)
document.addEventListener('DOMContentLoaded', () => {
  loadLevel(globalThis.level)
  update()
  resizeCanvas()
})
