export type Moveable = {
  dx: number;
  dy: number;
};

type EntityType = "wall" | "door" | "crate";

export interface Entity {
  id: number;
  pos: DOMPoint;
  hovered?: boolean;
  moveable?: Moveable;
  dragged?: boolean;
  draggebale?: boolean;
  sprite: [number, number]; // x, y in tilemap
  type: EntityType;
  gameData?: {
    price?: number;
  };
  physics?: {
    mass?: number;
    friction?: number;
  };
}

let id = 0;
export const getId = () => {
  return id++;
};

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
  };
};
