import { getGridPointInPixels } from '@/lib/grid'
import { tileSizeUpscaled } from './pixels'

export const GAME_ROUND = 6 * 60 * 1000
export const levelsByTime = [
  60 * 2, // 2 min
  60 * 4, // 4 min
  60 * 5 // 5 min
].map(x => x * 1000)

const xyYard = getGridPointInPixels(15, 4)
export const YARD = {
  x: xyYard[0],
  y: xyYard[1],
  w: 12 * tileSizeUpscaled,
  h: 9 * tileSizeUpscaled
}

export const DROP_POINTS : { [key:string]: number} = {
  '14,5': 1, // TL
  '14,10': 1, // TL
  '19,3': -1, // LT
  '20,3': -1, // RT
  '27,11': 2 // RB
}
export const INITIAL_MONEY = 30
export const HIRE_PRICE = 3
export const MAX_HIRE = 3
export const GYM_PRICE = 5
export const MAX_GYM = 3
