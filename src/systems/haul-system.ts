import { Direction, Drop, Grab, Haul, Tile } from '../components'
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

      const direction = char.components[1] as Direction
      invariant(isInstance(direction, Direction))
      const tile = char.components[0] as Tile
      invariant(isInstance(tile, Tile))
      const targetX = tile.x + offsetX[direction.angle]
      const targetY = tile.y + offsetY[direction.angle]

      const grab = findInstance(char.components, Grab)
      if (grab != null && !grab.isValidated) {
        // validate grab attempts
        grab.isValidated = true
        grab.startFrame = totalFrames

        const sack = sacks.find(sack => {
          const sackTile = sack.components[0] as Tile
          invariant(isInstance(sackTile, Tile))
          const dx = sackTile.x - targetX
          const dy = sackTile.y - targetY
          return dx * dx + dy * dy < 0.3
        })

        if (sack == null) {
          // remove grab component if no sack was found
          removeInstance(char.components, grab)
        } else {
          char.components.push(
            new Haul(tile, sack.components[0] as Tile, direction)
          )
        }
      }

      const drop = findInstance(char.components, Drop)
      const haul = findInstance(char.components, Haul)
      if (drop != null && haul != null) {
        // drop sack
        const dx = Math.round(targetX) - targetX
        const dy = Math.round(targetY) - targetY
        if (
          dx * dx + dy * dy < 0.1 &&
          totalFrames - grab?.startFrame > 20
        ) {
          haul.target.x = Math.round(targetX)
          haul.target.y = Math.round(targetY)
          console.log(haul.target)
          removeInstance(char.components, grab)
          removeInstance(char.components, haul)
        }
        removeInstance(char.components, drop)
      }
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
