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

export type Resource = 'flour' | 'salt' | 'trade'

export const nextPhase = createEvent<any>()
export const sendSoul = createEvent<Resource>()
export const removeSoul = createEvent<Resource>()

export const $resource = createStore({
  day: 1,
  phase: 1,
  souls: 1,
  silver: 0,
  // sacks
  flourSack: 0,
  saltSack: 0,
  maxStorageSack: 0
})
  .on(nextPhase, state => ({ ...state, phase: state.phase === 4 ? 1 : state.phase + 1 }))

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
