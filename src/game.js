/* eslint-disable no-alert */
/* eslint-disable complexity */
/* eslint-disable max-depth */
/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable no-param-reassign */
/* eslint-disable max-statements */
import {
  characters,
  getCharacter
} from './objects/character.js'
import { getLevel, levels } from './levels/levels.js'
import { applyGravity, handleInput, jump, updateTuxAnimation } from './interact.js'
import { handleObstacleCollisions } from './collision.js'
import { playMusic } from './music.js'
import { canvas, ctx } from './gui.js'
import { drawProgressBar, showGameOver } from './gui/draw-ui.js'
import { Coin } from './objects/coin.js'

/**
 * @typedef {import('./objects/character.js').Character} Character
 * @typedef {'start' | 'levelselect' | 'playing' | 'gameover' | 'complete'} GameState
 */

const CHARACTERS = Object.keys(characters)
const LEVEL_COUNT = levels.length
/** @type {GameState} */
globalThis.gameState = 'start'
globalThis.level = Number(localStorage.getItem('tux_level')) || 0
globalThis.score = Number(localStorage.getItem('tux_score')) || 0
globalThis.character = localStorage.getItem('tux_character') || 'tux'
let selectedCharacterName = globalThis.character
const unlockedCharacters = JSON.parse(localStorage.getItem('tux_unlocked_characters') || '["tux"]')
let obstacles, coins, levelWidth, levelHeight, music, backgroundColor
globalThis.allLevelsCompleted = false
let scale = 1
let cameraX = 0
let clickableObjects = []

const introMusic = new Audio('./music/intro.ogg')
introMusic.loop = true
const completeMusic = new Audio('./music/credits.ogg')
completeMusic.loop = true
const frameWidth = 32
const frameHeight = 32

/** @type {{ [key: string]: boolean }} */
const keys = {}

const hudCoin = new Coin(0, 0, 32, 24)
hudCoin.x = 32
hudCoin.y = 8
hudCoin.collected = false

const menuCoin = new Coin(0, 0, 32, 32)

Object.values(characters).forEach((charObj) => {
  if (charObj.img && !charObj.img.complete) {
    charObj.img.onload = () => {
      if (globalThis.gameState === 'start') update()
    }
  }
})

/**
 *
 */
function saveUnlockedCharacters () {
  localStorage.setItem('tux_unlocked_characters', JSON.stringify(unlockedCharacters))
}

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
  clickableObjects = []
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
  if (music) music.pause()
  completeMusic.pause()
  introMusic.play()
  clickableObjects = []
  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = '#222'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.font = 'bold 48px sans-serif'
  ctx.fillStyle = '#fff'
  ctx.textAlign = 'center'
  ctx.fillText('Tux', canvas.width / 2, 100)

  let perRow = 4
  let iconSize = 250
  let spacingX = 60
  let spacingY = 60
  if (window.innerWidth < 700 || window.innerHeight > window.innerWidth) {
    perRow = 2
    iconSize = Math.min(180, canvas.width / 2 - 40)
    spacingX = 24
    spacingY = 32
  }

  const startX = (canvas.width - (perRow * iconSize + (perRow - 1) * spacingX)) / 2
  const startY = 180

  CHARACTERS.forEach((char, i) => {
    const col = i % perRow
    const row = Math.floor(i / perRow)
    const x = startX + col * (iconSize + spacingX)
    const y = startY + row * (iconSize + spacingY + 40)

    const isUnlocked = unlockedCharacters.includes(char)
    ctx.font = selectedCharacterName === char ? 'bold 28px sans-serif' : '24px sans-serif'
    ctx.fillStyle = selectedCharacterName === char ? '#ffd700' : '#fff'
    ctx.fillText(
      char.charAt(0).toUpperCase() + char.slice(1),
      x + iconSize / 2,
      y + 30
    )

    if (selectedCharacterName === char) {
      ctx.save()
      ctx.strokeStyle = '#ffd700'
      ctx.lineWidth = 6
      ctx.shadowColor = '#ffd700'
      ctx.shadowBlur = 16
      ctx.strokeRect(x - 4, y + 34, iconSize + 8, iconSize + 8)
      ctx.restore()
    }

    const icon = characters[char].img
    if (isUnlocked) {
      ctx.drawImage(icon, x, y + 40, iconSize, iconSize)
    } else {
      ctx.save()
      ctx.globalAlpha = 0.4
      ctx.drawImage(icon, x, y + 40, iconSize, iconSize)
      ctx.globalAlpha = 1

      menuCoin.x = x + iconSize / 2 - 16
      menuCoin.y = y + 40 + iconSize + 6
      menuCoin.collected = false
      menuCoin.draw(ctx, 0, 0)

      ctx.font = 'bold 22px sans-serif'
      ctx.fillStyle = '#ffd700'
      ctx.textAlign = 'left'
      ctx.fillText(
        `${characters[char].price}`,
        x + iconSize / 2 + 20,
        y + iconSize + 32
      )
      ctx.restore()
    }

    clickableObjects.push({
      type: 'character',
      value: char,
      x: x,
      y: y + 40,
      width: iconSize,
      height: iconSize
    })
  })

  ctx.font = 'bold 20px sans-serif'
  ctx.fillStyle = '#fff'
  ctx.textAlign = 'right'
  ctx.fillText(`Score: ${globalThis.score}`, canvas.width - 32, 32)
}

