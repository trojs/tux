import level1 from './level1.js'
import level2 from './level2.js'
import level3 from './level3.js'
import level4 from './level4.js'
import level5 from './level5.js'
import level6 from './level6.js'

const levels = [
  level1,
  level2,
  level3,
  level4,
  level5,
  level6
]
const getLevel = (level) => levels[level] ? levels[level] : undefined
export {
  levels,
  getLevel
}
