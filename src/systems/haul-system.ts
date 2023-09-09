import { Direction, Grab, Haul, Tile } from '../components'
import { Player } from '@/entities/player'
import { Sack } from '@/entities/sack'
import { System } from '@/utils/elements'

import {
  isInstance,
  isInstanceOfAny,
  findInstance,
  removeInstance
} from '@/utils/helpers'
import { offsetX, offsetY } from '@/utils/collision'
import { invariant } from '@/utils/validate'
import { Layers } from '@/utils/layers'

export class HaulSystem extends System {
  components?: Haul[]
  entities?: Array<Player | Sack>

  constructor () {
    super()

    this._requiredComponents = [Haul]
    this._requiredEntities = [Player, Sack]
  }

  update (elapsedFrames: number, totalFrames: number) {
    const sacks = this.entities!.filter(sack =>
      // todo filter sacks that are carried currently
      isInstance(sack, Sack))

    this.entities!.forEach(char => {
      if (!isInstanceOfAny(char, [Player])) return

      const grab = findInstance(char.components, Grab)
      if (grab == null || grab.isValidated) return

      // validate grab attempts
      grab.isValidated = true

      const direction = char.components[1] as Direction
      invariant(isInstance(direction, Direction))
      const tile = char.components[0] as Tile
      invariant(isInstance(tile, Tile))

      const sack = sacks.find(sack => {
        const sackTile = sack.components[0] as Tile
        invariant(isInstance(sackTile, Tile))
        const dx = sackTile.x - (tile.x + offsetX[direction.angle])
        const dy = sackTile.y - (tile.y + offsetY[direction.angle])
        return dx * dx + dy * dy < 0.3
      })

      if (sack == null) {
        // remove grab component if no sack was found
        removeInstance(char.components, grab)
        return
      }

      char.components.push(
        new Haul(tile, sack.components[0] as Tile, direction)
      )
    })

    this.components!.forEach(haul => {
      // update sack position (if hauled)
      const angle = haul.direction.angle
      const lift = -0.1
      const offset = 0.4
      const x = haul.origin.x + offsetX[angle] * offset
      const y = haul.origin.y + lift + offsetY[angle] * offset

      haul.target.x = x
      haul.target.y = y
      haul.target.layer = angle === 0
        ? Layers.ObjectsBelow
        : Layers.ObjectsAbove
    })
  }
}
