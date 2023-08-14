/* @flow */

export function className (input: unknown | unknown[]): string {
  let output = ''

  if (typeof input === 'string') {
    output = input
  }

  if (Array.isArray(input)) {
    input.forEach(value => {
      const r = className(value)
      if (r !== '' && output !== '') output += ' '
      output += r
    })
  }

  return output
}
