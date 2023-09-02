import { Layers } from "../layers";
import { Component } from "@/lib/ecs";
import {
  Collidable,
  Draggable,
  GameObject,
  Mov,
  Physical,
  Pos,
  Renderable,
} from "./component";
import { tileSizeUpscaled } from "../draw-engine";

export type EntityType =
  | "wall"
  | "door"
  | "crate"
  | "sellPoint"
  | "spawnPoint"
  | "stairs"
  | "ice";

// helper functions to create entities
export const createObstacle = (
  pos: DOMPoint,
  sprite: [number, number],
  type: EntityType
): Component[] => {
  return [
    new GameObject(type),
    new Pos(pos.x, pos.y),
    new Renderable(sprite, Layers.Objects),
    new Collidable({ w: tileSizeUpscaled, h: tileSizeUpscaled }),
  ];
};

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
  ];
};

export const createTranspansiveObj = (
  pos: DOMPoint,
  sprite: [number, number],
  type: "door"
): Component[] => {
  return [
    new GameObject(type),
    new Pos(pos.x, pos.y),
    new Renderable(sprite, Layers.Floor),
  ];
};

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
