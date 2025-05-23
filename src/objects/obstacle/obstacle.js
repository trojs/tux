/* eslint-disable no-param-reassign */
/**
 * @typedef {object} ObstacleObject
 * @property {number} x
 * @property {number} y
 * @property {number} width
 * @property {number} height
 * @property {number=} tileSize
 */
export class Obstacle {
  constructor (x, y, width, height, tileSize = 32) {
    this.x = x * tileSize
    this.y = y * tileSize
    this.width = width * tileSize
    this.height = height * tileSize
    this.color = 'brown'
    this.sprite = null
    this.tileX = 0
    this.tileY = 0
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
