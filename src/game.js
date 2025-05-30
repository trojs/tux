/* eslint-disable sonarjs/cognitive-complexity */
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
 * @typedef {'start' | 'levelselect' | 'playing' | 'gameover' | 'complete'} GameState
 */

const CHARACTERS = ['tux', 'katie'] // @todo: get characters from character.js
const LEVEL_COUNT = 6 // @todo: get levels from levels.js
/** @type {GameState} */
globalThis.gameState = 'start'
globalThis.level = Number(localStorage.getItem('tux_level')) || 0
globalThis.score = Number(localStorage.getItem('tux_score')) || 0
globalThis.character = localStorage.getItem('tux_character') || 'tux'
let obstacles, coins, levelWidth, levelHeight, music, backgroundColor
globalThis.allLevelsCompleted = false
let scale = 1
let cameraX = 0

const introMusic = new Audio('./music/intro.ogg')
introMusic.loop = true
const completeMusic = new Audio('./music/credits.ogg')
completeMusic.loop = true
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
  const tux = getCharacter(globalThis.character)
  resetCoins()
  introMusic.pause()
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
 * @returns {void}
 */
function drawMenu () {
  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = '#222'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.font = 'bold 48px sans-serif'
  ctx.fillStyle = '#fff'
  ctx.textAlign = 'center'
  ctx.fillText('Tux Platformer', canvas.width / 2, 100)
  ctx.font = 'bold 32px sans-serif'
  ctx.fillText('Choose your character:', canvas.width / 2, 200)
  CHARACTERS.forEach((char, i) => {
    ctx.font = globalThis.character === char ? 'bold 36px sans-serif' : '32px sans-serif'
    ctx.fillStyle = globalThis.character === char ? '#ffd700' : '#fff'
    ctx.fillText(
      char.charAt(0).toUpperCase() + char.slice(1),
      canvas.width / 2,
      270 + i * 60
    )
  })
  ctx.font = '24px sans-serif'
  ctx.fillStyle = '#aaa'
  ctx.fillText('Use Arrow keys or click to select, Enter/Space to confirm', canvas.width / 2, canvas.height - 40)
}

/**
 *
 */
function drawLevelSelect () {
  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = '#222'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.font = 'bold 36px sans-serif'
  ctx.fillStyle = '#fff'
  ctx.textAlign = 'center'
  ctx.fillText('Choose Level', canvas.width / 2, 120)
  for (let i = 0; i < LEVEL_COUNT; i++) {
    ctx.font = globalThis.level === i ? 'bold 32px sans-serif' : '28px sans-serif'
    ctx.fillStyle = globalThis.level === i ? '#ffd700' : '#fff'
    ctx.fillText(`Level ${i + 1}`, canvas.width / 2, 200 + i * 50)
  }
  ctx.font = '24px sans-serif'
  ctx.fillStyle = '#aaa'
  ctx.fillText('Use Arrow keys or click to select, Enter/Space to confirm', canvas.width / 2, canvas.height - 40)
}

/**
 *
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
 * @returns {void}
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
  const tux = getCharacter(globalThis.character)
  if (tux.gameOver && globalThis.gameState === 'playing') {
    globalThis.gameState = 'gameover'
  }
  if (globalThis.gameState === 'start') {
    drawMenu()
    return
  }
  if (globalThis.gameState === 'levelselect') {
    drawLevelSelect()
    return
  }
  if (globalThis.gameState === 'gameover' || globalThis.gameState === 'complete') {
    showGameOver(ctx, canvas, globalThis.gameState === 'complete', music, completeMusic)
    return
  }
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
      globalThis.gameState = 'complete'
      if (music) music.pause()
      completeMusic.currentTime = 0
      completeMusic.play()
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
  localStorage.setItem('tux_character', globalThis.character)
  localStorage.setItem('tux_game_state', globalThis.gameState)
}

/**
 * Handle all menu/game actions in one place.
 * @param {'up'|'down'|'confirm'|'restart'|'menu'} action
 */
function handleAction (action) {
  if (globalThis.gameState === 'start') {
    if (action === 'up') {
      let idx = CHARACTERS.indexOf(globalThis.character)
      idx = (idx - 1 + CHARACTERS.length) % CHARACTERS.length
      globalThis.character = CHARACTERS[idx]
    }
    if (action === 'down') {
      let idx = CHARACTERS.indexOf(globalThis.character)
      idx = (idx + 1) % CHARACTERS.length
      globalThis.character = CHARACTERS[idx]
    }
    if (action === 'confirm') {
      globalThis.gameState = 'levelselect'
    }
    update()
    return
  }
  if (globalThis.gameState === 'levelselect') {
    if (action === 'up') {
      globalThis.level = (globalThis.level - 1 + LEVEL_COUNT) % LEVEL_COUNT
    }
    if (action === 'down') {
      globalThis.level = (globalThis.level + 1) % LEVEL_COUNT
    }
    if (action === 'confirm') {
      globalThis.gameState = 'playing'
      loadLevel(globalThis.level)
      saveProgress()
    }
    update()
  }
  if (globalThis.gameState === 'gameover' || globalThis.gameState === 'complete') {
    if (action === 'restart') {
      if (globalThis.gameState === 'complete') {
        globalThis.level = 0
      }
      globalThis.gameState = 'playing'
      loadLevel(globalThis.level)
      update()
      return
    }
    if (action === 'menu' || action === 'confirm') {
      globalThis.gameState = 'start'
      update()
      return
    }
    update()
  }
}
document.addEventListener('keydown', (event) => {
  keys[event.key] = true
  if (event.key === 'ArrowUp') handleAction('up')
  else if (event.key === 'ArrowDown') handleAction('down')
  else if (event.key === 'Enter' || event.key === ' ') handleAction('confirm')
  else if (event.key === '1') handleAction('restart')
  else if (event.key === '2') handleAction('menu')
})

document.addEventListener('keyup', (event) => {
  keys[event.key] = false
})

/**
 *
 */
function handlePointerMenuAction () {
  // For menus, treat as "confirm" or "menu" depending on state
  if (globalThis.gameState === 'start') handleAction('confirm')
  else if (globalThis.gameState === 'levelselect') handleAction('confirm')
  else if (globalThis.gameState === 'gameover' || globalThis.gameState === 'complete') handleAction('menu')
  else {
    keys[' '] = true
    setTimeout(() => {
      keys[' '] = false
    }, 100)
  }
}

canvas.addEventListener('touchstart', (event) => {
  event.preventDefault()
  handlePointerMenuAction()
})

canvas.addEventListener('mousedown', (event) => {
  event.preventDefault()
  handlePointerMenuAction()
})

window.addEventListener('resize', resizeCanvas)
document.addEventListener('DOMContentLoaded', () => {
  introMusic.play()
  update()
  resizeCanvas()
  handleAction('start')
})
