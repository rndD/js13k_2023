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

export class Direction extends Component {
  angle: number

  constructor (angle: number) {
    super()

    this.angle = angle
  }
}

export class Grab extends Component {
  isValidated: boolean
  startFrame: number

  constructor () {
    super()

    this.isValidated = false
    this.startFrame = 0
  }
}

export class Haul extends Component {
  origin: Tile
  target: Tile
  direction: Direction
  drop: boolean

  constructor (
    origin: Tile,
    target: Tile,
    direction: Direction
  ) {
    super()

    this.origin = origin
    this.target = target
    this.direction = direction
    this.drop = false
  }
}

export class Walk extends Component {
  x: number
  y: number
  tile: Tile

  isBlocked: boolean
  isValidated: boolean
  startFrame: number

  constructor (x: number, y: number, tile: Tile) {
    super()

    this.x = x
    this.y = y
    this.tile = tile

    this.isBlocked = false
    this.isValidated = false
    this.startFrame = 0
  }
}
