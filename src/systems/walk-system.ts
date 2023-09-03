import { Walk } from '../components'
import { System } from '@/utils/elements'

// animate character movement
// detect collisions
export class WalkSystem extends System {
  components?: Walk[]
  walkSpeed: number // tiles per frame

  constructor () {
    super()
    this._requiredComponent = Walk
    this.walkSpeed = 0.05
  }

  update (elapsedFrames: number) {
    this.components!.forEach(walk => {
      const isHorizontal = walk.tile.x !== walk.x
      if (isHorizontal) {
        if (walk.tile.x < walk.x) {
          walk.tile.x += this.walkSpeed * elapsedFrames
        } else {
          walk.tile.x -= this.walkSpeed * elapsedFrames
        }
      } else {
        if (walk.tile.y < walk.y) {
          walk.tile.y += this.walkSpeed * elapsedFrames
        } else {
          walk.tile.y -= this.walkSpeed * elapsedFrames
        }
      }
    })
  }
}
