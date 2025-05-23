import { SnowObstacle } from '../objects/obstacle/snow.js'

const tileSize = 32
const levelWidth = 50 * tileSize
const levelHeight = 18 * tileSize

const obstacles = [
  new SnowObstacle(4, 15, 3, 1, tileSize),
  new SnowObstacle(10, 13, 2, 1, tileSize),
  new SnowObstacle(15, 16, 3, 1, tileSize),

  new SnowObstacle(2, 17, 1, 1, tileSize),

  new SnowObstacle(0, 18, 3, 1, tileSize),
  new SnowObstacle(23, 15, 11, 1, tileSize),
  new SnowObstacle(40, 18, 10, 1, tileSize)
]

const backgroundImg = new Image()
backgroundImg.src = '../sprites/tilesets/background5.png'

const music = new Audio('../music/voc-night.ogg')
music.loop = true

const backgroundColor = '#7c5c3b'

export default {
  obstacles,
  backgroundImg,
  levelWidth,
  levelHeight,
  music,
  backgroundColor,
  name: 'Go go'
}
