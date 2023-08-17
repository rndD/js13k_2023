let _counter = 0

export function generateID (prefix = ''): string {
  return `_${prefix}${++_counter}`
}
