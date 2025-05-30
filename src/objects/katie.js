const katieSprite = typeof Image !== 'undefined'
  ? new Image()
  : {}
katieSprite.src = 'sprites/katie.png'

const katieImg = typeof Image !== 'undefined'
  ? new Image()
  : {}
katieImg.src = 'sprites/katie-pose.png'

/** @type {import('./character.js').Character} */
export const katie = {
  name: 'Katie',
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
  animRow: 4,
  walkRow: 4,
  facing: 1,
  gameOver: false,
  sprite: katieSprite,
  img: katieImg,
  price: 75
}
