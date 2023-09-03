import { controls } from '@/core/controls'
import { gameStateMachine } from '@/game-state-machine'
import { menuState } from '@/game-states/menu.state'
import { getGridPointInPixels } from '@/lib/utils'

import {
  createFloor,
  createFreight,
  createObstacle,
  createPlayer
} from '@/core/ecs/helpers'

import { BOX, MAP, MAP_2, WALLS, TOP, Tiles } from '@/tiles'
import { Component, ECS } from '@/lib/ecs'
import {
  CollideSystem,
  DragSystem,
  MoveSystem,
  PhysicsSystem,
  PlayerControlSystem,
  RenderSystem,
  SoundSystem
} from '@/core/ecs/system'
import { State } from '@/core/state-machine'

// test only
const createMap = () => {
  const ec: Component[][] = []
  const startX = 2
  const startY = 2

  ;[MAP, MAP_2, WALLS, TOP].forEach(layer =>
    layer.forEach((row, y) => {
      Array.isArray(row) && row.forEach((tileOrTileArray, x) => {
        if (tileOrTileArray === null) return

        let angle = 0
        let tile

        if (Array.isArray(tileOrTileArray)) {
          angle = tileOrTileArray[1] as number
          tile = tileOrTileArray[0] as number
        } else {
          tile = tileOrTileArray as number
        }

        const coords: [number, number] = [tile % 8, Math.floor(tile / 8)]

        const point = getGridPointInPixels(new DOMPoint(x + startX, y + startY))
        const components: Component[] = []

        switch (tile) {
          case Tiles.W_SHORE:
            components.push(...createObstacle(point, coords, 'water', angle))
            break
          case Tiles.R_VERTICAL:
          case Tiles.R_CROSS:
            components.push(...createFloor(point, coords, 'floor', angle))
            break
          default:
            components.push(...createObstacle(point, coords, 'wall', angle))
            break
        }

        ec.push(components)
      })
    }))

  return ec
}

class GameState implements State {
  // gameData: { silver: number } = { silver: 0 };

  ecs: ECS = new ECS()

  constructor () {
    this.ecs.addSystem(new DragSystem())
    this.ecs.addSystem(new CollideSystem())
    this.ecs.addSystem(new PhysicsSystem())
    this.ecs.addSystem(new MoveSystem())
    this.ecs.addSystem(new PlayerControlSystem())
    this.ecs.addSystem(new RenderSystem())
    this.ecs.addSystem(new SoundSystem())
  }

  addEntities (...entitiesComponents: Component[][]) {
    for (const ec of entitiesComponents) {
      const entity = this.ecs.addEntity()
      for (const c of ec) {
        this.ecs.addComponent(entity, c)
      }
    }
    // this.entities.sort((a, b) => a.layer - b.layer);
    // entity.forEach((e) => {
    //   this.entitiesMap.set(e.id, e);
    // });
  }

  // Make sure ball starts at the same spot when game is entered
  onEnter () {
    const playerTile: [number, number] = [Tiles.H_PLAYER % 8, Math.floor(Tiles.H_PLAYER / 8)]

    this.addEntities(
      createFreight(getGridPointInPixels(new DOMPoint(15, 10)), BOX, 'crate', 1),
      createFreight(getGridPointInPixels(new DOMPoint(5, 6)), BOX, 'crate', 1),
      createPlayer(getGridPointInPixels(new DOMPoint(12, 10)), playerTile, 'player')
    )

    // this.addEntity(createSellPoint(getGridPointInPixels(new DOMPoint(10, 4))));

    // this.addEntity(
    //   createSpawnPoint(getGridPointInPixels(new DOMPoint(10, 14)))
    // );

    this.addEntities(...createMap())
  }

  onUpdate (deltaTime: number) {
    this.ecs.currentDelta = deltaTime
    this.ecs.update()
    // FIXME move to systems
    // Entity
    // for (const entity of this.entities) {
    //   // points
    //   if (entity.type === "sellPoint" || entity.type === "spawnPoint") {
    //     // check if there is a crate on the point
    //     const crates = this.entities.filter((e) => e.type === "crate");
    //     const crateOnPoint = crates.find((c) =>
    //       isPointerIn(
    //         new DOMPoint(
    //           entity.pos.x + tileSizeUpscaled / 2,
    //           entity.pos.y + tileSizeUpscaled / 2
    //         ),
    //         {
    //           x: c.pos.x,
    //           y: c.pos.y,
    //           w: tileSizeUpscaled,
    //           h: tileSizeUpscaled,
    //         }
    //       )
    //     );
    //     if (crateOnPoint) {
    //       entity.gameData!.occupiedBy = crateOnPoint.id;
    //     } else {
    //       entity.gameData!.occupiedBy = undefined;
    //     }
    //   }

    //   if (entity.type === "sellPoint") {
    //     const c = this.entitiesMap.get(entity.gameData?.occupiedBy ?? -1);
    //     if (c && !c.dragged) {
    //       // sell crate
    //       this.gameData.silver += c.gameData?.price ?? 0;
    //       this.entities = this.entities.filter((e) => e.id !== c.id);
    //     }
    //   }

    //   if (entity.type === "spawnPoint") {
    //     // spawn
    //     if (entity.gameData?.timers?.nextSpawn) {
    //       entity.gameData.timers.nextSpawn -= deltaTime;

    //       if (
    //         entity.gameData.timers.nextSpawn <= 0 &&
    //         !entity.gameData.occupiedBy
    //       ) {
    //         entity.gameData.timers.nextSpawn =
    //           entity.gameData.timers.spawnInterval;
    //         this.addEntity(
    //           createFreight(
    //             new DOMPoint(entity.pos.x, entity.pos.y),
    //             BARREL,
    //             "crate",
    //             1,
    //             { mass: 100, friction: 0.96 }
    //           )
    //         );
    //       }
    //     }
    //   }

    //   // check for collisions
    //   for (const other of this.entities) {
    //     if (other.id === entity.id || !entity.physics) {
    //       continue;
    //     }

    //     // modified floor
    //     const isModifiedFloor = !!other.physicsModifiers;

    //     // no collision
    //     if (!other.physics && !isModifiedFloor) {
    //       continue;
    //     }
    //   }
    // }

    // draw entities

    // drawEngine.drawText("Silver: " + this.gameData.silver, 24, 600, 40);

    if (controls.isEscape) {
      gameStateMachine.setState(menuState)
    }
  }
}

export const gameState = new GameState()
