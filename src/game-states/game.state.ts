import { controls } from '@/core/controls'
import { gameStateMachine } from '@/game-state-machine'
import { menuState } from '@/game-states/menu.state'
import { getGridPointInPixels } from '@/lib/utils'

import {
  createFloor,
  createFreight,
  createObstacle,
  createAlwaysOnTop
} from '@/core/ecs/helpers'

import { Component, ECS } from '@/lib/ecs'
import {
  DragSystem,
  MoveSystem,
  ParticleSystem,
  PhysicsSystem
} from '@/core/ecs/system'
import { State } from '@/core/state-machine'
import { SACK, TileInfo, WAGON, map } from '@/tiles'
import { Layers, RenderSystem } from '@/core/ecs/systems/render'
import { CollideSystem } from '@/core/ecs/systems/collide'
import { tileSizeUpscaled } from '@/core/draw-engine'
import { BuyerSystem } from '@/core/ecs/systems/ai'
import { SoundSystem } from '@/core/ecs/systems/sound'

// test only
const createMap = () => {
  const ec: Component[][] = []
  const startX = 0
  const startY = 0
  const ls: [TileInfo[], Layers][] = [[map.floor, Layers.Floor], [map.walls, Layers.Objects], [map.top, Layers.AlwaysOnTop]]
  ls.forEach(([ld, layer]) =>
    ld.forEach(({ tile, x, y, rot, flipX }: TileInfo) => {
      const point = getGridPointInPixels(x + startX, y + startY)
      const components: Component[] = []
      if (tile === -1) {
        return
      }

      switch (layer) {
        case Layers.Floor:
          components.push(...createFloor(point, tile, 'floor'))
          break
        case Layers.Objects:
          components.push(...createObstacle(point, tile, 'wall'))
          break
        case Layers.AlwaysOnTop:
          components.push(...createAlwaysOnTop(point, tile, 'roof'))
          break
      }

      ec.push(components)
    })
  )

  return ec
}

class GameState implements State {
  ecs: ECS

  constructor () {
    this.ecs = new ECS()
    this.ecs.addSystem(new DragSystem())
    this.ecs.addSystem(new CollideSystem())
    this.ecs.addSystem(new PhysicsSystem())
    this.ecs.addSystem(new ParticleSystem())
    this.ecs.addSystem(new BuyerSystem())
    this.ecs.addSystem(new MoveSystem())
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
    this.addEntities(
      createFreight(getGridPointInPixels(15, 10), SACK, 'freight'),
      createFreight(getGridPointInPixels(4, 6), SACK, 'freight'),
      createFreight(getGridPointInPixels(10, 10), WAGON, 'freight', tileSizeUpscaled - 2, tileSizeUpscaled - 2, 0, { mass: 100, friction: 0.1 })
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
