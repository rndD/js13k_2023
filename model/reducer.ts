import type { ID, ManType, PlannerActivityType, SackType } from '@/lib/types'
import { generateID } from '@/lib/generate'

type Action = string

export interface State {
  activities: PlannerActivityType[]
  men: Map<ID, ManType>
  sacks: Map<ID, SackType>
}

const playerID = generateID()
const initialState: State = {
  activities: [],
  men: new Map([[playerID, { id: playerID }]]),
  sacks: new Map()
}

export function reducer (
  state: State = initialState,
  action: Action,
  params: unknown
): State {
  switch (action) {
    case 'ADD_ACTIVITY': {
      const [id, activity] = params

      if (activity === '') {
        // remove
        state.activities = state.activities.filter(a => a.manID !== id)
      } else {
        // add
        state.activities = state.activities.concat({ manID: id, type: activity })
      }

      return state
    }

    default:
      return state
  }
}
