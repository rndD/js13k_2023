import { Component } from '@/lib/ecs'
import {
  Collidable,
  Draggable,
  EntityType,
  GameObject,
  Layers,
  Mov,
  Physical,
  Player,
  Pos,
  Renderable,
  Soundable
} from './component'
import { tileSizeUpscaled } from '../draw-engine'

// helper functions to create entities
export const createObstacle = (
  pos: DOMPoint,
  sprite: [number, number],
  type: EntityType,
  angle?: number
): Component[] => {
  return [
    new GameObject(type),
    new Pos(pos.x, pos.y),
    new Renderable(sprite, Layers.Objects, angle),
    new Collidable({ w: tileSizeUpscaled, h: tileSizeUpscaled })
  ]
}

export const createFloor = (
  pos: DOMPoint,
  sprite: [number, number],
  type: EntityType,
  angle?: number
): Component[] => {
  return [
    new GameObject(type),
    new Pos(pos.x, pos.y),
    new Renderable(sprite, Layers.Floor, angle)
  ]
}

export const alwaysOnTop = (
  pos: DOMPoint,
  sprite: [number, number],
  type: EntityType
): Component[] => {
  return [
    new GameObject(type),
    new Pos(pos.x, pos.y),
    new Renderable(sprite, Layers.AlwaysOnTop)
  ]
}

export const createFreight = (
  pos: DOMPoint,
  sprite: [number, number],
  type: EntityType,
  price?: number,
  physics?: {
    mass: number;
    friction: number;
  }
): Component[] => {
  // add price
  return [
    new GameObject(type),
    new Pos(pos.x, pos.y),
    new Renderable(sprite, Layers.Objects),
    new Collidable({ w: tileSizeUpscaled, h: tileSizeUpscaled }),
    new Draggable(),
    new Mov(),
    new Physical({ mass: physics?.mass, friction: physics?.friction }),
    new Soundable({})
  ]
}

export const createTranspansiveObj = (
  pos: DOMPoint,
  sprite: [number, number],
  type: 'door'
): Component[] => {
  return [
    new GameObject(type),
    new Pos(pos.x, pos.y),
    new Renderable(sprite, Layers.Floor)
  ]
}

export const createPlayer = (
  pos: DOMPoint,
  sprite: [number, number],
  type: 'player'
): Component[] => {
  return [
    new GameObject(type),
    new Pos(pos.x, pos.y),
    new Player(),
    new Mov(),
    new Renderable(sprite, Layers.Objects),
    // new Collidable({ w: tileSizeUpscaled, h: tileSizeUpscaled }),
    new Physical({ friction: 0.9 })
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

// export const createSellPoint = (pos: DOMPoint): Component[] => {
//   return {
//     id: getId(),
//     pos,
//     sprite: [0, 5],
//     type: "sellPoint",
//     layer: Layers.Points,
//     gameData: {},
//   };
// };

// export const createModifiedFloor = (
//   pos: DOMPoint,
//   sprite: [number, number],
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
