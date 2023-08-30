export type Moveable = {
  dx: number;
  dy: number;
};

export interface Entity {
  id: number;
  pos: DOMPoint;
  moveable?: Moveable;
  dragged?: boolean;
  draggebale?: boolean;
  sprite: [number, number]; // x, y in tilemap
  type: string; // ? () =>
  physics?: {
    mass?: number;
    friction?: number;
  };
}

let id = 0;
export const getId = () => {
  return id++;
};
