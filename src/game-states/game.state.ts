import { State } from "@/core/state";
import {
  drawEngine,
  pixelScale,
  tileSize,
  tileSizeUpscaled,
} from "@/core/draw-engine";
import { controls } from "@/core/controls";
import { gameStateMachine } from "@/game-state-machine";
import { menuState } from "@/game-states/menu.state";
import { getGridPointInPixels } from "@/lib/utils";

import { Entity, createFreight, createObstacle } from "@/lib/entity";
import {
  correctAABBCollision,
  isPointerIn,
  testAABBCollision,
} from "@/lib/physics";
import { CRATE, DOOR_L, DOOR_R, ROOM } from "@/core/tiles";

const createRoom = () => {
  const e: Entity[] = [];
  const startX = 2;
  const startY = 2;
  ROOM.forEach((row, y) => {
    row.forEach((tile, x) => {
      if (!Array.isArray(tile)) {
        return;
      }
      const isDoor =
        (tile[0] === DOOR_L[0] && tile[1] === DOOR_L[1]) ||
        (tile[0] === DOOR_R[0] && tile[1] === DOOR_R[1]);
      const point = getGridPointInPixels(new DOMPoint(x + startX, y + startY));
      e.push(createObstacle(point, tile, isDoor ? "door" : "wall"));
    });
  });
  return e;
};

class GameState implements State {
  tiles: HTMLCanvasElement[] = [];

  entities: Entity[] = [];

  // ballSize = 100;
  // ballPosition = new DOMPoint(100, 100);
  // ballVelocity = new DOMPoint(10, 10);
  dragging: number = -1;

  constructor() {
    this.entities.push(
      createFreight(new DOMPoint(100, 100), CRATE, "crate", 1),
      createFreight(new DOMPoint(200, 100), CRATE, "crate", 1)
    );

    this.entities.push(...createRoom());
  }

  // Make sure ball starts at the same spot when game is entered
  onEnter() {
    // this.ballVelocity = new DOMPoint(10, 10);
  }

  onUpdate() {
    // draw

    const collisionMap = new Map<string, boolean>();
    // Entity
    for (const entity of this.entities) {
      if (entity.draggebale && entity.moveable) {
        entity.hovered = isPointerIn(controls.mousePosition, {
          x: entity.pos.x,
          y: entity.pos.y,
          w: tileSize * pixelScale,
          h: tileSize * pixelScale,
        });
        if (entity.hovered && !entity.dragged && this.dragging === -1) {
          if (controls.isMouseDown) {
            entity.dragged = true;
            this.dragging = entity.id;
          }
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

        const isAlreadyColided = collisionMap.has(
          `${Math.min(entity.id, other.id)}-${Math.max(entity.id, other.id)}`
        );
        if (entity.moveable) {
          const t = testAABBCollision(
            entity.pos,
            { w: tileSizeUpscaled, h: tileSizeUpscaled },
            other.pos,
            { w: tileSizeUpscaled, h: tileSizeUpscaled }
          );
          if (t.collide) {
            collisionMap.set(
              `${Math.min(entity.id, other.id)}-${Math.max(
                entity.id,
                other.id
              )}`,
              true
            );
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
    }

    // draw
    drawEngine.renderGame(this.entities);

    if (controls.isEscape) {
      gameStateMachine.setState(menuState);
    }
  }
}

export const gameState = new GameState();
