import { SnowObstacle } from '../objects/obstacle/snow.js'
import { Coin } from '../objects/coin.js'

const tileSize = 32
const levelWidth = 50 * tileSize
const levelHeight = 18 * tileSize

const obstacles = [
  new SnowObstacle(0, 18, 7, 1, tileSize),
  new SnowObstacle(9, 18, 11, 1, tileSize),
  new SnowObstacle(25, 18, 11, 1, tileSize),
  new SnowObstacle(40, 18, 25, 1, tileSize),
  new SnowObstacle(2, 17, 1, 1, tileSize),
  new SnowObstacle(4, 15, 3, 1, tileSize),
  new SnowObstacle(10, 13, 2, 1, tileSize),
  new SnowObstacle(15, 16, 3, 1, tileSize)
]

// Coins placed on/above platforms
const coins = [
  new Coin(6, 12, tileSize),
  new Coin(11, 12, tileSize),
  new Coin(16, 15, tileSize),
  new Coin(28, 17, tileSize),
  new Coin(42, 17, tileSize)
]

const backgroundImg = new Image()
backgroundImg.src = '../sprites/tilesets/background5.png'

const music = new Audio('../music/voc-daytime.ogg')
music.loop = true

const backgroundColor = 'lightblue'

export default {
  obstacles,
  coins,
  backgroundImg,
  levelWidth,
  levelHeight,
  music,
  backgroundColor,
  name: 'Genesis'
}
