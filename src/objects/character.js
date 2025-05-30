import { tux } from './tux.js'

const characters = {
  tux
}
/**
 * @typedef {object} Character
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
 * @property {HTMLImageElement|object} img
 * @param {string} character
 * @returns {Character} - The Tux object.
 */
export default (character) => characters[character]
