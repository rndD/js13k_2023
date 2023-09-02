import { getGridPointInPixels, getTile } from "@/lib/utils";
import { FLOOR } from "./tiles";

export const pixelScale = 2;
export const tileSize = 16;

export const tileSizeUpscaled = tileSize * pixelScale;
class DrawEngine {
  context: CanvasRenderingContext2D;
  tilemap = new Image();
  ready = false;

  constructor() {
    this.context = c2d.getContext("2d");
    // needed for pixel art
    this.context.imageSmoothingEnabled = false;

    this.tilemap.src = "tiles.png";
    this.tilemap.onload = () => {
      this.ready = true;
    };
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

    context.font = `${fontSize}px monospace, sans-serif-black`;
    context.textAlign = textAlign;
    context.strokeStyle = "black";
    context.lineWidth = 1;
    context.strokeText(text, x, y);
    context.fillStyle = color;
    context.fillText(text, x, y);
  }

  drawFloor() {
    // FIXME BG COLOR
    this.context.fillStyle = "#ff3f2631";
    this.context.fillRect(0, 0, this.w, this.h);

    // draw floor
    for (let x = 0; x < this.wInTiles; x++) {
      for (let y = 0; y < this.hInTiles; y++) {
        const point = getGridPointInPixels(new DOMPoint(x, y));
        this.context.drawImage(
          getTile(this.tilemap, FLOOR[0], FLOOR[1])!,
          0,
          0,
          tileSize,
          tileSize,
          point.x,
          point.y,
          tileSize * pixelScale,
          tileSize * pixelScale
        );
      }
    }
  }

  drawEntity(pos: { x: number; y: number }, sprite: [number, number]) {
    this.context.drawImage(
      getTile(this.tilemap, sprite[0], sprite[1])!,
      0,
      0,
      tileSize,
      tileSize,
      Math.round(pos.x), // draw on pixel grid
      Math.round(pos.y),
      tileSizeUpscaled,
      tileSizeUpscaled
    );
  }

  drawShadow(pos: { x: number; y: number }, sprite?: [number, number]) {
    this.context.fillStyle = "rgba(0,0,0,0.2)";
    this.context.fillRect(
      Math.round(pos.x + 1),
      Math.round(pos.y + 5),
      tileSizeUpscaled,
      tileSizeUpscaled
    );
  }
  drawOverlay(pos: { x: number; y: number }, sprite?: [number, number]) {
    this.context.fillStyle = "rgba(255,255,255,0.1)";
    this.context.fillRect(
      Math.round(pos.x),
      Math.round(pos.y),
      tileSizeUpscaled,
      tileSizeUpscaled
    );
  }
}

export const drawEngine = new DrawEngine();
