import type { Layers } from './utils/layers'

import { Component } from './utils/elements'

export class Tile extends Component {
  x: number
  y: number
  layer: Layers
  tileID: number

  constructor (
    x: number,
    y: number,
    layer: Layers,
    tileID: number
  ) {
    super()

    this.x = x
    this.y = y
    this.layer = layer
    this.tileID = tileID
  }
}

export class Carry extends Component {
  tile: Tile

  constructor (tile: Tile) {
    super()

    this.tile = tile
  }
}

export class Direction extends Component {
  angle: number

  constructor (angle: number) {
    super()

    this.angle = angle
  }
}

export class Walk extends Component {
  x: number
  y: number
  tile: Tile

  constructor (x: number, y: number, tile: Tile) {
    super()

    this.x = x
    this.y = y
    this.tile = tile
  }
}
