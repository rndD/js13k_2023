import { SPAWN_POINT } from "@/core/tiles";
import { Layers } from "./layers";

export type Moveable = {
  dx: number;
  dy: number;
};

type EntityType = "wall" | "door" | "crate" | "sellPoint" | "spawnPoint";

// FIXME should be split into multiple granular interfaces and unioned
export interface Entity {
  id: number;

  pos: DOMPoint;
  moveable?: Moveable;

  hovered?: boolean;
  dragged?: boolean;
  draggebale?: boolean;

  sprite: [number, number]; // x, y in tilemap
  type: EntityType;

  gameData?: {
    price?: number;
    occupiedBy?: number;
    timers?: {
      nextSpawn?: number;
      spawnInterval?: number;
    };
  };

  physics?: {
    mass?: number;
    friction?: number;
  };

  layer: Layers;
}

let id = 0;
export const getId = () => {
  return id++;
};

// helper functions to create entities
export const createObstacle = (
  pos: DOMPoint,
  sprite: [number, number],
  type: EntityType
): Entity => {
  return {
    id: getId(),
    pos,
    sprite,
    type,
    physics: { mass: 1000, friction: 0 },
    layer: Layers.Objects,
  };
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
): Entity => {
  return {
    id: getId(),
    pos,
    sprite,
    type,
    draggebale: true,
    moveable: { dx: 0, dy: 0 },
    gameData: { price },
    physics: { mass: physics?.mass ?? 1, friction: physics?.friction ?? 0.98 },
    layer: Layers.Objects,
  };
};

export const createTranspansiveObj = (
  pos: DOMPoint,
  sprite: [number, number],
  type: "door"
): Entity => {
  return {
    id: getId(),
    pos,
    sprite,
    type,
    layer: Layers.Floor,
  };
};

export const createSpawnPoint = (pos: DOMPoint): Entity => {
  return {
    id: getId(),
    pos,
    sprite: SPAWN_POINT,
    type: "spawnPoint",
    layer: Layers.Points,
    gameData: {
      timers: {
        nextSpawn: 3000,
        spawnInterval: 5000,
      },
    },
  };
};

export const createSellPoint = (pos: DOMPoint): Entity => {
  return {
    id: getId(),
    pos,
    sprite: [0, 5],
    type: "sellPoint",
    layer: Layers.Points,
    gameData: {},
  };
};
