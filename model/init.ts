import { generateID } from '@/lib/generate'
import { State } from '@/lib/types'

export const playerID = generateID()
export const initialState: State = {
  scene: 'planner',
  day: 1,
  silver: 0,

  activities: [],
  men: new Map([
    [playerID, { id: playerID, level: 2 }],
    // test
    ['a', { id: 'a', level: 1 }],
    ['ab', { id: 'ab', level: 1 }]
  ]),
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
