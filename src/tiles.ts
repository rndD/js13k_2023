// @ts-ignore
import * as t from '../tiles/tilemap_13k_23.json'
import { Resource } from './core/ecs/component'

export const WAGON = 24
export const ANVIL = 51
export const SACK = 46
export const GRASS = 0
export const CITIZENS = [53, 55, 57, 54]
export const P_SELL = 47
export const P_SPAWN = 48
export const TREE_BOTTOM = 6
export const TREE_TOP = 2
export const WELL_BOTTOM = 44
export const WELL_TOP = 42
export const CROP = 7

export const I_ARROW_HAND = 62
export const I_FIST_HAND = 63
export const I_PICKUP_HAND = 64

export const I_COIN = 43

export const SIGN = 39

export const CYCLOP = 56
export const CRAB = 57

export const DOOR = 41

// @ts-ignore
export const resourcesSprites: Record<Resource, number> = {
  [Resource.wood]: 45,
  [Resource.box]: 49,
  [Resource.food]: SACK,
  [Resource.barrel]: 52,
  [Resource.water]: 58
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
type MapInfo = {
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

export const map:MapInfo = {
  floor: m.floor,
  walls: m.walls,
  top: m.top
}
