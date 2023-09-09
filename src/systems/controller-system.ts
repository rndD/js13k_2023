import { Player } from '@/entities/player'
import { System } from '@/utils/elements'
import { Drop, Grab, Haul, Tile, Walk } from '../components'
import Controls from '@/state/controls'

import { findInstance } from '@/utils/helpers'
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
    const tile = player.components[0] as Tile

    const isMoving =
      Controls.isDown ||
      Controls.isLeft ||
      Controls.isRight ||
      Controls.isUp
    const walk = findInstance(player.components, Walk)

    if (isMoving && walk == null) {
      const x = tile.x + (Controls.isLeft ? -1 : Controls.isRight ? 1 : 0)
      const y = tile.y + (Controls.isUp ? -1 : Controls.isDown ? 1 : 0)

      // create Walk component with the destination
      player.components.push(
        new Walk(x, y, tile)
      )
    }

    const grab = findInstance(player.components, Grab)
    const haul = findInstance(player.components, Haul)

    if (Controls.isAction) {
      if (grab == null) {
        player.components.push(
          new Grab()
        )
      }

      if (haul != null) {
        player.components.push(
          new Drop()
        )
      }
    }
  }
}
