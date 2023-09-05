// @ts-ignore
import * as t from '../tiles/tilemap_13k_23.json'

export const SACK = 51
export const WAGON = 25
export const GRASS = 0
export const MEN = [67, 68, 70, 72, 74, 74, 75]
export const SELL_P = 59

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
