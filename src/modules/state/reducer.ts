import { initState } from './init'
import { MainState, Resource } from './state.types'

export default function reducer (
  state: MainState = initState,
  action: string,
  args: any[]
) {
  switch (action) {
    case 'NEXT_SCENE': {
      const [value] = args
      let scene
      if (state.scene === 'morning') {
        scene = 'planing'
      }

      return Object.assign({}, state, {
        scene
      })
    }
    case 'ADD_MONEY': {
      console.log('ADD_MONEY')
      const [value] = args
      return Object.assign({}, state, {
        money: state.money + value
      })
    }
    case 'PLANING_ADD_MAN': {
      const { level, type } = args[0] as unknown as {
        level: number
        type: Resource
      }

      if (!state.planing[type]) {
        state.planing[type] = {}
      }
      if (!state.planing[type][level]) {
        state.planing[type][level] = 0
      }
      state.planing[type][level] += 1

      return Object.assign({}, state, {})
    }
    default:
      return state
  }
}
