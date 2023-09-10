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

export const getGridPointFromPixels = (x: number, y:number): [number, number] => {
  return [
    Math.floor(x / tileSizeUpscaled),
    Math.floor(y / tileSizeUpscaled)
  ]
}

export const EventEmitter = () => {
  const events: { [key: string|number]: Function[] } = {}
  return {
    on: (event: string| number, fn: Function) => {
      if (!events[event]) {
        events[event] = []
      }
      events[event].push(fn)
    },
    off: (event: string|number, fn: Function) => {
      if (!events[event]) {
        return
      }
      events[event] = events[event].filter(f => f !== fn)
    },
    emit: (event: string|number, ...args: any[]) => {
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

export const nthRoot = (x: number, n: number) => {
  // if x is negative function returns NaN
  if (x < 0) {
    return -Math.exp((1 / n) * Math.log(x * -1))
  }
  return Math.exp((1 / n) * Math.log(x))
}

export const create2DArray = <T>(rows: number, cols: number, defaultValue: T): T[][] => {
  const arr: T[][] = []
  for (let i = 0; i < rows; i++) {
    arr[i] = []
    for (let j = 0; j < cols; j++) {
      arr[i][j] = defaultValue
    }
  }
  return arr
}
class Node {
  x: number
  y: number
  gCost: number
  hCost: number
  parent: Node | null

  constructor (x: number, y: number) {
    this.x = x
    this.y = y
    this.gCost = 0
    this.hCost = 0
    this.parent = null
  }

  get fCost (): number {
    return this.gCost + this.hCost
  }
}

export const aStar = (start: [number, number], end: [number, number], grid: number[][]): [number, number][] | null => {
  const numRows = grid.length
  const numCols = grid[0].length
  const openSet: Node[] = []
  const closedSet: Node[] = []
  const startNode = new Node(start[0], start[1])
  const endNode = new Node(end[0], end[1])
  openSet.push(startNode)

  while (openSet.length > 0) {
    let currentNode = openSet[0]
    for (let i = 1; i < openSet.length; i++) {
      if (openSet[i].fCost < currentNode.fCost || (openSet[i].fCost === currentNode.fCost && openSet[i].hCost < currentNode.hCost)) {
        currentNode = openSet[i]
      }
    }

    openSet.splice(openSet.indexOf(currentNode), 1)
    closedSet.push(currentNode)

    if (currentNode.x === endNode.x && currentNode.y === endNode.y) {
      const path: [number, number][] = []
      let current = currentNode
      while (current !== null) {
        path.unshift([current.x, current.y])
        current = current.parent!
      }
      return path
    }

    const neighbors: Node[] = []
    const directions = [
      [0, -1], // Up
      [0, 1], // Down
      [-1, 0], // Left
      [1, 0] // Right
    ]

    for (const direction of directions) {
      const neighborX = currentNode.x + direction[0]
      const neighborY = currentNode.y + direction[1]

      if (neighborX >= 0 && neighborX < numRows && neighborY >= 0 && neighborY < numCols && grid[neighborX][neighborY] === 0) {
        const neighbor = new Node(neighborX, neighborY)
        neighbors.push(neighbor)
      }
    }

    for (const neighbor of neighbors) {
      if (closedSet.some((node) => node.x === neighbor.x && node.y === neighbor.y)) continue

      const tentativeGCost = currentNode.gCost + 1

      if (!openSet.some((node) => node.x === neighbor.x && node.y === neighbor.y) || tentativeGCost < neighbor.gCost) {
        neighbor.gCost = tentativeGCost
        neighbor.hCost = manhattanDistance(neighbor, endNode)
        neighbor.parent = currentNode

        if (!openSet.some((node) => node.x === neighbor.x && node.y === neighbor.y)) {
          openSet.push(neighbor)
        }
      }
    }
  }

  return null
}

// FIXME reuse
const manhattanDistance = (nodeA: Node, nodeB: Node) => {
  return Math.abs(nodeA.x - nodeB.x) + Math.abs(nodeA.y - nodeB.y)
}
