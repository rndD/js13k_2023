import { Component } from './elements'
import { Tile, Walk } from '../components'
import { Layers } from './layers'

import { gameMapWidth, gameMapHeight } from './tiles'
import { isInstance } from './helpers'

export function genObstacleKey (tile: Tile | Walk): number {
  return tile.x + tile.y * gameMapWidth
}

export function genObstacleMap (components: Component[]): number[] {
  const obstacleMap = new Array(gameMapWidth * gameMapHeight).fill(0)

  components.forEach(component => {
    if (
      isInstance(component, Tile) &&
      (component as Tile).layer === Layers.Objects
    ) {
      const key = genObstacleKey(component as Tile)
      obstacleMap[key] = 1
    }
  })

  return obstacleMap
}

export function getAngle (to: Tile | Walk, from: Tile | Walk): number {
  const deltaX = to.x - from.x // greater than zero, move right
  const deltaY = to.y - from.y // greater than zero, move down
  if (deltaX > 0) return 1
  if (deltaY > 0) return 2
  if (deltaX < 0) return 3
  return 0
}

// frame range [0, 1000], after 1000 it is reset to 0
// expected delta (output) range [0, 20]
export function getElapsedFrames (currentFrame: number, startFrame: number): number {
  const delta = currentFrame - startFrame
  if (delta < 0) return delta + 1000
  return delta
}
