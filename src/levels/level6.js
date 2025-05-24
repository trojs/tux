import { SnowObstacle } from '../objects/obstacle/snow.js'
import { Coin } from '../objects/coin.js'

const tileSize = 32
const levelWidth = 70 * tileSize
const levelHeight = 24 * tileSize

const obstacles = [
  new SnowObstacle(0, 12, 8, 1, tileSize),
  new SnowObstacle(10, 10, 4, 1, tileSize),
  new SnowObstacle(10, 14, 4, 1, tileSize),
  new SnowObstacle(18, 12, 4, 1, tileSize),
  new SnowObstacle(24, 10, 1, 1, tileSize),
  new SnowObstacle(25, 9, 1, 1, tileSize),
  new SnowObstacle(26, 8, 1, 1, tileSize),
  new SnowObstacle(27, 7, 1, 1, tileSize),
  new SnowObstacle(28, 6, 1, 1, tileSize),
  new SnowObstacle(29, 5, 1, 1, tileSize),
  new SnowObstacle(26, 16, 4, 1, tileSize),
  new SnowObstacle(36, 20, 4, 1, tileSize),
  new SnowObstacle(30, 5, 4, 1, tileSize),
  new SnowObstacle(42, 18, 4, 1, tileSize),
  new SnowObstacle(50, 16, 4, 1, tileSize),
  new SnowObstacle(58, 14, 4, 1, tileSize),
  new SnowObstacle(42, 10, 4, 1, tileSize),
  new SnowObstacle(50, 10, 4, 1, tileSize),
  new SnowObstacle(66, 14, 14, 1, tileSize)
]

const coins = [
  new Coin(7, 11, tileSize),
  new Coin(26, 7, tileSize),
  new Coin(37, 19, tileSize),
  new Coin(51, 15, tileSize),
  new Coin(44, 9, tileSize),
  new Coin(20, 11, tileSize),
  new Coin(68, 13, tileSize),
  new Coin(11, 9, tileSize)
]

const backgroundImg = new Image()
backgroundImg.src = '../sprites/tilesets/background5.png'

const music = new Audio('../music/voc-daytime.ogg')
music.loop = true

const backgroundColor = '#d8a5f5'

export default {
  obstacles,
  coins,
  backgroundImg,
  levelWidth,
  levelHeight,
  music,
  backgroundColor,
  name: 'Silvie'
}
