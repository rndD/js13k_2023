import type { ID, ActivityType, State, Action } from '@/lib/types'
import { initialState } from './init'

export function reducer (
  state: State = initialState,
  action: Action,
  params: any[]
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
    case 'ADD_SILVER': {
      const [value] = params as [number]
      state.silver += value
      return state
    }

    default:
      return state
  }
}
