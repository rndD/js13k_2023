import { State } from "@/core/state";
import { drawEngine } from "@/core/draw-engine";
import { controls } from "@/core/controls";
import { gameStateMachine } from "@/game-state-machine";
import { menuState } from "@/game-states/menu.state";
import { getGridPointInPixels, getTile } from "@/lib/utils";
import {
  hInTiles,
  pixelScale,
  tileSize,
  tileSizeUnscaled,
  wInTiles,
} from "@/const";
import { Entity, getId } from "@/lib/entity";
import {
  correctAABBCollision,
  isPointerIn,
  testAABBCollision,
} from "@/lib/physics";

const WALL: [number, number] = [4, 3];
const WALL_R: [number, number] = [11, 4];
const WALL_L: [number, number] = [9, 4];
const DOOR: [number, number] = [10, 4];
const FLOOR: [number, number] = [0, 0];
const CRATE: [number, number] = [3, 5];

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

const createRoom = () => {
  const e: Entity[] = [];
  ROOM.forEach((row, y) => {
    row.forEach((tile, x) => {
      if (!Array.isArray(tile)) {
        return;
      }
      const point = getGridPointInPixels(new DOMPoint(x, y));
      e.push({
        id: getId(),
        pos: point,
        physics: {},
        sprite: tile,
        type: "wall",
      });
    });
  });
  console.log(e);
  return e;
};

class GameState implements State {
  tilemap = new Image();
  tiles: HTMLCanvasElement[] = [];

  entities: Entity[] = [];

  // ballSize = 100;
  // ballPosition = new DOMPoint(100, 100);
  // ballVelocity = new DOMPoint(10, 10);
  dragging: number = -1;

  constructor() {
    this.tilemap.src = "tilemap_packed.png";

    this.entities.push({
      id: getId(),
      pos: new DOMPoint(150, 150),
      moveable: { dx: 0, dy: 0 },
      draggebale: true,
      physics: { mass: 1, friction: 0.98 },
      sprite: CRATE,
      type: "crate",
    });

    this.entities.push({
      id: getId(),
      pos: new DOMPoint(300, 300),
      moveable: { dx: 0, dy: 0 },
      draggebale: true,
      physics: { mass: 1, friction: 0.98 },
      sprite: CRATE,
      type: "crate",
    });

    this.entities.push(...createRoom());
  }

  // Make sure ball starts at the same spot when game is entered
  onEnter() {
    // this.ballVelocity = new DOMPoint(10, 10);
  }

  onUpdate() {
    // draw

    // overdraw
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

    // Entity
    for (const entity of this.entities) {
      if (entity.draggebale && entity.moveable) {
        if (
          controls.isMouseDown &&
          !entity.dragged &&
          this.dragging === -1 &&
          isPointerIn(controls.mousePosition, {
            x: entity.pos.x,
            y: entity.pos.y,
            w: tileSize * pixelScale,
            h: tileSize * pixelScale,
          })
        ) {
          entity.dragged = true;
          this.dragging = entity.id;
        }
        if (!controls.isMouseDown && entity.dragged) {
          entity.dragged = false;
          this.dragging = -1;
        }

        if (entity.dragged) {
          // move create in direction of mouse but slowly
          entity.moveable.dx = (controls.mousePosition.x - entity.pos.x) / 50;
          entity.moveable.dy = (controls.mousePosition.y - entity.pos.y) / 50;
        }
      }

      // check for collisions
      for (const other of this.entities) {
        if (other.id === entity.id || !entity.physics || !other.physics) {
          continue;
        }

        if (entity.moveable) {
          const t = testAABBCollision(
            entity.pos,
            { w: tileSize * pixelScale, h: tileSizeUnscaled },
            other.pos,
            { w: tileSize * pixelScale, h: tileSizeUnscaled }
          );
          if (t.collide) {
            correctAABBCollision(entity, other, t);
          }
        }
      }

      if (entity.moveable) {
        entity.pos.x += entity.moveable?.dx;
        entity.pos.y += entity.moveable?.dy;
        // friction
        entity.moveable.dx *= entity.physics?.friction || 0.95;
        if (entity.moveable.dx < 0.001 && entity.moveable.dx > -0.001) {
          entity.moveable.dx = 0;
        }
        entity.moveable.dy *= entity.physics?.friction || 0.95;
        if (entity.moveable.dy < 0.001 && entity.moveable.dy > -0.001) {
          entity.moveable.dy = 0;
        }
      }

      if (entity.dragged) {
        drawEngine.context.fillStyle = "rgba(0,0,0,0.2)";
        drawEngine.context.fillRect(
          entity.pos.x + 1,
          entity.pos.y + 15,
          tileSizeUnscaled,
          tileSizeUnscaled
        );
      }

      drawEngine.context.drawImage(
        getTile(this.tilemap, entity.sprite[0], entity.sprite[1])!,
        0,
        0,
        tileSize,
        tileSize,
        entity.pos.x,
        entity.pos.y,
        tileSizeUnscaled,
        tileSizeUnscaled
      );
    }

    // this.cratePosition = controls.mousePosition;

    // draw room

    if (controls.isEscape) {
      gameStateMachine.setState(menuState);
    }
  }
}

export const gameState = new GameState();
