import type { ActivityType } from '@/lib/types'

import { createStore } from '@/lib/innerself'
import { reducer } from './reducer'

type Dispatch =
  | ((action: 'ADD_ACTIVITY', id: string, activity: ActivityType) => void)

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    dispatch: Dispatch
  }
}

const { attach, connect, dispatch } = createStore(reducer)
window.dispatch = dispatch
export { attach, connect }
