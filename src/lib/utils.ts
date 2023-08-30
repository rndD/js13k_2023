import { tileSize, tileSizeUpscaled } from "@/const";

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
    context.imageSmoothingEnabled = false;
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

// work with small objects
export const getOutlinedTile = memoize(
  (source: HTMLCanvasElement, scale = 2) => {
    const sCtx = source.getContext("2d");

    const canvas = document.createElement("canvas");
    canvas.width = source.width * 2;
    canvas.height = source.height * 2;

    const ctx = canvas.getContext("2d");
    ctx!.imageSmoothingEnabled = false;

    var dArr = [-1, -1, 0, -1, 1, -1, -1, 0, 1, 0, -1, 1, 0, 1, 1, 1], // offset array
      s = scale, // thickness scale
      i = 0, // iterator
      x = 5, // final position
      y = 1;

    // draw images at offsets from the array scaled by s
    for (; i < dArr.length; i += 2)
      ctx!.drawImage(source, x + dArr[i] * s, y + dArr[i + 1] * s);

    // fill with color
    ctx!.globalCompositeOperation = "source-in";
    // trasparent white
    ctx!.fillStyle = "rgba(255,255,255,0.8)";
    ctx!.fillRect(0, 0, canvas.width, canvas.height);

    // draw original image in normal mode
    ctx!.globalCompositeOperation = "source-over";
    ctx!.drawImage(source, x, y);
    return canvas;
  }
);

export const getGridPointInPixels = (gridPoint: DOMPoint) => {
  return new DOMPoint(
    gridPoint.x * tileSizeUpscaled,
    gridPoint.y * tileSizeUpscaled
  );
};
