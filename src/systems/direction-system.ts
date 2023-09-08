import { Direction, Walk } from '@/components'
import { Player } from '@/entities/player'
import { System } from '@/utils/elements'

import { getAngle } from '@/utils/collision'
import { findInstance } from '@/utils/helpers'
import { nullthrows } from '@/utils/validate'

export class DirectionSystem extends System {
  entities?: Player[]

  constructor () {
    super()

    this._requiredEntities = [Player]
  }

  update () {
    this.entities!.forEach(entity => {
      const walk = findInstance(entity.components, Walk)
      if (walk == null) return

      const direction = findInstance(entity.components, Direction)
      nullthrows(direction).angle = getAngle(walk, walk.tile)
    })
  }
}
