const konqiSprite = typeof Image !== 'undefined'
  ? new Image()
  : {}
konqiSprite.src = 'sprites/konqi.png'

const konqiImg = typeof Image !== 'undefined'
  ? new Image()
  : {}
konqiImg.src = 'sprites/konqi-pose.png'

/** @type {import('./character.js').Character} */
export const konqi = {
  name: 'Konqi',
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
  sprite: konqiSprite,
  img: konqiImg
}
