import { createEvent, createStore } from 'effector'

// Наименование:
// - события начинаются с глагола

// Данные:
// - день
// - фаза дня
// - количество душ
// - серебро
// - соль, n мешков
// - муку, n мешков
// - склад, n мешков

// Доп:
// - переход из одного состояние в другое
//   - цены, покупка
// - модификаторы

// Prices
export const saltPrice = 1
export const flourPrice = 2
export const storagePrice = 5
export const soulPrice = 10

export type Resource = 'flour' | 'salt' | 'trade'

export const nextPhase = createEvent<any>()

export const sendSoul = createEvent<Resource>()
export const removeSoul = createEvent<Resource>()

export const buySoul = createEvent<number>()

export const createFlourSack = createEvent<number>()
export const createSaltSack = createEvent<number>()
export const sellFlourSack = createEvent<number>()
export const sellSaltSack = createEvent<number>()

export const upgradeStorage = createEvent<number>()

export const $resource = createStore({
  day: 1,
  phase: 1,
  souls: 1,
  silver: 0,
  // sacks
  flourSack: 0,
  saltSack: 0,
  maxStorageSack: 1
})
  .on(nextPhase, state => {
    return ({ ...state, phase: state.phase === 4 ? 1 : state.phase + 1 })
  })
  .on(createFlourSack, (state, count) => {
    const c = state.flourSack + count + state.saltSack
    if (state.maxStorageSack < c) {
      return state
    }
    return { ...state, flourSack: state.flourSack + count }
  })
  .on(createSaltSack, (state, count) => {
    const c = state.flourSack + count + state.saltSack
    if (state.maxStorageSack < c) {
      return state
    }
    return { ...state, saltSack: state.saltSack + count }
  })
  .on(sellFlourSack, (state, count) => {
    if (state.flourSack < count) {
      count = state.flourSack
    }

    return ({ ...state, flourSack: state.flourSack - count, silver: state.silver + count * flourPrice })
  })
  .on(sellSaltSack, (state, count) => {
    if (state.saltSack < count) {
      count = state.saltSack
    }
    return { ...state, saltSack: state.saltSack - count, silver: state.silver + count * saltPrice }
  })
  .on(upgradeStorage, (state) => {
    const price = storagePrice
    if (state.silver < price) {
      return state
    }
    return ({ ...state, maxStorageSack: state.maxStorageSack + 1, silver: state.silver - price })
  })
  .on(buySoul, (state) => {
    const price = soulPrice
    if (state.silver < price) {
      return state
    }
    return ({
      ...state,
      souls: state.souls + 1,
      silver: state.silver - price
    })
  })

export const $schedule = createStore({
  flourSouls: 0,
  saltSouls: 0,
  tradeSouls: 0
})
  .on(sendSoul, (state, resourceType: Resource) => {
    switch (resourceType) {
      case 'flour': return ({ ...state, flourSouls: state.flourSouls + 1 })
      case 'salt': return ({ ...state, saltSouls: state.saltSouls + 1 })
      case 'trade': return ({ ...state, tradeSouls: state.tradeSouls + 1 })
    }
  })
  .on(removeSoul, (state, resourceType: Resource) => {
    switch (resourceType) {
      case 'flour': return { ...state, flourSouls: state.flourSouls - 1 }
      case 'salt': return { ...state, saltSouls: state.saltSouls - 1 }
      case 'trade': return ({ ...state, tradeSouls: state.tradeSouls - 1 })
    }
  })

// Производные

export const $time = $resource.map(store => ({
  dayOfWeek: (store.day - 1) % 7 + 1,
  week: Math.floor((store.day - 1) / 7) + 1
}))

export const $souls = $resource.map(store => ({ barin: 1, souls: store.souls - 1 }))
