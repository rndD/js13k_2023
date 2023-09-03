import { Player } from '@/entities/player'
import { System } from '@/utils/elements'
import { Tile, Walk } from '../components'
import Controls from '@/state/controls'

import { isInstance } from '@/utils/helpers'
import { nullthrows } from '@/utils/validate'

// animate character movement
// detect collisions
export class ControllerSystem extends System {
  entity?: Player

  constructor () {
    super()
    this._requiredEntity = Player
  }

  update () {
    const player = nullthrows(this.entity)
    const walkIndex = player.components.findIndex(component =>
      isInstance(component, Walk))

    const isMoving =
      Controls.isDown ||
      Controls.isLeft ||
      Controls.isRight ||
      Controls.isUp

    if (!isMoving) {
      if (walkIndex > -1) player.components.splice(walkIndex, 1)
      return
    }

    if (walkIndex === -1) {
      const tile = nullthrows(player.components.find(component =>
        isInstance(component, Tile))) as Tile

      const x = tile.x + (Controls.isLeft ? -1 : Controls.isRight ? 1 : 0)
      const y = tile.y + (Controls.isUp ? -1 : Controls.isDown ? 1 : 0)

      player.components.push(
        new Walk(x, y, tile)
      )
    }
  }
}
