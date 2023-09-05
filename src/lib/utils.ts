import { tileSizeUpscaled } from '@/core/draw-engine'

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

export const getGridPointInPixels = (x: number, y:number): [number, number] => {
  return [
    x * tileSizeUpscaled,
    y * tileSizeUpscaled
  ]
}

export const EventEmitter = () => {
  const events: { [key: string]: Function[] } = {}
  return {
    on: (event: string, fn: Function) => {
      if (!events[event]) {
        events[event] = []
      }
      events[event].push(fn)
    },
    off: (event: string, fn: Function) => {
      if (!events[event]) {
        return
      }
      events[event] = events[event].filter(f => f !== fn)
    },
    emit: (event: string, ...args: any[]) => {
      if (!events[event]) {
        return
      }
      events[event].forEach(f => f(...args))
    }
  }
}

export const randomFromList = <T>(list: T[]): T => {
  return list[Math.floor(Math.random() * list.length)]
}
