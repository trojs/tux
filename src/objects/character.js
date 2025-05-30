import { tux } from './tux.js'

const characters = {
  tux: tux
}

export default (character) => characters[character]
