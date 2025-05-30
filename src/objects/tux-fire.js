const tuxSprite = typeof Image !== 'undefined'
  ? new Image()
  : {}
tuxSprite.src = 'sprites/tuxfirehat.png'

const tuxImg = typeof Image !== 'undefined'
  ? new Image()
  : {}
tuxImg.src = 'sprites/tux-pose.png'

/** @type {import('./character.js').Character} */
export const tuxFire = {
  name: 'Tux Fire',
  x: 400,
  y: 300,
  width: 32,
  height: 32,
  speed: 5,
  vy: 0,
  gravity: 0.5,
  onGround: false,
  animFrame: 0,
  animTimer: 0,
  animRow: 1,
  walkRow: 1,
  facing: 1,
  gameOver: false,
  sprite: tuxSprite,
  img: tuxImg,
  price: 25
}
