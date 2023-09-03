import { Tile } from '../components'
import { System } from '@/utils/game-controller'

const fieldWidth = 18
const fieldHeight = 14

export class RenderSystem extends System {
  static requiredComponents = Tile

  _canvas: HTMLCanvasElement
  _context: CanvasRenderingContext2D
  _isReady: boolean
  _tileMap: HTMLImageElement
  _tileWidth: number
  // @ts-ignore
  components: Tile[]

  constructor (components: Tile[]) {
    super(components)

    this._canvas = document.querySelector('#c2d') as HTMLCanvasElement
    this._canvas.width = this._canvas.clientWidth
    this._canvas.height = this._canvas.clientHeight
    this._tileWidth = Math.round(this._canvas.width / fieldWidth)

    this._context = this._canvas.getContext('2d') as CanvasRenderingContext2D
    this._context.fillStyle = '#472d3c'
    this._context.fillRect(0, 0, this._canvas.width, this._canvas.height)
    this._context.imageSmoothingEnabled = false

    this._isReady = false
    this._tileMap = new Image()
    this._tileMap.src = 'tiles.png'
    this._tileMap.onload = () => {
      this._isReady = true
    }
  }

  update () {
    if (!this._isReady) return

    const ctx = this._context
    const originalTileWidth = 16
    const tileWidth = this._tileWidth
    const offsetError = 0

    this.components.forEach(tile => {
      const sourceX = originalTileWidth * (tile._tile % 8) + offsetError
      const sourceY = originalTileWidth * Math.floor(tile._tile / 8) + offsetError
      const offsetX = tileWidth * tile._x + offsetError
      const offsetY = tileWidth * tile._y + offsetError

      ctx.drawImage(
        this._tileMap,
        sourceX,
        sourceY,
        originalTileWidth,
        originalTileWidth,
        offsetX,
        offsetY,
        tileWidth,
        tileWidth
      )
    })
  }
}
