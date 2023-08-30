export const canvasW = 1080;
export const canvasH = 720;

export const pixelScale = 2;
export const tileSize = 16;

export const tileSizeUpscaled = tileSize * pixelScale;

export const wInTiles = canvasW / tileSize / pixelScale;
export const hInTiles = canvasH / tileSize / pixelScale;
