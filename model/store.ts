import { createStore } from '@/lib/innerself'
import { reducer } from './reducer'
export type { State } from './reducer'

declare global {
  interface Window {
    dispatch: any
  }
}

const { attach, connect, dispatch } = createStore(reducer)
window.dispatch = dispatch
export { attach, connect }
