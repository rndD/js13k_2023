import { tileSize, tileSizeUpscaled } from '@/core/draw-engine'

export const memoize = <T extends (...args: any[]) => any>(fn: T) => {
  const cache = new Map<string, ReturnType<T>>()
  return (...args: Parameters<T>): ReturnType<T> => {
    const key = JSON.stringify(args)
    if (cache.has(key)) {
      return cache.get(key)!
    }
    const result = fn(...args)
    cache.set(key, result)
    return result
  }
}

// not used yet
export const lerp = (start: number, end: number, amt: number) => {
  return (1 - amt) * start + amt * end
}

export const getTile = memoize(
  (tilemap: HTMLImageElement, x: number, y: number, angle = 0) => {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    // FIXME Remove when size limit hit
    if (!context) {
      throw new Error('Could not get context from canvas')
    }
    context.imageSmoothingEnabled = false
    canvas.width = tileSize
    canvas.height = tileSize

    context.clearRect(0, 0, tileSize, tileSize)
    if (angle !== 0) {
      context.save()
      // move to the center of the canvas
      context.translate(canvas.width / 2, canvas.height / 2)
      // rotate the canvas to the specified degrees
      context.rotate(angle * Math.PI / 180)
      context.translate(-canvas.width * 0.5, -canvas.height * 0.5)
    }
    context.drawImage(
      tilemap,
      x * tileSize,
      y * tileSize,
      tileSize,
      tileSize,
      0,
      0,
      tileSize,
      tileSize
    )

    if (angle !== 0) {
      context.restore()
    }

    return context.canvas
  }
)

// work with small objects
// not used
export const getOutlinedTile = memoize(
  (source: HTMLCanvasElement, scale = 2) => {
    const sCtx = source.getContext('2d')

    const canvas = document.createElement('canvas')
    canvas.width = source.width * 2
    canvas.height = source.height * 2

    const ctx = canvas.getContext('2d')
    ctx!.imageSmoothingEnabled = false

    const dArr = [-1, -1, 0, -1, 1, -1, -1, 0, 1, 0, -1, 1, 0, 1, 1, 1] // offset array
    const s = scale // thickness scale
    let i = 0 // iterator
    const x = 5 // final position
    const y = 1

    // draw images at offsets from the array scaled by s
    for (; i < dArr.length; i += 2) { ctx!.drawImage(source, x + dArr[i] * s, y + dArr[i + 1] * s) }

    // fill with color
    ctx!.globalCompositeOperation = 'source-in'
    // trasparent white
    ctx!.fillStyle = 'rgba(255,255,255,0.8)'
    ctx!.fillRect(0, 0, canvas.width, canvas.height)

    // draw original image in normal mode
    ctx!.globalCompositeOperation = 'source-over'
    ctx!.drawImage(source, x, y)
    return canvas
  }
)

export const getGridPointInPixels = (gridPoint: DOMPoint) => {
  return new DOMPoint(
    gridPoint.x * tileSizeUpscaled,
    gridPoint.y * tileSizeUpscaled
  )
}
