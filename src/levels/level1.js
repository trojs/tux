import { Obstacle } from '../objects/obstacle/obstacle.js'
export const tileSprite = new Image()
tileSprite.src = '../sprites/tilesets/snowbg3.png'

const groundHeight = 32
const tileWidth = 32
const levelWidth = 50 * tileWidth

// Some floating platforms
const platform1 = new Obstacle(4 * tileWidth, 600 - groundHeight - 3 * tileWidth, 3 * tileWidth, groundHeight, '#bca16a', tileSprite, 0, 0)
const platform2 = new Obstacle(10 * tileWidth, 600 - groundHeight - 5 * tileWidth, 2 * tileWidth, groundHeight, '#bca16a', tileSprite, 0, 0)
const platform3 = new Obstacle(15 * tileWidth, 600 - groundHeight - 2 * tileWidth, 3 * tileWidth, groundHeight, '#bca16a', tileSprite, 0, 0)

// A small "step" near the start
const step1 = new Obstacle(2 * tileWidth, 600 - groundHeight - tileWidth, tileWidth, groundHeight, '#bca16a', tileSprite, 0, 0)

// A gap in the ground (classic jump)
const leftGround = new Obstacle(0, 600 - groundHeight, 7 * tileWidth, groundHeight, '#7c5c3b', tileSprite, 0, 0)
const rightGround = new Obstacle(9 * tileWidth, 600 - groundHeight, 11 * tileWidth, groundHeight, '#7c5c3b', tileSprite, 0, 0)
const right2Ground = new Obstacle(25 * tileWidth, 600 - groundHeight, 11 * tileWidth, groundHeight, '#7c5c3b', tileSprite, 0, 0)
const right3Ground = new Obstacle(40 * tileWidth, 600 - groundHeight, 10 * tileWidth, groundHeight, '#7c5c3b', tileSprite, 0, 0)

const obstacles = [
  leftGround,
  rightGround,
  right2Ground,
  right3Ground,
  step1,
  platform1,
  platform2,
  platform3
]

const backgroundImg = new Image()
backgroundImg.src = '../sprites/tilesets/background5.png'

const music = new Audio('../music/voc-daytime.ogg')
music.loop = true

const backgroundColor = 'lightblue'

export default { obstacles, backgroundImg, levelWidth, music, backgroundColor, name: 'Genesis' }
