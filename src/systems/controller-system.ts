import { Player } from '@/entities/player'
import { System } from '@/utils/elements'
import { Tile, Walk } from '../components'
import Controls from '@/state/controls'

import { isInstance } from '@/utils/helpers'
import { nullthrows } from '@/utils/validate'

// animate character movement
// detect collisions
export class ControllerSystem extends System {
  entities?: Player[]

  constructor () {
    super()

    this._requiredEntities = [Player]
  }

  update () {
    const player = nullthrows(this.entities)[0]
    const walk = player.components.find(component =>
      isInstance(component, Walk)) as Walk | null

    const isMoving =
      Controls.isDown ||
      Controls.isLeft ||
      Controls.isRight ||
      Controls.isUp
    const isWalking =
      walk != null
    const isFirstStep =
      isMoving && !isWalking

    if (isFirstStep) {
      const tile = nullthrows(
        player.components.find(component =>
          isInstance(component, Tile))
      ) as Tile

      const x = tile.x + (Controls.isLeft ? -1 : Controls.isRight ? 1 : 0)
      const y = tile.y + (Controls.isUp ? -1 : Controls.isDown ? 1 : 0)

      // create Walk component with the destination
      player.components.push(
        new Walk(x, y, tile)
      )
    }
  }
}
