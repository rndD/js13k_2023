import type { ID, ActivityType, State, Action } from '@/lib/types'
import { generateID } from '@/lib/generate'

const playerID = generateID()
const initialState: State = {
  scene: 'planner',
  day: 1,
  silver: 0,

  activities: [],
  men: new Map([[playerID, { id: playerID, level: 2 }]]),
  sacks: new Map(),

  tribute: {
    nextIn: 3,
    silver: 10
  },
  xp: 0,
  lvl: 1,

  upgrades: [
    { type: 'market', level: 1 },
    { type: 'saltmine', level: 1 },
    { type: 'storage', level: 0 }
  ],

  storage: {
    resources: {
      salt: 0,
      wood: 0,
      stone: 0,
      wheat: 0,
      weapon: 0
    }
  },
  activeCards: []
}

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
