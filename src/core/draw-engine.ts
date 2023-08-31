import { getGridPointInPixels, getTile } from "@/lib/utils";
import { FLOOR } from "./tiles";
import { Entity } from "@/lib/entity";

export const pixelScale = 2;
export const tileSize = 16;

export const tileSizeUpscaled = tileSize * pixelScale;
class DrawEngine {
  context: CanvasRenderingContext2D;
  tilemap = new Image();

  constructor() {
    this.context = c2d.getContext("2d");
    // needed for pixel art
    this.context.imageSmoothingEnabled = false;

    this.tilemap.src = "tilemap_packed.png";
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

  renderGame(entities: Entity[]) {
    // overdraw
    this.context.fillStyle = "gray";
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

    // draw entities
    for (const entity of entities) {
      if (entity.dragged) {
        this.context.fillStyle = "rgba(0,0,0,0.2)";
        this.context.fillRect(
          Math.round(entity.pos.x + 1),
          Math.round(entity.pos.y + 5),
          tileSizeUpscaled,
          tileSizeUpscaled
        );
      }

      this.context.drawImage(
        getTile(this.tilemap, entity.sprite[0], entity.sprite[1])!,
        0,
        0,
        tileSize,
        tileSize,
        Math.round(entity.pos.x),
        Math.round(entity.pos.y),
        tileSizeUpscaled,
        tileSizeUpscaled
      );

      if (entity.hovered && !entity.dragged) {
        // draw transparent white overlay
        this.context.fillStyle = "rgba(255,255,255,0.1)";
        this.context.fillRect(
          Math.round(entity.pos.x),
          Math.round(entity.pos.y),
          tileSizeUpscaled,
          tileSizeUpscaled
        );
      }
    }
  }
}

export const drawEngine = new DrawEngine();
