import { pixelScale, tileSize } from "@/const";

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

export const lerp = (start: number, end: number, amt: number) => {
  return (1 - amt) * start + amt * end;
};

export const getTile = memoize(
  (tilemap: HTMLImageElement, x: number, y: number) => {
    const horizontalTiles = 12;
    const verticalTiles = 11;

    if (x < 0 || x >= horizontalTiles || y < 0 || y >= verticalTiles) {
      console.warn("Tile out of bounds", x, y);
      return null;
    }

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("Could not get context from canvas");
    }
    canvas.width = tileSize;
    canvas.height = tileSize;

    context.clearRect(0, 0, tileSize, tileSize);
    context.drawImage(
      tilemap,
      x * tileSize,
      y * tileSize,
      tileSize,
      tileSize,
      0,
      0,
      tileSize,
      tileSize
    );
    return context.canvas;
  }
);

export const getGridPointInPixels = (gridPoint: DOMPoint) => {
  return new DOMPoint(
    gridPoint.x * tileSize * pixelScale,
    gridPoint.y * tileSize * pixelScale
  );
};
