import { tileSizeUpscaled } from './core/draw-engine'
import { Obstacles, Resource, Physics } from './core/ecs/component'
import { getGridPointInPixels } from './lib/utils'

export const ResourcePhysics: Record<Resource, Physics> = {
  [Resource.wood]: { mass: 50, friction: 0.94 },
  [Resource.food]: { mass: 40, friction: 0.96 },
  [Resource.barrel]: { mass: 100, friction: 0.93 },
  [Resource.box]: { mass: 100, friction: 0.9 },
  [Resource.water]: { mass: 35, friction: 0.96 }
}
export const MovingObstaclesPhysics: Record<Obstacles, Physics> = {
  [Obstacles.anvil]: { mass: 400, friction: 0.7 },
  [Obstacles.wagon]: { mass: 400, friction: 0.9 }
}

export const ResourcesPrices: Record<Resource, number> = {
  [Resource.wood]: 2,
  [Resource.food]: 2,
  [Resource.barrel]: 10,
  [Resource.box]: 5,
  [Resource.water]: 1
}

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
  '20,3': -1// RT
}
export const INITIAL_MONEY = 30
export const HIRE_PRICE = 3
export const MAX_HIRE = 3
export const GYM_PRICE = 5
export const MAX_GYM = 3

export const HELP_COUNTER = `This is your counter, customers come here and show their shopping list
Place products from the list on the white marked area
If you provide everything on time, you will receive a tip`

export const HELP_CYCLOPS = `As everyone knows the 13th century was full of cyclops
You can hire them to carry things to your yard by clicking on the door of this house
The maximum number to hire is 3`

export const HELP_GYM = `This is a gym, here you can pump up your arm strength
This will help you to move things faster and remove unnecessary things from the yard
Max strength is 3`
