// tile coordinates from file: public/tiles.png
export const WALL_WOOD: [number, number] = [2, 3]
export const ROOF_W_V: [number, number] = [3, 3]
export const ROOF_W: [number, number] = [3, 2]

export const FLOOR: [number, number] = [4, 0]

export const WATER_SHORE: [number, number] = [0, 0]
export const WATER: [number, number] = [1, 0]

export const BRIDGE: [number, number] = [1, 1]
export const STONE_WALL: [number, number] = [1, 2]
export const STONE_WALL_BIG: [number, number] = [0, 1]
export const STONE_WALL_BIG_TOP: [number, number] = [0, 2]
export const STONE_WALL_ENTRANCE: [number, number] = [2, 2]
export const STONE_WALL_ENTRANCE_TOP: [number, number] = [2, 1]
export const STONE_WALL_ENTRANCE_TOP_FLAG: [number, number] = [2, 0]

export const ROAD: [number, number] = [0, 3]
export const ROAD_CROSS: [number, number] = [1, 3]

export const WOODEN_WALL: [number, number] = [2, 3]
export const WOODEN_WALL_ROOF: [number, number] = [3, 3]
export const WOODEN_WALL_ROOF_H: [number, number] = [3, 2]

export const TREE_FIR: [number, number] = [3, 0]
export const TREE_BIRCH: [number, number] = [3, 1]

export const BOX: [number, number] = [6, 3]
export const SACK_W: [number, number] = [7, 2]
export const SACK_R: [number, number] = [6, 2]

// export const SPAWN_POINT: [number, number] = [1, 5];
// export const SELL_POINT: [number, number] = [0, 5];
// export const STAIRS: [number, number] = [3, 3];
export const EMPTY = 0

export const MAP = [
  [
    EMPTY, EMPTY, WOODEN_WALL, WOODEN_WALL, EMPTY, EMPTY,
    EMPTY, EMPTY, TREE_FIR, TREE_BIRCH, EMPTY, EMPTY,
    ROAD, EMPTY, EMPTY, WOODEN_WALL, WOODEN_WALL, WOODEN_WALL
  ],
  [
    STONE_WALL_BIG_TOP, TREE_BIRCH, TREE_FIR, TREE_FIR, STONE_WALL_BIG_TOP, EMPTY,
    EMPTY, EMPTY, STONE_WALL_BIG_TOP, EMPTY, EMPTY, TREE_FIR
  ]
]

export const ROOM = [
  [
    WALL_WOOD,
    WALL_WOOD,
    WALL_WOOD,
    WALL_WOOD,
    WALL_WOOD,
    WALL_WOOD,
    WALL_WOOD,
    WALL_WOOD,
    WALL_WOOD,
    WALL_WOOD,
    WALL_WOOD,
    WALL_WOOD
  ],
  [
    WALL_WOOD,
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
    WALL_WOOD
  ],
  [
    WALL_WOOD,
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
    WALL_WOOD
  ],
  [
    WALL_WOOD,
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
    WALL_WOOD
  ],
  [
    WALL_WOOD,
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
    WALL_WOOD
  ],
  [
    WALL_WOOD,
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
    WALL_WOOD
  ],
  [
    WALL_WOOD,
    WALL_WOOD,
    EMPTY,
    EMPTY,
    WALL_WOOD,
    EMPTY,
    EMPTY,
    WALL_WOOD,
    WALL_WOOD,
    WALL_WOOD,
    WALL_WOOD,
    WALL_WOOD
  ]
]
