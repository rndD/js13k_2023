// tile coordinates from file: public/tiles.png
// sprite size 8x4, numbers represent tile position (left to right)
export const Tiles: {[tile: string]: number} = {
  F_TABLE_0: 28,
  F_TABLE_1: 20,

  R_VERTICAL: 24,
  R_CROSS: 25,

  S_ENTRANCE_0: 18,
  S_ENTRANCE_1: 10,
  S_ENTRANCE_2: 2,
  S_TOWER_0: 16,
  S_TOWER_1: 8,
  S_WALL: 17,

  T_BIRCH: 11,
  T_FIR: 3,

  U_ROOF_HORIZONTAL: 19,
  U_ROOF_VERTICAL: 27,
  U_WALL: 26,

  W_SHORE: 0,
  W_DEPTH: 1,

  BRIDGE: 9
}

export const FLOOR: [number, number] = [4, 0]

export const BOX: [number, number] = [6, 3]
export const SACK_W: [number, number] = [7, 2]
export const SACK_R: [number, number] = [6, 2]

// export const SPAWN_POINT: [number, number] = [1, 5];
// export const SELL_POINT: [number, number] = [0, 5];
// export const STAIRS: [number, number] = [3, 3];
export const EMPTY = 0

export const MAP = [
  [
    null, null, null, null, null, null,
    null, null, Tiles.T_FIR, Tiles.T_BIRCH, null, null,
    Tiles.R_VERTICAL
  ],
  [
    null, Tiles.T_BIRCH, Tiles.T_FIR, Tiles.T_FIR, null, null,
    null, null, null, null, null, Tiles.T_FIR,
    Tiles.R_VERTICAL, Tiles.T_BIRCH, null, Tiles.T_BIRCH, null, Tiles.T_FIR
  ],
  [
    null, null, null, null, null, null,
    null, null, null, null, null, null,
    Tiles.S_ENTRANCE_0
  ],
  [
    Tiles.W_SHORE, Tiles.W_SHORE, Tiles.W_SHORE, Tiles.W_SHORE, Tiles.W_SHORE, Tiles.W_SHORE,
    Tiles.W_SHORE, Tiles.W_SHORE, Tiles.W_SHORE, Tiles.W_SHORE, Tiles.W_SHORE, Tiles.W_SHORE,
    Tiles.W_SHORE, Tiles.W_SHORE, Tiles.W_SHORE, Tiles.W_SHORE, Tiles.W_SHORE, Tiles.W_SHORE
  ],
  [
    Tiles.W_DEPTH, Tiles.W_DEPTH, Tiles.W_DEPTH, Tiles.W_DEPTH, Tiles.W_DEPTH, Tiles.W_DEPTH,
    Tiles.W_DEPTH, Tiles.W_DEPTH, Tiles.W_DEPTH, Tiles.W_DEPTH, Tiles.W_DEPTH, Tiles.W_DEPTH,
    Tiles.W_DEPTH, Tiles.W_DEPTH, Tiles.W_DEPTH, Tiles.W_DEPTH, Tiles.W_DEPTH, Tiles.W_DEPTH
  ],
  [
    [Tiles.W_SHORE, 180], [Tiles.W_SHORE, 180], [Tiles.W_SHORE, 180], [Tiles.W_SHORE, 180], [Tiles.W_SHORE, 180], [Tiles.W_SHORE, 180],
    [Tiles.W_SHORE, 180], [Tiles.W_SHORE, 180], [Tiles.W_SHORE, 180], [Tiles.W_SHORE, 180], [Tiles.W_SHORE, 180], [Tiles.W_SHORE, 180],
    [Tiles.W_SHORE, 180], [Tiles.W_SHORE, 180], [Tiles.W_SHORE, 180], [Tiles.W_SHORE, 180], [Tiles.W_SHORE, 180], [Tiles.W_SHORE, 180]
  ],
  [
    null, null, null, null, null, null,
    null, null, null, null, null, null,
    Tiles.S_ENTRANCE_0, null, null, Tiles.T_BIRCH
  ],
  [
    null, null, null, null, null, null,
    null, null, null, null, null, null,
    Tiles.R_VERTICAL
  ],
  [
    null, null, null, null, null, null,
    null, null, null, null, null, null,
    Tiles.R_VERTICAL
  ],
  [
    null, null, null, null, null, null,
    null, null, null, null, null, null,
    Tiles.R_VERTICAL
  ],
  [
    null, null, null, null, null, null,
    null, null, null, null, null, null,
    Tiles.R_VERTICAL
  ],
  [
    null, null, null, null, null, null,
    null, null, null, null, null, null,
    Tiles.R_VERTICAL
  ],
  [
    null, null, null, null, null, null,
    null, null, null, null, null, null,
    Tiles.R_VERTICAL
  ],
  [
    [Tiles.R_VERTICAL, 90], [Tiles.R_VERTICAL, 90], [Tiles.R_VERTICAL, 90], [Tiles.R_VERTICAL, 90], [Tiles.R_VERTICAL, 90], [Tiles.R_VERTICAL, 90],
    [Tiles.R_VERTICAL, 90], [Tiles.R_VERTICAL, 90], [Tiles.R_VERTICAL, 90], [Tiles.R_VERTICAL, 90], [Tiles.R_VERTICAL, 90], [Tiles.R_VERTICAL, 90],
    [Tiles.R_CROSS, 270], [Tiles.R_VERTICAL, 90], [Tiles.R_VERTICAL, 90], [Tiles.R_VERTICAL, 90], [Tiles.R_VERTICAL, 90], [Tiles.R_VERTICAL, 90]
  ]
]

