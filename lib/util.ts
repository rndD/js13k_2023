export function values<K, V> (dict: Map<K, V>): V[] {
  return Array.from(dict.values())
}
