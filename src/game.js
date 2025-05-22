import { tux } from './objects/tux.js'
import { getLevel } from './levels/levels.js'
import { applyGravity, handleInput, jump, updateTuxAnimation } from './interact.js'
import { handleObstacleCollisions } from './collision.js'
import { playMusic } from './music.js'

let level = 0
let obstacles, levelWidth, music, backgroundColor
let allLevelsCompleted = false

const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d')
canvas.width = 800
canvas.height = 600
canvas.style.backgroundColor = backgroundColor
canvas.style.border = '1px solid black'
document.body.appendChild(canvas)

/**
 *
 */
function resizeCanvas () {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
}
resizeCanvas()
window.addEventListener('resize', resizeCanvas)

const tuxImg = new Image()
tuxImg.src = 'sprites/tux.png'

const frameWidth = 32
const frameHeight = 32

let cameraX = 0

/** @type {{ [key: string]: boolean }} */
const keys = {}
document.addEventListener('keydown', (e) => {
  keys[e.key] = true
})
document.addEventListener('keyup', (e) => {
  keys[e.key] = false
})

/**
 * @param {number} newLevel
 * @returns {boolean}
 */
function loadLevel (newLevel) {
  const levelData = getLevel(newLevel)
  if (!levelData) return false
  obstacles = levelData.obstacles
  levelWidth = levelData.levelWidth
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
  playMusic(music)
  music.play()
  return true
}

loadLevel(level)

/**
 *
 */
function draw () {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  obstacles.forEach((ob) => ob.draw(ctx, cameraX))
  ctx.save()
  // Flip for left-facing
  if (tux.facing === -1) {
    ctx.translate(tux.x - cameraX + tux.width / 2, tux.y + tux.height / 2)
    ctx.scale(-1, 1)
    ctx.translate(-tux.width / 2, -tux.height / 2)
    ctx.drawImage(
      tuxImg,
      tux.animFrame * frameWidth, tux.animRow * frameHeight,
      frameWidth, frameHeight,
      0, 0,
      tux.width, tux.height
    )
  } else {
    ctx.drawImage(
      tuxImg,
      tux.animFrame * frameWidth, tux.animRow * frameHeight,
      frameWidth, frameHeight,
      tux.x - cameraX, tux.y,
      tux.width, tux.height
    )
  }

  // Show current level at the top center
  ctx.font = 'bold 20px sans-serif'
  ctx.fillStyle = '#fff'
  ctx.textAlign = 'center'
  // Get level name if available
  const levelData = getLevel(level)
  ctx.fillText(`Level ${level + 1}: ${levelData.name}`, canvas.width / 2, 32)

  // Draw level progress bar
  const barWidth = canvas.width * 0.6
  const barHeight = 16
  const barX = (canvas.width - barWidth) / 2
  const barY = 48

  const progress = Math.max(0, Math.min(1, tux.x / (levelWidth - tux.width)))
  ctx.save()
  ctx.fillStyle = '#222'
  ctx.fillRect(barX, barY, barWidth, barHeight)
  ctx.fillStyle = '#4caf50'
  ctx.fillRect(barX, barY, barWidth * progress, barHeight)
  ctx.strokeStyle = '#fff'
  ctx.lineWidth = 2
  ctx.strokeRect(barX, barY, barWidth, barHeight)
  ctx.font = '14px sans-serif'
  ctx.fillStyle = '#fff'
  ctx.textAlign = 'center'
  ctx.fillText(
    `Level Progress: ${(progress * 100).toFixed(0)}%`,
    canvas.width / 2,
    barY + barHeight - 3
  )
  ctx.restore()

  if (tux.gameOver) {
    ctx.fillStyle = 'rgba(0,0,0,0.7)'
    ctx.fillRect(0, canvas.height / 2 - 100, canvas.width, 300)
    ctx.fillStyle = 'white'
    ctx.font = 'bold 48px sans-serif'
    ctx.textAlign = 'center'
    if (allLevelsCompleted) {
      ctx.fillText('Congratulations!', canvas.width / 2, canvas.height / 2 - 20)
      ctx.font = '32px sans-serif'
      ctx.fillText('You completed all levels!', canvas.width / 2, canvas.height / 2 + 30)
    } else {
      ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2 - 20)

      // Draw level selection
      ctx.font = '24px sans-serif'
    }
  }
}

/**
 *
 */
function updateCamera () {
  // Center camera on Tux
  cameraX = tux.x + tux.width / 2 - canvas.width / 2
  // Clamp cameraX to 0 or level width (if you have a level width)
  if (cameraX < 0) cameraX = 0
  // If you have a levelWidth variable, uncomment the next line:
  if (cameraX > levelWidth - canvas.width) cameraX = levelWidth - canvas.width
}
/**
 *
 */
function update () {
  if (!tux.gameOver) {
    tux.x += tux.speed
  }
  handleInput(keys, levelWidth)
  jump(keys)
  applyGravity(canvas)
  handleObstacleCollisions(obstacles)
  updateTuxAnimation(keys)
  if (tux.x + tux.width >= levelWidth) {
    if (getLevel(level + 1)) {
      level++
      loadLevel(level)
    } else {
      tux.gameOver = true
      allLevelsCompleted = true
    }
  }
  updateCamera()
  draw()
  requestAnimationFrame(update)
}
canvas.addEventListener('touchstart', (e) => {
  e.preventDefault()
  if (tux.gameOver) {
    loadLevel(level) // Restart current level on touch if game over
    return
  }
  keys[' '] = true
  setTimeout(() => {
    keys[' '] = false
  }, 100)
})
document.addEventListener('keydown', (e) => {
  if (tux.gameOver) {
    loadLevel(level)
  }
})

tuxImg.onload = () => update()
