import { Obstacles, Physics, Resource } from '@/core/ecs/component'

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
  [Resource.wood]: 3,
  [Resource.food]: 1,
  [Resource.barrel]: 11,
  [Resource.box]: 6,
  [Resource.water]: 2
}
