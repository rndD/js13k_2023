import { Direction, Grab, Haul, Tile } from '../components'
import { Player } from '@/entities/player'
import { Sack } from '@/entities/sack'
import { System } from '@/utils/elements'

import { Layers } from '@/utils/layers'

import {
  isInstance,
  isInstanceOfAny,
  findInstance,
  removeInstance
} from '@/utils/helpers'
import {
  offsetX,
  offsetY,
  genObstacleMap
} from '@/utils/collision'
import { gameMapWidth } from '@/utils/tiles'
import { nullthrows } from '@/utils/validate'

export class HaulSystem extends System {
  components?: Haul[]
  entities?: Array<Player | Sack>

  constructor () {
    super()

    this._requiredComponents = [Haul]
    this._requiredEntities = [Player, Sack]
  }

  update (elapsedFrames: number, totalFrames: number) {
    // составляем карту мешков
    // валидируем grab компоненты
    // матчим тайл игрока, тайл мешка, направление, добавляем haul игроку

    // синкаем тайлы

    const sackTiles = this.entities!
      .filter(entity => isInstance(entity, Sack))
      .map(sack => findInstance(sack.components, Tile)) as Tile[]
    const sackMap = genObstacleMap(sackTiles)

    this.entities!
      .filter(entity => isInstanceOfAny(entity, [Player]))
      .forEach(char => {
        const grab = findInstance(char.components, Grab)
        if (grab == null || grab.isValidated) return

        grab.isValidated = true
        grab.startFrame = totalFrames

        const direction = nullthrows(findInstance(char.components, Direction))
        const tile = nullthrows(findInstance(char.components, Tile))
        const x = tile.x + offsetX[direction.angle]
        const y = tile.y + offsetY[direction.angle]
        const key = x + y * gameMapWidth

        if (sackMap[key] === 0) {
          // no sack at the desired position
          removeInstance(char.components, grab)
          return
        }

        const sackTile = nullthrows(sackTiles.find(tile =>
          tile.x === x && tile.y === y))

        char.components.push(
          new Haul(tile, sackTile, direction)
        )
      })

    this.components!.forEach(haul => {
      // sync coordinates
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
