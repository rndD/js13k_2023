import type { Layers } from './utils/layers'

import { Component } from './utils/elements'

export class Tile extends Component {
  _x: number
  _y: number
  _layer: Layers
  _tile: number

  constructor (
    x: number,
    y: number,
    layer: Layers,
    tile: number
  ) {
    super()

    this._x = x
    this._y = y
    this._layer = layer
    this._tile = tile
  }
}
