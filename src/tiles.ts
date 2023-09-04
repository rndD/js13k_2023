// tile coordinates from file: public/tiles.png
// sprite size 8x4, numbers represent tile position (left to right)

// @ts-ignore
import * as t from '../tiles/tilemap_13k_23.json'

export const SACK = 57
export const WAGON = 27
export const GRASS = 0
export const MAN = 13

type MapSchema = {
  tileswide: number;
  tileshigh: number;
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
  tileswide: number;
  tileshigh: number;
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
  tileswide: tilemap.tileswide,
  tileshigh: tilemap.tileshigh,
  floor: m.floor,
  walls: m.walls,
  top: m.top
}
