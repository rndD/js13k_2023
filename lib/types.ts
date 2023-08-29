export type ID = string

export type ActivityType =
  | ''
  | 'salt'
  | 'trade'

export type ResourceType =
  | 'salt'
  | 'stone'
  | 'weapon'
  | 'wheat'
  | 'wood'

export interface ManType {
  id: ID
  level: 1 | 2 | 3
}

export interface SackType {
  id: ID
  resource: ResourceType
  value: number
}

export interface PlannerActivityType {
  manID: ID
  type: ActivityType
}

export type Action = string

export type Scene = 'menu' | 'cards' | 'planner' | 'day' | 'gameover' | 'result'

// in progress
interface Upgrade {
  type: string
  level: number
  effects?: Record<string, number> // type // not sure if needed
  cost?: number
  costResource?: Record<ResourceType, number>
  requiredLvl?: number
}

// in progress
interface Card {
  name: string
  effects: Record<string, number> // type
  duration: number
  level: number
}

// in progress
interface StorageState {
  resources: Record<ResourceType, number>
}

export interface State {
  day: number
  silver: number

  scene: Scene

  tribute: {
    nextIn: number
    silver: number
  }

  xp: number
  lvl: number

  upgrades: Upgrade[]

  activities: PlannerActivityType[]

  men: Map<ID, ManType>

  sacks: Map<ID, SackType>

  // in progress
  storage: StorageState

  // in progress
  activeCards: Card[]
}
