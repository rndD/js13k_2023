import type { ID, ActivityType, ManType, PlannerActivityType, SackType } from '@/lib/types'
import { generateID } from '@/lib/generate'

type Action = string

export interface State {
  day: number
  silver: number

  activities: PlannerActivityType[]
  men: Map<ID, ManType>
  sacks: Map<ID, SackType>
}

const playerID = generateID()
const initialState: State = {
  day: 1,
  silver: 0,

  activities: [],
  men: new Map([[playerID, { id: playerID }]]),
  sacks: new Map()
}

export function reducer (
  state: State = initialState,
  action: Action,
  params: string[]
): State {
  switch (action) {
    case 'ADD_ACTIVITY': {
      const [id, activity] = params as [ID, ActivityType]

      if (activity === '') {
        // remove
        state.activities = state.activities.filter(a => a.manID !== id)
      } else {
        // add
        state.activities = state.activities
          .filter(a => a.manID !== id)
          .concat({ manID: id, type: activity })
      }

      return state
    }

    default:
      return state
  }
}
