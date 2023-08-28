import type { ID, ManType, SackType } from '@/lib/types'
import { generateID } from '@/lib/generate'

type Action = string

export interface State {
  men: Map<ID, ManType>
  sacks: Map<ID, SackType>
}

const playerID = generateID()
const initialState: State = {
  men: new Map([[playerID, { id: playerID }]]),
  sacks: new Map()
}

export function reducer (
  state: State = initialState,
  action: Action,
  params: unknown
): State {
  switch (action) {
    default:
      return state
  }
}
