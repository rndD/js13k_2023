import type { TileData } from '@/utils/tiles'

import { Tile } from '../components'
import { System } from '@/utils/elements'
import { gameMapWidth, genTileData } from '@/utils/tiles'

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
    ctx.fillStyle = '#472d3c'
    ctx.fillRect(0, 0, this._canvas.width, this._canvas.height)
  }

  update () {
    if (!this._isReady) return

    const ctx = this._canvasContext
    const tileData = this._tileData
    const tileWidth = this._tileWidth

    this.components!.forEach(tile => {
      const offsetX = tileWidth * tile._x
      const offsetY = tileWidth * tile._y

      const imageTile = nullthrows(
        tileData[tile._tile],
        'No tile for ' + tile._tile
      )

      ctx.drawImage(
        imageTile,
        offsetX, offsetY
      )
    })
  }
}
