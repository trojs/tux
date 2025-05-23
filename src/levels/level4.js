import { SnowObstacle } from '../objects/obstacle/snow.js'
import { Coin } from '../objects/coin.js'

const tileSize = 32
const levelWidth = 155 * tileSize
const levelHeight = 20 * tileSize

const obstacles = [
  new SnowObstacle(1, 11, 7, 1),
  new SnowObstacle(10, 15, 7, 1),
  new SnowObstacle(19, 15, 2, 1),
  new SnowObstacle(21, 14, 1, 1),
  new SnowObstacle(22, 13, 1, 1),
  new SnowObstacle(23, 12, 1, 1),
  new SnowObstacle(24, 11, 1, 1),
  new SnowObstacle(25, 10, 1, 1),
  new SnowObstacle(26, 9, 8, 1),
  new SnowObstacle(42, 20, 8, 1),
  new SnowObstacle(55, 20, 8, 1),
  new SnowObstacle(67, 18, 4, 1),
  new SnowObstacle(73, 16, 4, 1),
  new SnowObstacle(78, 14, 4, 1),
  new SnowObstacle(83, 12, 4, 1),
  new SnowObstacle(88, 10, 4, 1),
  new SnowObstacle(93, 8, 4, 1),
  new SnowObstacle(98, 6, 4, 1),
  new SnowObstacle(111, 18, 4, 1),
  new SnowObstacle(120, 20, 5, 1),
  new SnowObstacle(125, 19, 1, 1),
  new SnowObstacle(126, 18, 1, 1),
  new SnowObstacle(127, 17, 1, 1),
  new SnowObstacle(128, 16, 1, 1),
  new SnowObstacle(129, 15, 1, 1),
  new SnowObstacle(130, 14, 1, 1),
  new SnowObstacle(131, 13, 1, 1),
  new SnowObstacle(132, 12, 1, 1),
  new SnowObstacle(133, 11, 1, 1),
  new SnowObstacle(134, 10, 1, 1),
  new SnowObstacle(135, 9, 1, 1),
  new SnowObstacle(136, 9, 1, 1),
  new SnowObstacle(139, 9, 4, 1),
  new SnowObstacle(146, 9, 30, 1)
]

const coins = [
  new Coin(5, 10, tileSize),
  new Coin(27, 8, tileSize),
  new Coin(44, 19, tileSize),
  new Coin(70, 15, tileSize),
  new Coin(100, 5, tileSize),
  new Coin(130, 13, tileSize),
  new Coin(150, 8, tileSize)
]

const backgroundImg = new Image()
backgroundImg.src = '../sprites/tilesets/background5.png'

const music = new Audio('../music/battle_theme.ogg')
music.loop = true

const backgroundColor = '#C387EC'

export default {
  obstacles,
  coins,
  backgroundImg,
  levelWidth,
  levelHeight,
  music,
  backgroundColor,
  name: 'Lila'
}
