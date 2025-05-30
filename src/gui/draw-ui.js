/* eslint-disable max-statements */
/* eslint-disable no-param-reassign */
/**
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} progress
 * @param {HTMLCanvasElement} canvas
 * @param {number} scale
 */
export function drawProgressBar (ctx, progress, canvas, scale) {
  const barWidth = canvas.width * 0.6
  const barHeight = 16
  const barX = (canvas.width - barWidth) / 2
  const barY = 48

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
}

/**
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {HTMLCanvasElement} canvas
 * @param {boolean} allLevelsCompleted
 * @param {HTMLAudioElement} music
 * @param {HTMLAudioElement} completeMusic
 * @returns {Array<{type: string, value: string, x: number, y: number, width: number, height: number}>}
 */
export function showGameOver (ctx, canvas, allLevelsCompleted, music, completeMusic) {
  const clickableObjects = []
  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = 'rgba(0,0,0,0.7)'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.font = 'bold 48px sans-serif'
  ctx.fillStyle = '#fff'
  ctx.textAlign = 'center'
  if (allLevelsCompleted) {
    ctx.fillText('Congratulations!', canvas.width / 2, canvas.height / 2 - 20)
    ctx.font = '32px sans-serif'
    ctx.fillText('You completed all levels!', canvas.width / 2, canvas.height / 2 + 30)
    music.pause()
    completeMusic.play()
  } else {
    ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2 - 20)
  }

  ctx.font = 'bold 28px sans-serif'
  ctx.fillStyle = globalThis.menuSelection === 'restart' ? '#ffd700' : '#fff'

  ctx.fillText('1: Restart Level', canvas.width / 2, 300)
  clickableObjects.push({
    type: 'menu',
    value: 'restart',
    x: canvas.width / 2 - 150,
    y: 300 - 30,
    width: 300,
    height: 40
  })

  ctx.fillStyle = globalThis.menuSelection === 'menu' ? '#ffd700' : '#fff'
  ctx.fillText('2: Choose Character', canvas.width / 2, 360)
  clickableObjects.push({
    type: 'menu',
    value: 'menu',
    x: canvas.width / 2 - 150,
    y: 360 - 30,
    width: 300,
    height: 40
  })
  ctx.font = '24px sans-serif'
  ctx.fillStyle = '#aaa'
  ctx.fillText('Press 1 or 2, or use Arrow keys and Enter/Space', canvas.width / 2, canvas.height - 40)
  return clickableObjects
}
