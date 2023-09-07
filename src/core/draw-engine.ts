import { getGridPointInPixels } from '@/lib/utils'
import { getColPos } from './ecs/systems/collide'
import { GRASS, I_COIN } from '@/tiles'
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
      Math.round(pos.x),
      Math.round(pos.y) + tileSizeUpscaled / 4,
      tileSizeUpscaled / 2,
      tileSizeUpscaled / 2
    )
  }

  drawIcon (x: number, y: number, sprite: number, big?:boolean) {
    const s = getTileXY(sprite)
    this.context.drawImage(
      getTile(this.tilemap, s[0], s[1])!,
      0,
      0,
      tileSize,
      tileSize,
      Math.round(x),
      Math.round(y),
      tileSizeUpscaled / (big ? 1 : 2),
      tileSizeUpscaled / (big ? 1 : 2)
    )
  }

  drawUIMoney (money: number) {
    const m = money.toString()
    // drop box

    this.context.fillStyle = 'rgba(0,0,0,0.4)'
    this.context.fillRect(
      0,
      0,
      22 + m.length * 10 + 10,
      23
    )

    this.drawText(
      m,
      24,
      2,
      19,
      'gold',
      'left'
    )
    this.drawIcon(
      16 + m.length * 10,
      -5,
      I_COIN,
      true
    )
  }

  drawBuying (pos: { x: number; y: number }, res: {[sprite: number]: number}) {
    let { x, y } = pos
    y += tileSizeUpscaled - 2
    const pad = 2
    this.context.fillStyle = 'rgba(0,0,0,0.4)'
    this.context.fillRect(
      Math.round(x),
      Math.round(y),
      tileSizeUpscaled,
      Object.keys(res).length * tileSize + pad * 2
    )

    Object.entries(res).forEach(([sprite, count], i) => {
      const s = getTileXY(Number(sprite))
      this.context.drawImage(
        getTile(this.tilemap, s[0], s[1])!,
        0,
        0,
        tileSize,
        tileSize,
        Math.round(x) + pad,
        Math.round(y) + pad + i * tileSize,
        tileSize,
        tileSize
      )
      this.drawText(
        count.toString(),
        10,
        Math.round(x) + pad * 3 + tileSize,
        Math.round(y) + pad + i * tileSize + tileSize / 2 + 4,
        'white',
        'left'
      )
    })
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

  // FIXME not used
  drawOverlay (pos: { x: number; y: number }, { w, h }: { w: number; h: number }) {
    // draw dashed box around the object
    this.context.strokeStyle = 'rgba(0,0,0,0.8)'
    this.context.lineWidth = 2

    this.context.beginPath()
    this.context.setLineDash([4, 4])
    this.context.rect(
      Math.round(pos.x) - 2,
      Math.round(pos.y) - 2,
      w + 4,
      h + 4
    )
    this.context.stroke()
    this.context.closePath()
  }

  drawProgress (pos: { x: number; y: number }, nextIn: number, interval: number) {
    const progress = 1 - (nextIn / interval)
    const x = Math.round(pos.x) + 2
    const y = Math.round(pos.y) + tileSizeUpscaled / 4 * 3
    this.context.fillStyle = '#000'
    this.context.fillRect(
      x,
      y,
      tileSizeUpscaled - 4,
      4
    )
    this.context.fillStyle = '#fff'
    this.context.fillRect(
      x, y,
      progress * (tileSizeUpscaled - 4),
      4
    )
  }

  drawParticle (pos: { x: number; y: number }, color: string, size = 1, sprite?: number) {
    if (sprite !== undefined) {
      const s = getTileXY(sprite)
      // Ignore size for sprite
      this.context.drawImage(
        getTile(this.tilemap, s[0], s[1])!,
        0,
        0,
        tileSize,
        tileSize,
        Math.round(pos.x),
        Math.round(pos.y),
        tileSize,
        tileSize
      )
    } else {
      this.context.fillStyle = color
      this.context.fillRect(
        Math.round(pos.x),
        Math.round(pos.y),
        size,
        size
      )
    }
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
