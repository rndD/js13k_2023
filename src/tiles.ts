// @ts-ignore
import * as t from '../tiles/tilemap_13k_23.json'
import { Resource } from './core/ecs/component'

export const WAGON = 25
export const SACK = 50
export const GRASS = 0
export const MEN = [65, 66, 68, 70, 71]
export const P_SELL = 56
export const P_SPAWN = 57
export const TREE_BOTTOM = 6
export const TREE_TOP = 2
export const TREE_SMALL = 11
export const WELL_BOTTOM = 48
export const WELL_TOP = 45
export const CROP = 7

export const I_ARROW = 81

export const I_COIN = 46

export const I_AXE = 52
export const I_TAPKA = 54

// @ts-ignore
export const resourcesSprites: Record<Resource, number> = {
  wood: 49,
  box: 59,
  food: SACK,
  barrel: 64,
  water: 77
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
