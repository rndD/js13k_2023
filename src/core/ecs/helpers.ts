import { Component } from '@/lib/ecs'
import {
  Clickable,
  Collidable,
  Draggable,
  EntityType,
  FloorPoint,
  GameObject,
  Mov,
  Physical,
  Pos,
  Renderable,
  Resource,
  ResourceSource,
  Sell
} from './component'
import { tileSizeUpscaled } from '../draw-engine'
import { Layers } from './systems/render'
import { I_AXE, P_SELL, TREE_BOTTOM, convertResToSprite } from '@/tiles'

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
  type: EntityType,
  price?: number,
  resourceType: Resource = 'wood',
  w = tileSizeUpscaled - 8, h = tileSizeUpscaled - 8,
  physics?: {
    mass: number;
    friction: number;
  }
): Component[] => {
  // add price
  return [
    new GameObject(type),
    new Pos(x, y),
    new Renderable(convertResToSprite(resourceType), Layers.Objects),
    new Collidable({ w, h }),
    new Draggable(),
    new Clickable(I_AXE),
    new Mov(),
    new Physical({ mass: physics?.mass, friction: physics?.friction }),
    new Sell(resourceType, price)
  ]
}

export const createTree = (
  [x, y]: [number, number]
): Component[] => {
  return [
    new GameObject('tree'),
    new Pos(x, y),
    new Renderable(TREE_BOTTOM, Layers.Objects),
    new Collidable({ w: tileSizeUpscaled, h: tileSizeUpscaled }),
    new ResourceSource('wood'),
    new Clickable(I_AXE, true)
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
    new Renderable(P_SELL, Layers.Points),
    new FloorPoint('sellPoint'),
    new Sell('point')
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
