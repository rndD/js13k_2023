export type ID = string

export type ActivityType =
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
