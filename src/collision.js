import { tux } from './objects/tux.js'

/**
 * @param {import('./objects/obstacle/obstacle.js').Obstacle[]} obstacles
 * @returns {void}
 */
export function handleObstacleCollisions (obstacles) {
  let onAnyObstacle = false
  obstacles.forEach((ob) => {
    // Check collision from above (landing on obstacle)
    if (
      tux.x + tux.width > ob.x
      && tux.x < ob.x + ob.width
      && tux.y + tux.height > ob.y
      && tux.y + tux.height - tux.vy <= ob.y
    ) {
      tux.y = ob.y - tux.height
      tux.vy = 0
      onAnyObstacle = true
    }
    // Prevent walking through obstacle from the left
    if (
      tux.x + tux.width > ob.x
      && tux.x < ob.x
      && tux.y + tux.height > ob.y
      && tux.y < ob.y + ob.height
    ) {
      tux.x = ob.x - tux.width
    }
    // Prevent walking through obstacle from the right
    if (
      tux.x < ob.x + ob.width
      && tux.x + tux.width > ob.x + ob.width
      && tux.y + tux.height > ob.y
      && tux.y < ob.y + ob.height
    ) {
      tux.x = ob.x + ob.width
    }
  })
  if (onAnyObstacle) {
    tux.onGround = true
  }
}
