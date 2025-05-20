/* eslint-disable no-param-reassign */
export class Obstacle {
  constructor (x, y, width, height, color = 'brown', sprite = null, tileX = 0, tileY = 0, tileSize = 32) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.color = color
    this.sprite = sprite
    this.tileX = tileX // tile column in the sprite sheet
    this.tileY = tileY // tile row in the sprite sheet
    this.tileSize = tileSize
  }

  /**
   * @param {CanvasRenderingContext2D} ctx
   * @param {number} cameraX
   * @returns {void}
   */
  draw (ctx, cameraX = 0) {
    if (this.sprite) {
      // Draw the sprite tile for the entire obstacle area
      for (let i = 0; i < this.width; i += this.tileSize) {
        for (let j = 0; j < this.height; j += this.tileSize) {
          ctx.drawImage(
            this.sprite,
            this.tileX * this.tileSize, this.tileY * this.tileSize, // source x, y
            this.tileSize, this.tileSize, // source w, h
            this.x - cameraX + i, this.y + j, // dest x, y
            this.tileSize, this.tileSize // dest w, h
          )
        }
      }
    } else {
      ctx.fillStyle = this.color
      ctx.fillRect(this.x - cameraX, this.y, this.width, this.height)
    }
  }
}
