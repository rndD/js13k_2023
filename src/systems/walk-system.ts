import { Walk } from '../components'
import { System } from '@/utils/elements'

// animate character movement
// detect collisions
export class WalkSystem extends System {
  _walkSpeed: number // tiles per frame
  _walkTreshold: number
  components?: Walk[]

  constructor () {
    super()
    this._requiredComponent = Walk
    this._walkSpeed = 0.05
    this._walkTreshold = 1.5 * this._walkSpeed
  }

  update (elapsedFrames: number) {
    this.components!.forEach(walk => {
      const isHorizontal = walk.x !== walk.tile.x
      const multiplier = isHorizontal
        ? (walk.x > walk.tile.x ? 1 : -1)
        : (walk.y > walk.tile.y ? 1 : -1)
      const walkDelta =
        this._walkSpeed * elapsedFrames * multiplier

      if (isHorizontal) {
        let nextX = walk.tile.x + walkDelta
        if (this._walkTreshold > Math.abs(walk.x - nextX)) nextX = walk.x
        walk.tile.x = nextX
      } else {
        let nextY = walk.tile.y + walkDelta
        if (this._walkTreshold > Math.abs(walk.y - nextY)) nextY = walk.y
        walk.tile.y = nextY
      }
    })
  }
}
