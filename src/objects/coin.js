/* eslint-disable no-param-reassign */
export class Coin {
  constructor (x, y, tileSize = 32, size = 16) {
    this.x = x * tileSize
    this.y = y * tileSize
    this.size = size
    this.collected = false
    this.sprite = null
    this.sprite = new Image()
    this.sprite.src = '../sprites/coin.png'
  }

  /**
   * Draw the coin (as a gold circle or sprite)
   * @param {CanvasRenderingContext2D} ctx
   * @param {number} cameraX
   * @param {number} cameraY
   */
  draw (ctx, cameraX = 0, cameraY = 0) {
    if (this.collected) return
    if (this.sprite) {
      ctx.drawImage(
        this.sprite,
        this.x - cameraX,
        this.y - cameraY,
        this.size,
        this.size
      )
    } else {
      ctx.save()
      ctx.beginPath()
      ctx.arc(
        this.x - cameraX + this.size / 2,
        this.y - cameraY + this.size / 2,
        this.size / 2,
        0,
        2 * Math.PI
      )
      ctx.fillStyle = 'gold'
      ctx.shadowColor = '#fff'
      ctx.shadowBlur = 8
      ctx.fill()
      ctx.lineWidth = 2
      ctx.strokeStyle = '#fff'
      ctx.stroke()
      ctx.restore()
    }
  }

  /**
   * Check collision with Tux
   * @param {import('./character.js').Character} tux
   * @returns {boolean}
   */
  collidesWith (tux) {
    return (
      !this.collected
      && tux.x < this.x + this.size
      && tux.x + tux.width > this.x
      && tux.y < this.y + this.size
      && tux.y + tux.height > this.y
    )
  }
}
