import type { ID } from './types'

let _counter = 0

export function generateID (): ID {
  return `_${++_counter}`
}
