import { combine, createEvent, createStore, sample } from 'effector'
import { generateID } from './generate'
import { invariant } from './invariant'

// Наименование:
// - события начинаются с глагола

export const commit = createEvent<any>('commit')
export const reset = createEvent('reset')
export const resetModifiers = createEvent('resetModifiers')
export const setModifier = createEvent<Modifier>('setModifier')
export const updateStores = createEvent('updateStores')

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

export const $main = createStore({ day: 1, silver: 0 }, { name: '$main' })
  .on(reset, _ => ({ day: 1, silver: 0 }))
  .on(updateStores, (_, event: any) => event.nextMain != null ? event.nextMain : _)

export const $sacks = createStore<Sack[]>([], { name: '$sacks' })
  .on(updateStores, (_, event: any) => event.nextSacks != null ? event.nextSacks : _)

export const $souls = createStore<Soul[]>([], { name: '$souls' })
  .on(reset, _ => [{ id: generateID(), type: 'player', sackID: null }])
  .on(updateStores, (_, event: any) => event.nextSouls != null ? event.nextSouls : _)

export const $modifiers = createStore<Modifier[]>([], { name: '$modifiers' })
  .on(reset, _ => [])
  .on(resetModifiers, _ => [])
  .on(setModifier, (_modifiers, m) => _modifiers.concat(m))

export const $shared = combine({
  main: $main,
  sacks: $sacks,
  souls: $souls,
  modifiers: $modifiers
})

export const $outcome = $shared.map(({ sacks, souls, modifiers }) =>
  modifiers.map(m => {
    const soul = souls.find(soul => soul.id === m.soulID)
    const sack = sacks.find(sack => sack.id === soul?.sackID)
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
  }))

/**
 * обновление в конце дня
 * - добыча
 *   - считаем по людям содержимое мешка и докручиваем до 25
 *   - при необходимости создаем новый мешок
 * - продажа
 *   - считаем по людям содержимое мешка и отнимаем 10
 *   - за каждые 10 пропорционально накидываем 5 серебра
 */
sample({
  // clock - событие, которое запускает пересчет
  clock: commit,
  // source - источник с данными, который передается в fn
  source: $shared,
  fn: ({ main, sacks, souls, modifiers }) => {
    // копия исходных
    const nextMain = { day: main.day + 1, silver: main.silver }
    const nextSacks = sacks.slice()
    const nextSouls = souls.slice()
    modifiers.forEach(m => {
      const soulIndex = nextSouls.findIndex(soul => soul.id === m.soulID)
      const sackIndex = nextSacks.findIndex(sack => sack.id === nextSouls[soulIndex]?.sackID)
      switch (m.change) {
        case 'CS': {
          if (sackIndex > -1) {
            nextSacks[sackIndex] = { ...nextSacks[sackIndex], value: 25 }
          } else if (soulIndex > -1) {
            // нет мешка, создаем
            const sack: Sack = { id: generateID(), resource: 'salt', value: 25 }
            nextSouls[soulIndex] = { ...nextSouls[soulIndex], sackID: sack.id }
            nextSacks.push(sack)
          }
          break
        }
        case 'SS':
          if (sackIndex > -1) {
            const valueToConsume = Math.min(nextSacks[sackIndex].value, 10)
            const silverToGain = Math.floor(valueToConsume / 2)
            if (valueToConsume === nextSacks[sackIndex].value) {
              // удаляем мешок
              nextSacks.splice(sackIndex, 1)
              nextSouls[soulIndex] = { ...nextSouls[soulIndex], sackID: null }
            } else {
              // обновляем содержимое
              nextSacks[sackIndex] = {
                ...nextSacks[sackIndex],
                value: nextSacks[sackIndex].value - valueToConsume
              }
            }
            nextMain.silver += silverToGain
          }
          break
        default:
          invariant(false, `missing case for outcome: ${m.change}`)
      }
    })
    return { nextMain, nextSacks, nextSouls }
  },
  // результат fn передается в target и создает новый ивент с данными
  target: updateStores
})

// Модификаторы
export function createCollectModifier (soul: Soul): Modifier {
  return { change: 'CS', soulID: soul.id }
}

export function createTradeModifier (soul: Soul): Modifier {
  return { change: 'SS', soulID: soul.id }
}

// Инициализация
reset()
