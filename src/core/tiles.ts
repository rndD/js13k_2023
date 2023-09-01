export const WALL: [number, number] = [4, 3];
export const WALL_R: [number, number] = [11, 4];
export const WALL_L: [number, number] = [9, 4];
export const DOOR_R: [number, number] = [10, 2];
export const DOOR_L: [number, number] = [11, 2];
export const FLOOR: [number, number] = [0, 0];
export const BOX: [number, number] = [3, 5];
export const BARREL: [number, number] = [10, 6];
export const SPAWN_POINT: [number, number] = [1, 5];
export const SELL_POINT: [number, number] = [0, 5];
export const STAIRS: [number, number] = [3, 3];

export const EMPTY = 0;

export const ROOM = [
  [WALL_L, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL, WALL_R],
  [
    WALL_L,
    EMPTY,
    EMPTY,
    EMPTY,
    EMPTY,
    EMPTY,
    EMPTY,
    EMPTY,
    EMPTY,
    EMPTY,
    EMPTY,
    WALL_R,
  ],
  [
    WALL_L,
    EMPTY,
    EMPTY,
    EMPTY,
    EMPTY,
    EMPTY,
    EMPTY,
    EMPTY,
    EMPTY,
    EMPTY,
    EMPTY,
    WALL_R,
  ],
  [
    WALL_L,
    EMPTY,
    EMPTY,
    EMPTY,
    EMPTY,
    EMPTY,
    EMPTY,
    EMPTY,
    EMPTY,
    EMPTY,
    EMPTY,
    WALL_R,
  ],
  [
    WALL_L,
    EMPTY,
    EMPTY,
    EMPTY,
    EMPTY,
    EMPTY,
    EMPTY,
    EMPTY,
    EMPTY,
    EMPTY,
    EMPTY,
    WALL_R,
  ],
  [
    WALL_L,
    EMPTY,
    EMPTY,
    EMPTY,
    EMPTY,
    EMPTY,
    EMPTY,
    EMPTY,
    EMPTY,
    EMPTY,
    EMPTY,
    WALL_R,
  ],
  [
    WALL_L,
    WALL,
    STAIRS,
    STAIRS,
    WALL,
    DOOR_R,
    DOOR_L,
    WALL,
    WALL,
    WALL,
    WALL,
    WALL_R,
  ],
];
