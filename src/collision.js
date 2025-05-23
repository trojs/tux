/**
 * @typedef {import('./objects/tux.js').Tux} Tux
 * @param {Tux} tux
 * @param {import('./objects/obstacle/obstacle.js').ObstacleObject[]} obstacles
 * @returns {Tux}
 */
export function handleObstacleCollisions (tux, obstacles) {
  let onAnyObstacle = false
  const newTux = { ...tux }
  obstacles.forEach((ob) => {
    // Landing on obstacle
    if (
      newTux.x + newTux.width > ob.x
      && newTux.x < ob.x + ob.width
      && newTux.y + newTux.height > ob.y
      && newTux.y + newTux.height - newTux.vy <= ob.y
    ) {
      newTux.y = ob.y - newTux.height
      newTux.vy = 0
      onAnyObstacle = true
    }
    // Left collision
    if (
      newTux.x + newTux.width > ob.x
      && newTux.x < ob.x
      && newTux.y + newTux.height > ob.y
      && newTux.y < ob.y + ob.height
    ) {
      newTux.x = ob.x - newTux.width
    }
    // Right collision
    if (
      newTux.x < ob.x + ob.width
      && newTux.x + newTux.width > ob.x + ob.width
      && newTux.y + newTux.height > ob.y
      && newTux.y < ob.y + ob.height
    ) {
      newTux.x = ob.x + ob.width
    }
  })
  newTux.onGround = onAnyObstacle
  return newTux
}
