import { combine, createEvent, createStore } from 'effector'
import { generateID } from './generate'

// Наименование:
// - события начинаются с глагола

const reset = createEvent()

type SoulType = 'player' | 'employee' | 'storage'
type ResourceType = 'flour' | 'salt'

interface Soul {
  id: string
  type: SoulType
  sackID: string | null
}

interface Sack {
  id: string
  type: ResourceType
  amount: number
}

export const $main = createStore({
  day: 1,
  silver: 0
}, { name: '$main' })
  .on(reset, _ => ({ day: 1, silver: 0 }))

export const $sacks = createStore<Sack[]>([])

export const $souls = createStore<Soul[]>([], { name: '$souls' })
  .on(reset, _ => [{ id: generateID(), type: 'player', sackID: null }])

export const $modifiers = createStore([])

export const $outcome = combine(
  $main, $souls, $modifiers,
  () => ({})
)

// Модификаторы
function createCollectModifier () {}

function createTradeModifier () {}

// Инициализация
reset()
