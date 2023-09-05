// @ts-ignore
import * as t from '../tiles/tilemap_13k_23.json'
import { Resource } from './core/ecs/component'

export const SACK = 51
export const WAGON = 25
export const GRASS = 0
export const MEN = [67, 68, 70, 72, 74, 74, 75]
export const P_SELL = 59
export const P_SPAWN = 59
export const WOOD = 50
export const STONE = 62

export const convertResToSprite = (res: Resource): number => {
  switch (res) {
    case 'wood':
      return WOOD
    case 'stone':
      return STONE
    default:
      return 0
  }
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
