import { State } from "@/core/state";
import { drawEngine } from "@/core/draw-engine";
import { controls } from "@/core/controls";
import { gameStateMachine } from "@/game-state-machine";
import { menuState } from "@/game-states/menu.state";
import { AABB, lerp, memoize } from "@/lib/utils";

const canvasW = 1920;
const canvasH = 1080;

const pixelScale = 5;
const tileSize = 16;

const wInTiles = canvasW / tileSize / pixelScale;
const hInTiles = canvasH / tileSize / pixelScale;

const WALL = [4, 3];
const WALL_R = [11, 4];
const WALL_L = [9, 4];
const FLOOR = [0, 0];
const CRATE = [3, 5];

const EMPTY = 0;

const ROOM = [
  [WALL_L, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL_R],
  [
    WALL_L,
    EMPTY,
    EMPTY,
    EMPTY,
    EMPTY,
    EMPTY,
    EMPTY,
    EMPTY,
    EMPTY,
    EMPTY,
    EMPTY,
    WALL_R,
  ],
  [
    WALL_L,
    EMPTY,
    EMPTY,
    EMPTY,
    EMPTY,
    EMPTY,
    EMPTY,
    EMPTY,
    EMPTY,
    EMPTY,
    EMPTY,
    WALL_R,
  ],
  [
    WALL_L,
    EMPTY,
    EMPTY,
    EMPTY,
    EMPTY,
    EMPTY,
    EMPTY,
    EMPTY,
    EMPTY,
    EMPTY,
    EMPTY,
    WALL_R,
  ],
  [
    WALL_L,
    EMPTY,
    EMPTY,
    EMPTY,
    EMPTY,
    EMPTY,
    EMPTY,
    EMPTY,
    EMPTY,
    EMPTY,
    EMPTY,
    WALL_R,
  ],
  [
    WALL_L,
    EMPTY,
    EMPTY,
    EMPTY,
    EMPTY,
    EMPTY,
    EMPTY,
    EMPTY,
    EMPTY,
    EMPTY,
    EMPTY,
    WALL_R,
  ],
  [WALL_L, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL_R],
];

const getTile = memoize((tilemap: HTMLImageElement, x: number, y: number) => {
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
});

const getGridPointInPixels = (gridPoint: DOMPoint) => {
  return new DOMPoint(
    gridPoint.x * tileSize * pixelScale,
    gridPoint.y * tileSize * pixelScale
  );
};

class GameState implements State {
  tilemap = new Image();
  tiles: HTMLCanvasElement[] = [];
  cratePosition = new DOMPoint(100, 100);

  isCrateDragging = false;

  // ballSize = 100;
  // ballPosition = new DOMPoint(100, 100);
  // ballVelocity = new DOMPoint(10, 10);

  constructor() {
    this.tilemap.src = "tilemap_packed.png";
  }

  // Make sure ball starts at the same spot when game is entered
  onEnter() {
    // this.ballVelocity = new DOMPoint(10, 10);
  }

  onUpdate() {
    // draw
    drawEngine.context.fillStyle = "gray";
    drawEngine.context.fillRect(
      0,
      0,
      drawEngine.canvasWidth,
      drawEngine.canvasHeight
    );

    // draw floor
    for (let x = 0; x < wInTiles; x++) {
      for (let y = 0; y < hInTiles; y++) {
        const point = getGridPointInPixels(new DOMPoint(x, y));
        drawEngine.context.drawImage(
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

    // draw crate
    if (controls.isMouseDown) {
      if (
        AABB(
          controls.mousePosition,
          this.cratePosition,
          tileSize * pixelScale
        ) ||
        this.isCrateDragging
      ) {
        this.isCrateDragging = true;
        // limit it to room
        if (
          this.cratePosition.x > tileSize * pixelScale &&
          this.cratePosition.x < canvasW / 2 - tileSize * pixelScale
        ) {
          this.cratePosition.x = lerp(
            this.cratePosition.x,
            controls.mousePosition.x,
            0.2
          );
        }
        if (
          this.cratePosition.y > tileSize * pixelScale &&
          this.cratePosition.y < canvasH / 2 - tileSize * pixelScale
        ) {
          this.cratePosition.y = lerp(
            this.cratePosition.y,
            controls.mousePosition.y,
            0.2
          );
        }
        // this.cratePosition = controls.mousePosition;
      }
    } else {
      this.isCrateDragging = false;
    }

    // this.cratePosition = controls.mousePosition;

    drawEngine.context.drawImage(
      getTile(this.tilemap, CRATE[0], CRATE[1])!,
      0,
      0,
      tileSize,
      tileSize,
      this.cratePosition.x,
      this.cratePosition.y,
      tileSize * pixelScale,
      tileSize * pixelScale
    );

    // draw room
    ROOM.forEach((row, y) => {
      row.forEach((tile, x) => {
        if (!Array.isArray(tile)) {
          return;
        }

        const point = getGridPointInPixels(new DOMPoint(x, y));
        drawEngine.context.drawImage(
          getTile(this.tilemap, tile[0], tile[1])!,
          0,
          0,
          tileSize,
          tileSize,
          point.x,
          point.y,
          tileSize * pixelScale,
          tileSize * pixelScale
        );
      });
    });

    if (controls.isEscape) {
      gameStateMachine.setState(menuState);
    }
  }
}

export const gameState = new GameState();
