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

import {
  Entity,
  createFreight,
  createModifiedFloor,
  createObstacle,
  createSellPoint,
  createSpawnPoint,
  createTranspansiveObj,
} from "@/core/entity";
import {
  correctAABBCollision,
  isPointerIn,
  testAABBCollision,
} from "@/lib/physics";
import { BARREL, BOX, DOOR_L, DOOR_R, ROOM, STAIRS } from "@/core/tiles";

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

      const isStairs = tile[0] === STAIRS[0] && tile[1] === STAIRS[0];
      const point = getGridPointInPixels(new DOMPoint(x + startX, y + startY));

      if (isDoor) {
        e.push(createTranspansiveObj(point, tile, "door"));
      } else if (isStairs) {
        e.push(createModifiedFloor(point, tile, "stairs", { dy: 0.1 }));
      } else {
        e.push(createObstacle(point, tile, "wall"));
      }
    });
  });
  return e;
};

class GameState implements State {
  tiles: HTMLCanvasElement[] = [];

  entities: Entity[] = [];
  entitiesMap = new Map<number, Entity>();

  gameData: { silver: number } = { silver: 0 };
  dragging: number = -1;

  constructor() {}

  addEntity(...entity: Entity[]) {
    // add entity to the game and sort by layer
    // there should be a better to do this, but this is fine for now
    this.entities.push(...entity);
    this.entities.sort((a, b) => a.layer - b.layer);
    entity.forEach((e) => {
      this.entitiesMap.set(e.id, e);
    });
  }

  // Make sure ball starts at the same spot when game is entered
  onEnter() {
    this.addEntity(
      createFreight(getGridPointInPixels(new DOMPoint(5, 4)), BOX, "crate", 1),
      createFreight(getGridPointInPixels(new DOMPoint(5, 6)), BOX, "crate", 1)
    );

    this.addEntity(createSellPoint(getGridPointInPixels(new DOMPoint(10, 4))));

    this.addEntity(
      createSpawnPoint(getGridPointInPixels(new DOMPoint(10, 14)))
    );

    this.addEntity(...createRoom());
  }

  onUpdate(deltaTime: number) {
    // Entity
    for (const entity of this.entities) {
      // points
      if (entity.type === "sellPoint" || entity.type === "spawnPoint") {
        // check if there is a crate on the point
        const crates = this.entities.filter((e) => e.type === "crate");
        const crateOnPoint = crates.find((c) =>
          isPointerIn(
            new DOMPoint(
              entity.pos.x + tileSizeUpscaled / 2,
              entity.pos.y + tileSizeUpscaled / 2
            ),
            {
              x: c.pos.x,
              y: c.pos.y,
              w: tileSizeUpscaled,
              h: tileSizeUpscaled,
            }
          )
        );
        if (crateOnPoint) {
          entity.gameData!.occupiedBy = crateOnPoint.id;
        } else {
          entity.gameData!.occupiedBy = undefined;
        }
      }

      if (entity.type === "sellPoint") {
        const c = this.entitiesMap.get(entity.gameData?.occupiedBy ?? -1);
        if (c && !c.dragged) {
          // sell crate
          this.gameData.silver += c.gameData?.price ?? 0;
          this.entities = this.entities.filter((e) => e.id !== c.id);
        }
      }

      if (entity.type === "spawnPoint") {
        // spawn
        if (entity.gameData?.timers?.nextSpawn) {
          entity.gameData.timers.nextSpawn -= deltaTime;

          if (
            entity.gameData.timers.nextSpawn <= 0 &&
            !entity.gameData.occupiedBy
          ) {
            entity.gameData.timers.nextSpawn =
              entity.gameData.timers.spawnInterval;
            this.addEntity(
              createFreight(
                new DOMPoint(entity.pos.x, entity.pos.y),
                BARREL,
                "crate",
                1,
                { mass: 100, friction: 0.96 }
              )
            );
          }
        }
      }

      // drag and drop
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
        if (other.id === entity.id || !entity.physics) {
          continue;
        }

        // modified floor
        const isModifiedFloor = !!other.physicsModifiers;

        // no collision
        if (!other.physics && !isModifiedFloor) {
          continue;
        }

        if (entity.moveable) {
          const t = testAABBCollision(
            entity.pos,
            { w: tileSizeUpscaled, h: tileSizeUpscaled },
            other.pos,
            { w: tileSizeUpscaled, h: tileSizeUpscaled }
          );

          if (isModifiedFloor) {
            if (t.collide) {
              entity.moveable.dx += other.physicsModifiers?.dx ?? 0;
              entity.moveable.dy += other.physicsModifiers?.dy ?? 0;
            }
          }

          if (t.collide && other.physics) {
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

    // draw entities
    drawEngine.renderGame(this.entities);

    drawEngine.drawText("Silver: " + this.gameData.silver, 24, 600, 40);

    if (controls.isEscape) {
      gameStateMachine.setState(menuState);
    }
  }
}

export const gameState = new GameState();
