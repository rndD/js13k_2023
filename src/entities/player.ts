import { Entity } from '@/utils/elements'

import { Tile } from '../components'
import { Layers } from '@/utils/layers'
import { Tiles } from '@/utils/tiles'

export class Player extends Entity {
  constructor () {
    super()

    this.components.push(
      new Tile(10, 6, Layers.Objects, Tiles.I_PLAYER)
    )
  }
}