/**
 * Get the pointer (mouse or touch) position relative to the canvas.
 * @param {MouseEvent | TouchEvent} event - The pointer event.
 * @returns {{ x: number, y: number }} The x and y coordinates relative to the canvas.
 */
function getPointerPos (event) {
  const rect = canvas.getBoundingClientRect()
  let clientX, clientY
  if (event.touches && event.touches.length > 0) {
    clientX = event.touches[0].clientX
    clientY = event.touches[0].clientY
  } else {
    clientX = event.clientX
    clientY = event.clientY
  }
  const x = (clientX - rect.left) * (canvas.width / rect.width)
  const y = (clientY - rect.top) * (canvas.height / rect.height)
  return { x, y }
}

/**
 * @param {Character} char
 * @returns {void}
 */
function selectedCharacter (char) {
  if (unlockedCharacters.includes(char)) {
    globalThis.character = char
    selectedCharacterName = char
    globalThis.gameState = 'levelselect'
    update()
  } else {
    const { price } = characters[char]
    if (globalThis.score >= price) {
      globalThis.score -= price
      unlockedCharacters.push(char)
      saveUnlockedCharacters()
      globalThis.character = char
      selectedCharacterName = char
      saveProgress()
      update()
      alert(`${char.charAt(0).toUpperCase() + char.slice(1)} gekocht!`)
    } else {
      alert(`Niet genoeg munten voor ${char.charAt(0).toUpperCase() + char.slice(1)}!`)
    }
  }
}

/**
 * Handle clicks or touches on the canvas and trigger actions for clickable objects.
 * @param {MouseEvent | TouchEvent} event - The pointer event.
 * @returns {void}
 */
function handleCanvasClick (event) {
  const { x, y } = getPointerPos(event)
  for (const obj of clickableObjects) {
    if (
      x >= obj.x
      && x <= obj.x + obj.width
      && y >= obj.y
      && y <= obj.y + obj.height
    ) {
      if (obj.type === 'character') {
        selectedCharacter(obj.value)
        return
      }
      if (obj.type === 'level') {
        globalThis.level = obj.value
        handleAction('confirm')
      }
      if (obj.type === 'menu') {
        handleAction(obj.value)
      }
      return
    }
  }
  handlePointerMenuAction()
}

/**
 *
 */