export const MAP_2 = [
  null,
  null,
  null,
  [
    null, null, null, null, null, null,
    null, null, null, null, null, null,
    Tiles.BRIDGE
  ],
  [
    null, null, null, null, null, null,
    null, null, null, null, null, null,
    Tiles.BRIDGE
  ],
  [
    null, null, null, null, null, null,
    null, null, null, null, null, null,
    Tiles.BRIDGE
  ]
]

export const WALLS = [
  [
    null, null, Tiles.U_WALL, Tiles.U_WALL, null, null,
    null, null, null, null, null, null,
    null, null, null, Tiles.U_WALL, Tiles.U_WALL, Tiles.U_WALL
  ],
  null,
  [
    Tiles.S_TOWER_0, Tiles.S_WALL, Tiles.S_WALL, Tiles.S_WALL, Tiles.S_TOWER_0, Tiles.S_WALL,
    Tiles.S_WALL, Tiles.S_WALL, Tiles.S_TOWER_0, Tiles.S_WALL, Tiles.S_WALL, Tiles.S_WALL,
    null, Tiles.S_WALL, Tiles.S_WALL, Tiles.S_WALL, Tiles.S_TOWER_0, Tiles.S_WALL
  ],
  null,
  null,
  null,
  [
    Tiles.U_WALL, Tiles.U_WALL, Tiles.U_WALL, Tiles.U_WALL, Tiles.U_WALL, Tiles.U_WALL,
    Tiles.U_WALL, Tiles.U_WALL, Tiles.U_WALL, Tiles.U_WALL, null, Tiles.S_WALL,
    null, Tiles.S_WALL
  ],
  [
    Tiles.U_WALL, null, null, null, null, null,
    null, null, null, Tiles.U_WALL
  ],
  [
    Tiles.U_WALL, null, null, null, null, null,
    null, null, null, null, null, Tiles.F_TABLE_1
  ],
  [
    Tiles.U_WALL, null, null, null, null, null,
    null, null, null, null, null, Tiles.F_TABLE_0
  ],
  [
    Tiles.U_WALL, null, null, null, null, null,
    null, null, null, Tiles.U_WALL
  ],
  [
    Tiles.U_WALL, null, null, null, null, null,
    null, null, null, Tiles.U_WALL
  ],
  [
    Tiles.U_WALL, Tiles.U_WALL, Tiles.U_WALL, Tiles.U_WALL, Tiles.U_WALL, Tiles.U_WALL,
    Tiles.U_WALL, Tiles.U_WALL, Tiles.U_WALL, Tiles.U_WALL
  ]
]

export const TOP = [
  [
    null, null, null, null, null, null,
    null, null, null, null, null, null,
    Tiles.S_ENTRANCE_2
  ],
  [
    Tiles.S_TOWER_1, null, null, null, Tiles.S_TOWER_1, null,
    null, null, Tiles.S_TOWER_1, null, null, null,
    Tiles.S_ENTRANCE_1, null, null, null, Tiles.S_TOWER_1
  ],
  null,
  null,
  null,
  [
    Tiles.U_ROOF_VERTICAL, Tiles.U_ROOF_HORIZONTAL, Tiles.U_ROOF_HORIZONTAL, Tiles.U_ROOF_HORIZONTAL, Tiles.U_ROOF_HORIZONTAL, Tiles.U_ROOF_HORIZONTAL,
    Tiles.U_ROOF_HORIZONTAL, Tiles.U_ROOF_HORIZONTAL, Tiles.U_ROOF_HORIZONTAL, Tiles.U_ROOF_VERTICAL, null, null,
    Tiles.S_ENTRANCE_2
  ],
  [
    Tiles.U_ROOF_VERTICAL, null, null, null, null, null,
    null, null, null, Tiles.U_ROOF_VERTICAL
  ],
  [
    Tiles.U_ROOF_VERTICAL
  ],
  [
    Tiles.U_ROOF_VERTICAL
  ],
  [
    Tiles.U_ROOF_VERTICAL, null, null, null, null, null,
    null, null, null, Tiles.U_ROOF_VERTICAL
  ],
  [
    Tiles.U_ROOF_VERTICAL, null, null, null, null, null,
    null, null, null, Tiles.U_ROOF_VERTICAL
  ],
  [
    Tiles.U_ROOF_VERTICAL, Tiles.U_ROOF_HORIZONTAL, Tiles.U_ROOF_HORIZONTAL, Tiles.U_ROOF_HORIZONTAL, Tiles.U_ROOF_HORIZONTAL, Tiles.U_ROOF_HORIZONTAL,
    Tiles.U_ROOF_HORIZONTAL, Tiles.U_ROOF_HORIZONTAL, Tiles.U_ROOF_HORIZONTAL, Tiles.U_ROOF_VERTICAL
  ]
]
