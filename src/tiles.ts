// @ts-ignore
import * as t from '../tiles/tilemap_13k_23.json'
import { Resource } from './core/ecs/component'

export const WAGON = 25
export const SACK = 49
export const GRASS = 0
export const MEN = [60, 63]
export const P_SELL = 53
export const P_SPAWN = 54
export const TREE_BOTTOM = 6
export const TREE_TOP = 2
export const TREE_SMALL = 11
export const WELL_BOTTOM = 47
export const WELL_TOP = 45
export const CROP = 7
export const WATER_FLOOR = 73

export const I_ARROW_HAND = 70
export const I_FIST_HAND = 71
export const I_PICKUP_HAND = 72

export const I_COIN = 46

export const I_AXE = 50
export const I_TAPKA = 51
export const SIGN = 40

// @ts-ignore
export const resourcesSprites: Record<Resource, number> = {
  wood: 48,
  box: 56,
  food: SACK,
  barrel: 59,
  water: 66
}

export const convertResToSprite = (res: Resource): number => {
  return resourcesSprites[res]
}

type MapSchema = {
  // FIXME remove  tileswide... etc
  layers:
    {tiles: [
      number,
      number,
      number,
      number?
    ][]
  }[]

}
const tilemap: MapSchema = t

export type TileInfo = {
  x: number;
  y: number;
  rot?: number;
  flipX?: boolean;
  tile: number;
}
type Map = {
  'floor': TileInfo[];
  'walls': TileInfo[];
  'top': TileInfo[];
}

const m = {
  floor: [],
  walls: [],
  top: []
}

for (const layer of tilemap.layers) {
  for (const t of layer.tiles) {
    const [tile, x, y, rot] = t
    // @ts-ignore
    m[layer.name].push({ x, y, rot, tile })
  }
}

export const map: Map = {
  floor: m.floor,
  walls: m.walls,
  top: m.top
}
