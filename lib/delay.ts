export async function delay<T> (ms: number, value?: T): Promise<T> {
  return await new Promise(resolve => setTimeout(resolve, ms, value))
}
