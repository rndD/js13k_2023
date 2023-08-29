export const memoize = <T extends (...args: any[]) => any>(fn: T) => {
  const cache = new Map<string, ReturnType<T>>();
  return (...args: Parameters<T>): ReturnType<T> => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key)!;
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};

export const AABB = (a: DOMPoint, b: DOMPoint, size: number) => {
  return (
    a.x < b.x + size &&
      a.x + size > b.x &&
      a.y < b.y + size &&
      a.y + size > b.y // prettier-ignore
  );
};

export const lerp = (start: number, end: number, amt: number) => {
  return (1 - amt) * start + amt * end;
};
