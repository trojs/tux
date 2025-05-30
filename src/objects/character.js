import { tux } from './tux.js'
import { tuxFire } from './tux-fire.js'
import { konqi } from './konqi.js'
import { katie } from './katie.js'

const characters = {
  tux,
  tuxFire,
  konqi,
  katie
}
/**
 * @typedef {object} Character
 * @property {string} name - The name of the character.
 * @property {number} x - The x-coordinate of the character.
 * @property {number} y - The y-coordinate of the character.
 * @property {number} width - The width of the character.
 * @property {number} height - The height of the character.
 * @property {number} speed - The speed of the character.
 * @property {number} vy - The vertical velocity of the character.
 * @property {number} gravity - The gravity affecting the character.
 * @property {boolean} onGround - Whether the character is on the ground.
 * @property {number} animFrame - The current animation frame of the character.
 * @property {number} animTimer - The timer for the animation.
 * @property {number} animRow - The current animation row of the character.
 * @property {number} walkRow - The current animation row of the character.
 * @property {number} facing - The direction the character is facing (1 for right, -1 for left).
 * @property {boolean} gameOver - Whether the game is over.
 * @property {HTMLImageElement|object} sprite - The sprite image of the character.
 * @property {HTMLImageElement|object} img
 * @param {string} character
 * @returns {Character} - The character object.
 */
const getCharacter = (character) => characters[character]

export {
  getCharacter,
  characters
}
