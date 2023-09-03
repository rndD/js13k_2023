import type { TileData } from '@/utils/tiles'

import { Tile } from '../components'
import { System } from '@/utils/elements'
import { Layers } from '@/utils/layers'
import { bgColor, gameMapWidth, genTileData } from '@/utils/tiles'

import { nullthrows } from '@/utils/validate'

export class RenderSystem extends System {
  _canvas: HTMLCanvasElement
  _canvasContext: CanvasRenderingContext2D
  _tileData: TileData
  _tileWidth: number
  _isReady: boolean

  components?: Tile[]

  constructor () {
    super()
    this._requiredComponent = Tile

    this._canvas = nullthrows(document.querySelector('#canvas')) as HTMLCanvasElement
    // normalize viewport
    this._canvas.width = this._canvas.clientWidth
    this._canvas.height = this._canvas.clientHeight

    const tileWidth = this._tileWidth = Math.round(this._canvas.width / gameMapWidth)

    this._isReady = false
    this._tileData = genTileData('tiles.png', tileWidth, _ => {
      this._isReady = true
    })

    const ctx = this._canvasContext = nullthrows(this._canvas.getContext('2d'))
    ctx.imageSmoothingEnabled = false
  }

  update () {
    if (!this._isReady) return

    const ctx = this._canvasContext
    const tileData = this._tileData
    const tileWidth = this._tileWidth

    ctx.fillStyle = bgColor
    ctx.fillRect(0, 0, this._canvas.width, this._canvas.height)

    ;[Layers.Surface, Layers.Objects, Layers.Tops]
      .forEach(layer => this.components!.forEach(tile => {
        if (tile.layer !== layer) return

        const offsetX = tileWidth * tile.x
        const offsetY = tileWidth * tile.y

        const imageTile = nullthrows(
          tileData[nullthrows(tile.tileID, 'No tileID')],
          'No tile for ' + tile.tileID
        )

        ctx.drawImage(
          imageTile,
          offsetX, offsetY
        )
      }))
  }
}
