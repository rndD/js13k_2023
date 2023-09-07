import { Direction, Walk } from '@/components'
import { Player } from '@/entities/player'
import { System } from '@/utils/elements'

import { getAngle } from '@/utils/collision'
import { isInstance } from '@/utils/helpers'
import { nullthrows } from '@/utils/validate'

export class DirectionSystem extends System {
  entities?: Player[]

  constructor () {
    super()

    this._requiredEntities = [Player]
  }

  update () {
    this.entities!.forEach(entity => {
      const walk = entity.components.find(component =>
        isInstance(component, Walk)) as Walk | null
      if (walk == null || walk.isValidated) return

      const direction = entity.components.find(component =>
        isInstance(component, Direction)) as Direction | null
      nullthrows(direction).angle = getAngle(walk, walk.tile)
    })
  }
}