function drawLevelSelect () {
  if (music) music.pause()
  completeMusic.pause()
  introMusic.play()
  clickableObjects = []
  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = '#222'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.font = 'bold 36px sans-serif'
  ctx.fillStyle = '#fff'
  ctx.textAlign = 'center'
  ctx.fillText('Kies een level', canvas.width / 2, 120)
  for (let i = 0; i < LEVEL_COUNT; i++) {
    const x = canvas.width / 2
    const y = 200 + i * 50
    ctx.font = globalThis.level === i ? 'bold 32px sans-serif' : '28px sans-serif'
    ctx.fillStyle = globalThis.level === i ? '#ffd700' : '#fff'
    ctx.fillText(`Level ${i + 1}`, x, y)

    clickableObjects.push({
      type: 'level',
      value: i,
      x: x - 100,
      y: y - 25,
      width: 200,
      height: 40
    })
  }
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

  if (coins) {
    coins.forEach((coin) => coin.draw(ctx, cameraX, 0))
  }

  ctx.save()
  if (tux.facing === -1) {
    ctx.translate(tux.x - cameraX + tux.width / 2, tux.y + tux.height / 2)
    ctx.scale(-1, 1)
    ctx.translate(-tux.width / 2, -tux.height / 2)
    ctx.drawImage(
      tux.sprite,
      tux.animFrame * frameWidth, tux.animRow * frameHeight,
      frameWidth, frameHeight,
      0, 0,
      tux.width, tux.height
    )
  } else {
    ctx.drawImage(
      tux.sprite,
      tux.animFrame * frameWidth, tux.animRow * frameHeight,
      frameWidth, frameHeight,
      tux.x - cameraX, tux.y,
      tux.width, tux.height
    )
    ctx.setTransform(1, 0, 0, 1, 0, 0)
  }

  ctx.font = 'bold 20px sans-serif'
  ctx.fillStyle = '#fff'
  ctx.textAlign = 'center'

  const levelData = getLevel(globalThis.level)
  ctx.fillText(`Level ${globalThis.level + 1}: ${levelData.name}`, canvas.width / 2, 32)

  let levelScore = globalThis.score

  if (coins) {
    const collected = coins.filter((c) => c.collected).length
    levelScore += collected
    const total = coins.length
    hudCoin.draw(ctx, 0, 0)
    ctx.font = 'bold 20px sans-serif'
    ctx.fillStyle = '#ffd700'
    ctx.textAlign = 'left'
    ctx.fillText(`${collected} / ${total}`, 64, 28)
  }
  ctx.font = 'bold 20px sans-serif'
  ctx.fillStyle = '#fff'
  ctx.textAlign = 'right'
  ctx.fillText(`Score: ${levelScore}`, canvas.width - 32, 32)

  const progress = Math.max(0, Math.min(1, tux.x / (levelWidth - tux.width)))
  drawProgressBar(ctx, progress, canvas, scale)

  if (tux.gameOver) {
    clickableObjects = showGameOver(ctx, canvas, globalThis.allLevelsCompleted, music, completeMusic)
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
    clickableObjects = showGameOver(ctx, canvas, globalThis.gameState === 'complete', music, completeMusic)
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
  saveUnlockedCharacters()
}

/**
 * Handle all menu/game actions in one place.
 * @param {('up'|'down'|'confirm'|'restart'|'menu')=} action
 */
function handleAction (action) {
  if (globalThis.gameState === 'start') {
    if (action === 'up') {
      let idx = CHARACTERS.indexOf(selectedCharacterName)
      idx = (idx - 1 + CHARACTERS.length) % CHARACTERS.length
      selectedCharacterName = CHARACTERS[idx]
    }
    if (action === 'down') {
      let idx = CHARACTERS.indexOf(selectedCharacterName)
      idx = (idx + 1) % CHARACTERS.length
      selectedCharacterName = CHARACTERS[idx]
    }
    if (action === 'confirm') {
      selectedCharacter(selectedCharacterName)
      return
    }
    if (action === 'menu') {
      globalThis.gameState = 'start'
      update()
      return
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
    if (action === 'menu') {
      globalThis.gameState = 'start'
      update()
      return
    }
    update()
  }
  if (globalThis.gameState === 'gameover' || globalThis.gameState === 'complete') {
    if (action === 'up' || action === 'down') {
      globalThis.menuSelection = (globalThis.menuSelection === 'restart') ? 'menu' : 'restart'
      update()
      return
    }
    if (action === 'restart') {
      if (globalThis.gameState === 'complete') {
        globalThis.level = 0
      }
      globalThis.gameState = 'playing'
      loadLevel(globalThis.level)
      update()
      return
    }
    if (action === 'confirm') {
      handleAction(globalThis.menuSelection)
      return
    }
    if (action === 'menu') {
      globalThis.gameState = 'start'
      update()
      return
    }
    update()
  }
  if (action === 'menu') {
    globalThis.gameState = 'start'
    update()
  }
}
document.addEventListener('keydown', (event) => {
  keys[event.key] = true
  if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') handleAction('up')
  else if (event.key === 'ArrowDown' || event.key === 'ArrowRight') handleAction('down')
  else if (event.key === 'Enter' || event.key === ' ') handleAction('confirm')
  else if (event.key === '1') handleAction('restart')
  else if (event.key === '2') handleAction('menu')
  else if (event.key === 'Escape') handleAction('menu')
})

document.addEventListener('keyup', (event) => {
  keys[event.key] = false
})

/**
 *
 */
function handlePointerMenuAction () {
  if (globalThis.gameState === 'start') handleAction('confirm')
  else if (globalThis.gameState === 'levelselect') handleAction('confirm')
  else if (globalThis.gameState === 'gameover' || globalThis.gameState === 'complete') handleAction('restart')
  else {
    keys[' '] = true
    setTimeout(() => {
      keys[' '] = false
    }, 100)
  }
}

/**
 *
 */
function reset () {
  localStorage.setItem('tux_level', 0)
  localStorage.setItem('tux_score', 0)
  localStorage.setItem('tux_character', 'tux')
  localStorage.setItem('tux_game_state', 'start')
  localStorage.setItem('tux_unlocked_characters', '["tux"]')
  update()
  resizeCanvas()
  handleAction()
}

globalThis.resetGame = reset

canvas.addEventListener('touchstart', (event) => {
  event.preventDefault()
  handleCanvasClick(event)
})

canvas.addEventListener('mousedown', (event) => {
  event.preventDefault()
  handleCanvasClick(event)
})
canvas.addEventListener('mousemove', (event) => {
  const { x, y } = getPointerPos(event)
  for (const obj of clickableObjects) {
    if (
      x >= obj.x
      && x <= obj.x + obj.width
      && y >= obj.y
      && y <= obj.y + obj.height
    ) {
      if ((obj.type === 'menu') && (globalThis.gameState === 'gameover' || globalThis.gameState === 'complete')) {
        if (globalThis.menuSelection !== obj.value) {
          globalThis.menuSelection = obj.value
          update()
        }
        return
      }
      if (obj.type === 'character' && globalThis.gameState === 'start') {
        if (selectedCharacterName !== obj.value) {
          selectedCharacterName = obj.value
          update()
        }
      }
      if (obj.type === 'level' && globalThis.gameState === 'levelselect') {
        if (globalThis.level !== obj.value) {
          globalThis.level = obj.value
          update()
        }
      }
      return
    }
  }
})

window.addEventListener('resize', resizeCanvas)
document.addEventListener('DOMContentLoaded', () => {
  introMusic.play()
  update()
  resizeCanvas()
  handleAction()
})
