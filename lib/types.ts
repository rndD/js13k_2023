export type ID = string

export type Resource =
  | 'salt'
  | 'stone'
  | 'weapon'
  | 'wheat'
  | 'wood'

export interface Man {
  id: ID
}

export interface Sack {
  id: ID
  resource: Resource
  value: number
}

export interface Activity {
  activity: ''
  manID: ID
}
