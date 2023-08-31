export const pixelScale = 2;
export const tileSize = 16;

export const tileSizeUpscaled = tileSize * pixelScale;
class DrawEngine {
  context: CanvasRenderingContext2D;

  constructor() {
    this.context = c2d.getContext("2d");
    // needed for pixel art
    this.context.imageSmoothingEnabled = false;
  }

  get wInTiles() {
    return this.w / tileSize / pixelScale;
  }
  get hInTiles() {
    return this.h / tileSize / pixelScale;
  }
  get w() {
    return this.context.canvas.width;
  }

  get h() {
    return this.context.canvas.height;
  }

  // not sure if we need this
  drawText(
    text: string,
    fontSize: number,
    x: number,
    y: number,
    color = "white",
    textAlign: "center" | "left" | "right" = "center"
  ) {
    const context = this.context;

    context.font = `${fontSize}px Impact, sans-serif-black`;
    context.textAlign = textAlign;
    context.strokeStyle = "black";
    context.lineWidth = 4;
    context.strokeText(text, x, y);
    context.fillStyle = color;
    context.fillText(text, x, y);
  }
}

export const drawEngine = new DrawEngine();
