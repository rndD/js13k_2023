export default function nullthrows<T> (value: T | null | undefined): T {
  if (value == null) {
    throw new Error('Get unexpected null')
  }

  return value
}
