export function invariant (
  condition: any,
  message?: string
): asserts condition {
  if (!condition) { // eslint-disable-line @typescript-eslint/strict-boolean-expressions
    const msg = message ?? 'you shall not pass'
    throw new Error(msg)
  }
}
