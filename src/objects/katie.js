const tuxImg = typeof Image !== 'undefined'
  ? new Image()
  : {}
tuxImg.src = 'sprites/katie.png'
/** @type {import('./character.js').Character} */
export const katie = {
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
  img: tuxImg
}
