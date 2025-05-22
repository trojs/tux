import { Obstacle } from '../objects/obstacle/obstacle.js'
export const tileSprite = new Image()
tileSprite.src = '../sprites/tilesets/snowbg3.png'

const groundHeight = 32
const tileWidth = 32
const levelWidth = 60 * tileWidth

// Random platforms and steps
const platform1 = new Obstacle(8 * tileWidth, 550 - groundHeight - 2 * tileWidth, 4 * tileWidth, groundHeight, '#bca16a', tileSprite, 0, 0)
const platform2 = new Obstacle(15 * tileWidth, 500 - groundHeight - 3 * tileWidth, 3 * tileWidth, groundHeight, '#bca16a', tileSprite, 0, 0)
const platform3 = new Obstacle(20 * tileWidth, 450 - groundHeight - 4 * tileWidth, 5 * tileWidth, groundHeight, '#bca16a', tileSprite, 0, 0)
const platform4 = new Obstacle(30 * tileWidth, 480 - groundHeight - 2 * tileWidth, 4 * tileWidth, groundHeight, '#bca16a', tileSprite, 0, 0)

// Steps and gaps
const step1 = new Obstacle(5 * tileWidth, 600 - groundHeight - tileWidth, tileWidth, groundHeight, '#bca16a', tileSprite, 0, 0)
const step2 = new Obstacle(15 * tileWidth, 600 - groundHeight - 2 * tileWidth, tileWidth, groundHeight, '#bca16a', tileSprite, 0, 0)
const step3 = new Obstacle(25 * tileWidth, 600 - groundHeight - tileWidth, tileWidth, groundHeight, '#bca16a', tileSprite, 0, 0)
const step4 = new Obstacle(32 * tileWidth, 600 - groundHeight - tileWidth, tileWidth, groundHeight, '#bca16a', tileSprite, 0, 0)

// Ground with a few gaps
const leftGround = new Obstacle(0, 600 - groundHeight, 6 * tileWidth, groundHeight, '#7c5c3b', tileSprite, 0, 0)
const midGround = new Obstacle(10 * tileWidth, 600 - groundHeight, 10 * tileWidth, groundHeight, '#7c5c3b', tileSprite, 0, 0)
const rightGround = new Obstacle(35 * tileWidth, 600 - groundHeight, 10 * tileWidth, groundHeight, '#7c5c3b', tileSprite, 0, 0)
const rightGround2 = new Obstacle(50 * tileWidth, 550 - groundHeight, 10 * tileWidth, groundHeight, '#7c5c3b', tileSprite, 0, 0)

const obstacles = [
  leftGround,
  midGround,
  rightGround,
  rightGround2,
  step1,
  step2,
  step3,
  step4,
  platform1,
  platform2,
  platform3,
  platform4
]

const backgroundImg = new Image()
backgroundImg.src = '../sprites/tilesets/background5.png'

const music = new Audio('../music/voc-night.ogg')
music.loop = true

const backgroundColor = '#5c8cae'

export default { obstacles, backgroundImg, levelWidth, music, backgroundColor, name: 'Final' }
