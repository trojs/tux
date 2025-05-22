import level1 from './level1.js'
import level2 from './level2.js'
import level3 from './level3.js'

const levels = [
  level1,
  level2,
  level3
]
const getLevel = (level) => levels[level]
export {
  levels,
  getLevel
}
