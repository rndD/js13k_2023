import { Entity } from '@/utils/elements'

import { Tile } from '../components'
import { Layers } from '@/utils/layers'
import { Tiles } from '@/utils/tiles'

import { iterate } from '@/utils/helpers'

export class Surface extends Entity {
  constructor () {
    super()

    iterate(18, x => {
      this.components.push(
        new Tile(x, 3, Layers.Surface, Tiles.S_WATER_SHORE),
        new Tile(x, 4, Layers.Surface, Tiles.S_WATER_DEPTH),
        new Tile(x, 5, Layers.Surface, Tiles.S_WATER_SHORE_I)
      )
    })

    iterate(12, x => {
      this.components.push(
        new Tile(x, 13, Layers.Surface, x % 2 === 0
          ? Tiles.S_ROAD_HORIZONTAL
          : Tiles.S_ROAD_HORIZONTAL_I)
      )
    })

    iterate(3, 6, y => {
      this.components.push(
        new Tile(12, y, Layers.Surface, Tiles.E_BRIDGE)
      )
    })

    this.components.push(
      new Tile(12, 2, Layers.Surface, Tiles.E_STORE_ENTRANCE_0),
      new Tile(12, 6, Layers.Surface, Tiles.E_STORE_ENTRANCE_0),

      // objects
      new Tile(0, 1, Layers.Objects, Tiles.E_STORE_TOWER_1),
      new Tile(0, 2, Layers.Objects, Tiles.E_STORE_TOWER_0),
      new Tile(1, 2, Layers.Objects, Tiles.E_STORE_WALL),
      new Tile(2, 2, Layers.Objects, Tiles.E_STORE_WALL),
      new Tile(3, 2, Layers.Objects, Tiles.E_STORE_WALL),
      new Tile(4, 1, Layers.Objects, Tiles.E_STORE_TOWER_1),
      new Tile(4, 2, Layers.Objects, Tiles.E_STORE_TOWER_0),
      new Tile(5, 2, Layers.Objects, Tiles.E_STORE_WALL),
      new Tile(6, 2, Layers.Objects, Tiles.E_STORE_WALL),
      new Tile(7, 2, Layers.Objects, Tiles.E_STORE_WALL),
      new Tile(8, 1, Layers.Objects, Tiles.E_STORE_TOWER_1),
      new Tile(8, 2, Layers.Objects, Tiles.E_STORE_TOWER_0),
      new Tile(9, 2, Layers.Objects, Tiles.E_STORE_WALL),
      new Tile(10, 2, Layers.Objects, Tiles.E_STORE_WALL),
      new Tile(11, 2, Layers.Objects, Tiles.E_STORE_WALL),
      // entrance
      new Tile(13, 2, Layers.Objects, Tiles.E_STORE_WALL),
      new Tile(14, 2, Layers.Objects, Tiles.E_STORE_WALL),
      new Tile(15, 2, Layers.Objects, Tiles.E_STORE_WALL),
      new Tile(16, 1, Layers.Objects, Tiles.E_STORE_TOWER_1),
      new Tile(16, 2, Layers.Objects, Tiles.E_STORE_TOWER_0),
      new Tile(17, 2, Layers.Objects, Tiles.E_STORE_WALL),
      // after bridge
      new Tile(11, 6, Layers.Objects, Tiles.E_STORE_WALL),
      new Tile(13, 6, Layers.Objects, Tiles.E_STORE_WALL),
      // trees
      new Tile(1, 1, Layers.Objects, Tiles.E_TREE_BIRCH),
      new Tile(2, 1, Layers.Objects, Tiles.E_TREE_FIR),
      new Tile(3, 1, Layers.Objects, Tiles.E_TREE_FIR),
      new Tile(8, 0, Layers.Objects, Tiles.E_TREE_FIR),
      new Tile(9, 0, Layers.Objects, Tiles.E_TREE_BIRCH),
      new Tile(11, 1, Layers.Objects, Tiles.E_TREE_FIR),
      new Tile(13, 1, Layers.Objects, Tiles.E_TREE_BIRCH),
      new Tile(15, 1, Layers.Objects, Tiles.E_TREE_BIRCH),
      new Tile(15, 6, Layers.Objects, Tiles.E_TREE_BIRCH),
      new Tile(17, 1, Layers.Objects, Tiles.E_TREE_FIR),
      // wooden walls
      new Tile(2, 0, Layers.Objects, Tiles.E_WOODEN_WALL),
      new Tile(3, 0, Layers.Objects, Tiles.E_WOODEN_WALL),
      new Tile(15, 0, Layers.Objects, Tiles.E_WOODEN_WALL),
      new Tile(16, 0, Layers.Objects, Tiles.E_WOODEN_WALL),
      new Tile(17, 0, Layers.Objects, Tiles.E_WOODEN_WALL)
    )

    iterate(0, 10, x => {
      this.components.push(
        new Tile(x, 6, Layers.Objects, Tiles.E_WOODEN_WALL),
        new Tile(x, 12, Layers.Objects, Tiles.E_WOODEN_WALL)
      )
    })

    iterate(7, 12, y => {
      this.components.push(
        new Tile(0, y, Layers.Objects, Tiles.E_WOODEN_WALL)
      )
    })

    this.components.push(
      new Tile(9, 7, Layers.Objects, Tiles.E_WOODEN_WALL),
      new Tile(9, 10, Layers.Objects, Tiles.E_WOODEN_WALL),
      new Tile(9, 11, Layers.Objects, Tiles.E_WOODEN_WALL),
      new Tile(11, 8, Layers.Objects, Tiles.E_TABLE_1),
      new Tile(11, 9, Layers.Objects, Tiles.E_TABLE_0),

      // tops
      new Tile(12, 0, Layers.Tops, Tiles.E_STORE_ENTRANCE_2),
      new Tile(12, 1, Layers.Tops, Tiles.E_STORE_ENTRANCE_1),
      new Tile(12, 5, Layers.Tops, Tiles.E_STORE_ENTRANCE_2)
    )
  }
}
