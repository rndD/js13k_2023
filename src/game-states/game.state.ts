import { controls } from '@/core/controls'
import { gameStateMachine } from '@/game-state-machine'
import { menuState } from '@/game-states/menu.state'
import { getGridPointInPixels } from '@/lib/utils'

import {
  createFloor,
  createFreight,
  createObstacle,
  createAlwaysOnTop,
  createSellPoint,
  createTree,
  createWell,
  createCrop,
  createMovingObstacle
} from '@/core/ecs/helpers'

import { Component, ECS } from '@/lib/ecs'
import { State } from '@/core/state-machine'
import { ANVIL, TileInfo, WAGON, map } from '@/tiles'
import { Layers, RenderSystem } from '@/core/ecs/systems/render'
import { CollideSystem } from '@/core/ecs/systems/collide'
import { SoundSystem } from '@/core/ecs/systems/sound'
import { ParticleSystem } from '@/core/ecs/systems/particles'
import { PointSystem } from '@/core/ecs/systems/point'
import { DragSystem, MoveSystem, PhysicsSystem } from '@/core/ecs/systems/move'
import { ClickSystem } from '@/core/ecs/systems/click'
import { GameDataSystem, SellSystem } from '@/core/ecs/systems/gameplay'
import { Events } from '@/core/ecs/events'

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
          components.push(...createFloor(point, tile))
          break
        case Layers.Objects:
          components.push(...createObstacle(point, tile))
          break
        case Layers.AlwaysOnTop:
          components.push(...createAlwaysOnTop(point, tile))
          break
      }

      ec.push(components)
    })
  )

  return ec
}

class GameState implements State {
  ecs: ECS
  stop = false

  constructor () {
    this.ecs = new ECS()
    this.ecs.addSystem(new ClickSystem())
    this.ecs.addSystem(new DragSystem())
    this.ecs.addSystem(new CollideSystem())
    this.ecs.addSystem(new PhysicsSystem())
    this.ecs.addSystem(new ParticleSystem())
    this.ecs.addSystem(new MoveSystem())
    this.ecs.addSystem(new PointSystem())
    this.ecs.addSystem(new SellSystem())
    this.ecs.addSystem(new RenderSystem())
    this.ecs.addSystem(new SoundSystem())
    this.ecs.addSystem(new GameDataSystem())

    this.ecs.ee.on(Events.gameOver, (score: Number) => {
      this.stop = true
      // eslint-disable-next-line
      alert(`Game over! Your score is ${score}`)
      gameStateMachine.setState(menuState)
    })
  }

  addEntities (...entitiesComponents: Component[][]) {
    for (const ec of entitiesComponents) {
      const entity = this.ecs.addEntity()
      for (const c of ec) {
        this.ecs.addComponent(entity, c)
      }
    }
  }

  // Make sure ball starts at the same spot when game is entered
  onEnter () {
    this.addEntities(
      createFreight(getGridPointInPixels(25, 10), 'wood'),
      createFreight(getGridPointInPixels(14, 6), 'box'),
      // createFreight(getGridPointInPixels(20, 10), WAGON, 'freight', tileSizeUpscaled - 2, tileSizeUpscaled - 2, 0, { mass: 100, friction: 0.1 }),
      createSellPoint(getGridPointInPixels(20, 12)),
      createSellPoint(getGridPointInPixels(19, 12)),

      // trees
      createTree(getGridPointInPixels(8, 7)),
      // well
      createWell(getGridPointInPixels(28, 8)),

      // crops
      createCrop(getGridPointInPixels(1, 5)),
      createCrop(getGridPointInPixels(2, 5)),
      createCrop(getGridPointInPixels(27, 16)),
      createCrop(getGridPointInPixels(28, 16)),
      createCrop(getGridPointInPixels(11, 0)),

      // Obstacles
      createMovingObstacle(getGridPointInPixels(20, 10), WAGON, 1000, 0.5),
      createMovingObstacle(getGridPointInPixels(19, 8), WAGON, 1000, 0.5),
      createMovingObstacle(getGridPointInPixels(19, 13), ANVIL, 2000, 0.4)

    )

    // this.addEntity(createSellPoint(getGridPointInPixels(new DOMPoint(10, 4))));

    // this.addEntity(
    //   createSpawnPoint(getGridPointInPixels(new DOMPoint(10, 14)))
    // );

    this.addEntities(...createMap())
  }

  onUpdate (deltaTime: number) {
    if (this.stop) {
      return
    }
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

export const getGameState = () => new GameState()
