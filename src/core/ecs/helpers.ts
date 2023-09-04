import { Component } from '@/lib/ecs'
import {
  Collidable,
  Draggable,
  EntityType,
  FloorPoint,
  GameObject,
  Mov,
  Physical,
  Pos,
  Renderable,
  Soundable
} from './component'
import { tileSizeUpscaled } from '../draw-engine'
import { Layers } from './systems/render'
import { SELL_P } from '@/tiles'

// helper functions to create entities
export const createObstacle = (
  [x, y]: [number, number],
  sprite: number,
  type: EntityType,
  w = tileSizeUpscaled, h = tileSizeUpscaled,
  angle?: number
): Component[] => {
  return [
    new GameObject(type),
    new Pos(x, y),
    new Renderable(sprite, Layers.Objects, angle),
    new Collidable({ w, h })
  ]
}

export const createFloor = (
  [x, y]: [number, number],
  sprite: number,
  type: EntityType,
  angle?: number
): Component[] => {
  return [
    new GameObject(type),
    new Pos(x, y),
    new Renderable(sprite, Layers.Floor, angle)
  ]
}

export const createAlwaysOnTop = (
  [x, y]: [number, number],
  sprite: number,
  type: EntityType
): Component[] => {
  return [
    new GameObject(type),
    new Pos(x, y),
    new Renderable(sprite, Layers.AlwaysOnTop)
  ]
}

export const createFreight = (
  [x, y]: [number, number],
  sprite: number,
  type: EntityType,
  w = tileSizeUpscaled - 8, h = tileSizeUpscaled - 8,
  price?: number,
  physics?: {
    mass: number;
    friction: number;
  }
): Component[] => {
  // add price
  return [
    new GameObject(type),
    new Pos(x, y),
    new Renderable(sprite, Layers.Objects),
    new Collidable({ w, h }),
    new Draggable(),
    new Mov(),
    new Physical({ mass: physics?.mass, friction: physics?.friction }),
    new Soundable({})
  ]
}

export const createTranspansiveObj = (
  [x, y]: [number, number],
  sprite: number,
  type: 'door'
): Component[] => {
  return [
    new GameObject(type),
    new Pos(x, y),
    new Renderable(sprite, Layers.Floor)
  ]
}

// Fixme rework it into ecs
// export const createSpawnPoint = (pos: DOMPoint): Component[] => {
//   return {
//     id: getId(),
//     pos,
//     sprite: SPAWN_POINT,
//     type: "spawnPoint",
//     layer: Layers.Points,
//     gameData: {
//       timers: {
//         nextSpawn: 3000,
//         spawnInterval: 5000,
//       },
//     },
//   };
// };

export const createSellPoint = ([x, y]: [number, number]): Component[] => {
  return [
    new GameObject('sellPoint'),
    new Pos(x, y),
    new Renderable(SELL_P, Layers.Points),
    new FloorPoint()
  ]
}

// export const createModifiedFloor = (
//   pos: DOMPoint,
//   sprite: number,
//   type: "stairs" | "ice",
//   modifiers: Entity["physicsModifiers"]
// ): Component[] => {
//   return {
//     id: getId(),
//     pos,
//     sprite,
//     type: type,
//     layer: Layers.Floor,
//     physicsModifiers: modifiers,
//     gameData: {},
//   };
// };
