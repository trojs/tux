import { SnowObstacle } from '../objects/obstacle/snow.js'
import { Coin } from '../objects/coin.js'

const tileSize = 32
const levelWidth = 60 * tileSize
const levelHeight = 18 * tileSize

const obstacles = [
  new SnowObstacle(8, 15, 4, 1, tileSize),
  new SnowObstacle(15, 13, 3, 1, tileSize),
  new SnowObstacle(20, 11, 5, 1, tileSize),
  new SnowObstacle(30, 13, 4, 1, tileSize),
  new SnowObstacle(5, 17, 1, 1, tileSize),
  new SnowObstacle(14, 16, 1, 1, tileSize),
  new SnowObstacle(25, 17, 1, 1, tileSize),
  new SnowObstacle(30, 17, 1, 1, tileSize),
  new SnowObstacle(0, 18, 6, 1, tileSize),
  new SnowObstacle(10, 18, 10, 1, tileSize),
  new SnowObstacle(35, 18, 10, 1, tileSize),
  new SnowObstacle(50, 17, 25, 1, tileSize)
]

const coins = [
  new Coin(9, 14, tileSize),
  new Coin(16, 12, tileSize),
  new Coin(22, 10, tileSize),
  new Coin(31, 12, tileSize),
  new Coin(40, 17, tileSize)
]

const backgroundImg = new Image()
backgroundImg.src = '../sprites/tilesets/background5.png'

const music = new Audio('../music/voc-night.ogg')
music.loop = true

const backgroundColor = '#5c8cae'

export default {
  obstacles,
  coins,
  backgroundImg,
  levelWidth,
  levelHeight,
  music,
  backgroundColor,
  name: 'Ice Castle'
}
