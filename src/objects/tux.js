const tuxImg = typeof Image !== 'undefined'
  ? new Image()
  : {}
tuxImg.src = 'sprites/tux.png'
/** @type {import('./character.js').Character} */
export const tux = {
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
  img: tuxImg
}
