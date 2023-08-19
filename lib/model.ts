import { combine, createEvent, createStore } from 'effector'
import { generateID } from './generate'
import { invariant } from './invariant'

// Наименование:
// - события начинаются с глагола

export const reset = createEvent()
export const resetModifiers = createEvent()
export const setModifier = createEvent<Modifier>()

type SoulType = 'player' | 'employee' | 'storage'
type ResourceType = 'flour' | 'salt' | 'silver'

interface Soul {
  id: string
  type: SoulType
  sackID: string | null
}

interface Sack {
  id: string
  resource: ResourceType
  value: number
}

/**
 * CF - собрать муку
 * CS - собрать соль
 * SF - продать муку
 * SS - продать соль
 */
interface Modifier {
  change: 'CF' | 'SF' | 'CS' | 'SS'
  soulID?: string
}

export const $main = createStore({
  day: 1,
  silver: 0
}, { name: '$main' })
  .on(reset, _ => ({ day: 1, silver: 0 }))

export const $sacks = createStore<Sack[]>([], { name: '$sacks' })

export const $souls = createStore<Soul[]>([], { name: '$souls' })
  .on(reset, _ => [{ id: generateID(), type: 'player', sackID: null }])

export const $modifiers = createStore<Modifier[]>([], { name: '$modifiers' })
  .on(reset, _ => [])
  .on(resetModifiers, _ => [])
  .on(setModifier, (_modifiers, m) => _modifiers.concat(m))

export const $outcome = combine(
  $main, $sacks, $souls, $modifiers,
  (_main, _sacks, _souls, _modifiers) => _modifiers
    .map(m => {
      const soul = _souls.find(soul => soul.id === m.soulID)
      const sack = _sacks.find(sack => sack.id === soul?.sackID)
      switch (m.change) {
        case 'CS': {
          const value = sack != null ? 25 - sack.value : 25
          return `Соль +${value}`
        }
        case 'SS': {
          const value = Math.min(sack?.value ?? 0, 10)
          const silver = Math.floor(value / 2)
          return `Соль -${value}, серебро +${silver}`
        }
      }
      invariant(false, `missing case for outcome: ${m.change}`)
    })
    .filter(Boolean)
)

// Модификаторы
export function createCollectModifier (soul: Soul): Modifier {
  return { change: 'CS', soulID: soul.id }
}

export function createTradeModifier (soul: Soul): Modifier {
  return { change: 'SS', soulID: soul.id }
}

// Инициализация
reset()
