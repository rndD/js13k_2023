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
  amount: number
}

// увеличить ресурс
// увеличить ресурс + потратить денеги
interface Modifier {
  visible: boolean
  soulID?: string
  changes: Array<{ action: 'modify' | 'set', resource: ResourceType, value: number }>
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
    .flatMap(m => {
      const soul = _souls.find(soul => soul.id === m.soulID)
      const sack = _sacks.find(sack => sack.id === soul?.sackID)
      return m.changes.map(change => {
        switch (change.resource) {
          case 'silver':
            invariant(change.action === 'modify')
            return `Серебро ${change.value > 0 ? '+' : '-'}${change.value}`
          default:
            if (sack != null) {
              if (sack.resource !== change.resource) {
                return 'Без изменений'
              } else {
                const value = change.value
                return `Соль ${value > 0 ? '+' : '-'}${value}`
              }
            }

            if (change.action === 'set') {
              const value = change.value - (sack?.amount ?? 0)
              return `Соль ${value > 0 ? '+' : '-'}${value}`
            }

            invariant(false, `unexpected change: ${change.action}/${change.resource}`)
        }
      })
    })
    .filter(Boolean)
)

// Модификаторы
export function createCollectModifier (soul: Soul): Modifier {
  return {
    visible: true,
    soulID: soul.id,
    changes: [
      { action: 'set', resource: 'salt', value: 25 }
    ]
  }
}

export function createTradeModifier (soul: Soul): Modifier {
  return {
    visible: true,
    soulID: soul.id,
    changes: [
      { action: 'modify', resource: 'salt', value: 10 },
      { action: 'modify', resource: 'silver', value: 5 }
    ]
  }
}

// Инициализация
reset()
