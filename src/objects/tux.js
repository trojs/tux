/**
 * @typedef {object} Tux
 * @property {number} x - The x-coordinate of Tux.
 * @property {number} y - The y-coordinate of Tux.
 * @property {number} width - The width of Tux.
 * @property {number} height - The height of Tux.
 * @property {number} speed - The speed of Tux.
 * @property {number} vy - The vertical velocity of Tux.
 * @property {number} gravity - The gravity affecting Tux.
 * @property {boolean} onGround - Whether Tux is on the ground.
 * @property {number} animFrame - The current animation frame of Tux.
 * @property {number} animTimer - The timer for the animation.
 * @property {number} animRow - The current animation row of Tux.
 * @property {number} facing - The direction Tux is facing (1 for right, -1 for left).
 * @property {boolean} gameOver - Whether the game is over.
 * @returns {Tux} - The Tux object.
 */
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
  facing: 1,
  gameOver: false
}
