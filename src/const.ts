export const canvasW = 1920;
export const canvasH = 1080;

export const pixelScale = 4;
export const tileSize = 16;

export const tileSizeUnscaled = tileSize * pixelScale;

export const wInTiles = canvasW / tileSize / pixelScale;
export const hInTiles = canvasH / tileSize / pixelScale;
