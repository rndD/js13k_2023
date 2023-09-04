import { getGridPointInPixels } from '@/lib/utils'
import { getColPos } from './ecs/systems/collide'
import { GRASS } from '@/tiles'
import { getTile } from '@/lib/graphics'

export const pixelScale = 2
export const tileSize = 16

const tileMapW = 8
// find x,y in tilemap by tile number
export const getTileXY = (tile: number) => {
  const x = tile % tileMapW
  const y = Math.floor(tile / tileMapW)
  return [x, y]
}

export const tileSizeUpscaled = tileSize * pixelScale
class DrawEngine {
  context: CanvasRenderingContext2D
  tilemap = new Image()
  ready = false

  constructor () {
    // c2d - id of canvas element
    this.context = c2d.getContext('2d')
    // needed for pixel art
    this.context.imageSmoothingEnabled = false

    this.tilemap.src = 'tilemap_13k_23.png'
    this.tilemap.onload = () => {
      this.ready = true
    }
  }

  get wInTiles () {
    return this.w / tileSize / pixelScale
  }

  get hInTiles () {
    return this.h / tileSize / pixelScale
  }

  get w () {
    return this.context.canvas.width
  }

  get h () {
    return this.context.canvas.height
  }

  // not sure if we need this
  drawText (
    text: string,
    fontSize: number,
    x: number,
    y: number,
    color = 'white',
    textAlign: 'center' | 'left' | 'right' = 'center'
  ) {
    const context = this.context

    context.font = `${fontSize}px monospace, sans-serif-black`
    context.textAlign = textAlign
    context.strokeStyle = 'black'
    context.lineWidth = 1
    context.strokeText(text, x, y)
    context.fillStyle = color
    context.fillText(text, x, y)
  }

  drawBg () {
    // FIXME BG COLOR
    this.context.fillStyle = '#ff3f2631'
    this.context.fillRect(0, 0, this.w, this.h)

    // draw floor
    for (let x = 0; x < this.wInTiles; x++) {
      for (let y = 0; y < this.hInTiles; y++) {
        const point = getGridPointInPixels(x, y)
        this.context.drawImage(
          // @ts-ignore
          getTile(this.tilemap, ...getTileXY(GRASS))!,
          0,
          0,
          tileSize,
          tileSize,
          point[0],
          point[1],
          tileSize * pixelScale,
          tileSize * pixelScale
        )
      }
    }
  }

  drawEntity (pos: { x: number; y: number }, sprite: number, angle = 0) {
    const s = getTileXY(sprite)
    this.context.drawImage(
      getTile(this.tilemap, s[0], s[1], angle)!,
      0,
      0,
      tileSize,
      tileSize,
      Math.round(pos.x), // draw on pixel grid
      Math.round(pos.y),
      tileSizeUpscaled,
      tileSizeUpscaled
    )
  }

  drawCarry (pos: { x: number; y: number }, sprite: number) {
    const s = getTileXY(sprite)
    this.context.drawImage(
      getTile(this.tilemap, s[0], s[1])!,
      0,
      0,
      tileSize,
      tileSize,
      Math.round(pos.x) + tileSizeUpscaled / 4,
      Math.round(pos.y),
      tileSizeUpscaled / 2,
      tileSizeUpscaled / 2
    )
  }

  drawShadow (pos: { x: number; y: number }, sprite?: [number, number]) {
    this.context.fillStyle = 'rgba(0,0,0,0.2)'
    this.context.fillRect(
      Math.round(pos.x),
      Math.round(pos.y + tileSizeUpscaled - 6),
      tileSizeUpscaled,
      6
    )
  }

  drawOverlay (pos: { x: number; y: number }, sprite?: [number, number]) {
    this.context.fillStyle = 'rgba(255,255,255,0.1)'
    this.context.fillRect(
      Math.round(pos.x),
      Math.round(pos.y),
      tileSizeUpscaled,
      tileSizeUpscaled
    )
  }

  drawParticle (pos: { x: number; y: number }, color: string, size = 1) {
    this.context.fillStyle = color
    this.context.fillRect(
      Math.round(pos.x),
      Math.round(pos.y),
      size,
      size
    )
  }

  drawDebugRect (pos: { x: number; y: number }, w: number, h: number) {
    const newPos = getColPos(pos, { wh: { w, h } })
    this.context.strokeStyle = 'red'
    this.context.lineWidth = 1
    this.context.strokeRect(
      newPos.x,
      newPos.y,
      w,
      h
    )
  }
}

export const drawEngine = new DrawEngine()
