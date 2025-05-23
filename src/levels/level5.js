import { SnowObstacle } from '../objects/obstacle/snow.js'
import { Coin } from '../objects/coin.js'

const tileSize = 32
const levelWidth = 70 * tileSize
const levelHeight = 24 * tileSize

const obstacles = [
  // Start platform
  new SnowObstacle(0, 20, 8, 1, tileSize),

  // Zig-zag descent
  new SnowObstacle(10, 18, 6, 1, tileSize),
  new SnowObstacle(18, 16, 6, 1, tileSize),
  new SnowObstacle(26, 14, 6, 1, tileSize),
  new SnowObstacle(34, 12, 6, 1, tileSize),
  new SnowObstacle(42, 10, 6, 1, tileSize),

  // Central platforms
  new SnowObstacle(20, 21, 4, 1, tileSize),
  new SnowObstacle(28, 19, 4, 1, tileSize),
  new SnowObstacle(36, 17, 4, 1, tileSize),
  new SnowObstacle(44, 15, 4, 1, tileSize),

  // Steps up and down
  new SnowObstacle(52, 13, 2, 1, tileSize),
  new SnowObstacle(54, 14, 2, 1, tileSize),
  new SnowObstacle(56, 15, 2, 1, tileSize),
  new SnowObstacle(58, 16, 2, 1, tileSize),

  // Final platforms and finish area
  new SnowObstacle(62, 18, 4, 1, tileSize),
  new SnowObstacle(66, 20, 4, 1, tileSize),

  // Ground/floor
  new SnowObstacle(0, 23, 15, 1, tileSize),
  new SnowObstacle(20, 23, 10, 1, tileSize),
  new SnowObstacle(35, 23, 10, 1, tileSize),
  new SnowObstacle(50, 23, 20, 1, tileSize),

  // Some small floating platforms for bonus/jumps
  new SnowObstacle(15, 8, 2, 1, tileSize),
  new SnowObstacle(30, 6, 2, 1, tileSize),
  new SnowObstacle(50, 5, 2, 1, tileSize)
]

const coins = [
  new Coin(7, 19, tileSize),
  new Coin(12, 17, tileSize),
  new Coin(22, 15, tileSize),
  new Coin(32, 13, tileSize),
  new Coin(42, 9, tileSize),
  new Coin(54, 12, tileSize),
  new Coin(66, 17, tileSize)
]

const backgroundImg = new Image()
backgroundImg.src = '../sprites/tilesets/background5.png'

const music = new Audio('../music/voc-daytime.ogg')
music.loop = true

const backgroundColor = '#b3e0ff'

export default {
  obstacles,
  coins,
  backgroundImg,
  levelWidth,
  levelHeight,
  music,
  backgroundColor,
  name: 'Zig-Zag Summit'
}
