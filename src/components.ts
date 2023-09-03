import type { Layers } from './utils/layers'
import type { Tiles } from './utils/tiles'

import { Component } from './utils/game-controller'

export class Tile extends Component {
  _x: number
  _y: number
  _layer: Layers
  _tile: Tiles
  _angle: number

  constructor (
    x: number,
    y: number,
    layer: Layers,
    tile: Tiles,
    angle: number = 0
  ) {
    super()

    this._x = x
    this._y = y
    this._layer = layer
    this._tile = tile
    this._angle = angle
  }
}
