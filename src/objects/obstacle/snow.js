import { Obstacle } from './obstacle.js'

const tileSprite = new Image()
tileSprite.src = '../sprites/tilesets/snowbg3.png'

export class SnowObstacle extends Obstacle {
  constructor (x, y, width, height, tileSize = 32) {
    super(x, y, width, height, tileSize)
    this.color = '#7c5c3b'
    this.sprite = tileSprite
  }
}
