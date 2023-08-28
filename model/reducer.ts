import type { ID, Man, Sack } from '@/lib/types'

type Action = string

export interface State {
  men: Map<ID, Man>
  sacks: Map<ID, Sack>
}

const initialState: State = {
  men: new Map(),
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
