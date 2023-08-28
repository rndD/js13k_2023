import { html } from './lib/innerself'
import { MainState } from './modules/state/state.types'
import { attach, connect } from './modules/state/index'
import { getPixelizedEmoji } from './lib/pixelize'
import { ButtonComponent } from './lib/components/button'

const silverIconUrlBig = getPixelizedEmoji('🪙', 24)
const silverIconUrlSmall = getPixelizedEmoji('🪙', 16)

const DayComponent = connect(({ day }: { day: number }) => {
  return html`<div>
    <div class="lh-solid f-subheadline pa3 mr2">Day ${day}</div>
    <div>${TributeComponent()}</div>
  </div> `
})
const TributeComponent = connect(
  ({ tribute, nextTributeIn }: { tribute: number, nextTributeIn: number }) => {
    return html`<div class="f-headline-s pa3 mr2">
      Next Tribute ${tribute}<img src="${silverIconUrlSmall}" /> in
      ${nextTributeIn} days
    </div> `
  }
)
const MoneyComponent = connect(({ money }: { money: number }) => {
  return html`<div class="f1 lh-title pa3 mr2 ">
    ${money}

    <img src="${silverIconUrlBig}" />
  </div> `
})

const menLevel1IconUrl = getPixelizedEmoji('👨‍🌾', 36)
const menLevel2IconUrl = getPixelizedEmoji('👨‍🏭', 36)
const menLevel3IconUrl = getPixelizedEmoji('🧙🏻‍♂️', 36)
const getMenIcon = (level: number | string) => {
  let e
  switch ('' + level) {
    case '1':
      e = menLevel1IconUrl
      break
    case '2':
      e = menLevel2IconUrl
      break
    case '3':
      e = menLevel3IconUrl
      break
    default:
      throw new Error('Wrong level "' + level + '"')
  }
  return `<img src="${e}" alt="Level ${level}" class="ma1 ba bw1" />`
}

const PlaningComponent = connect(({ men, upgrades, planing }: MainState) => {
  // List men
  const ms = [men.level1, men.level2, men.level3].reduce(
    (a: string[], m: number, l: number) => {
      l = l + 1
      m = Math.max(m - (planing.salt[l] || 0), 0)
      const h = getMenIcon(l)
      return [...a, ...Array(m).fill(h)]
    },
    []
  )

  // Planing men
  const plR = Object.entries(planing).reduce((a: string[], [k, v]) => {
    const e = Object.entries(v).reduce((a: string[], [l, n]) => {
      const h = getMenIcon(l)
      return [...a, ...Array(n).fill(h)]
    }, [])

    const addBtns = [1, 2, 3].map((l) => {
      return ButtonComponent({
        children: 'Add ' + getMenIcon(l),
        onClick: `dispatch('PLANING_ADD_MAN', {level: ${l}, type: '${k}'})`
      })
    })

    const h = `
      <div>${k}:</div>
      <div class="flex">
      ${addBtns.join('')}
      <div>${e.join('')}</div>
      </div>
 `
    return [...a, h]
  }, [])

  // Upgrades
  const upR = upgrades.reduce((a: string[], u) => {
    const h = `
      <div>${u.type}:</div>
      <div class="flex">
      ${ButtonComponent({
        children: `Upgrade ${u.type} to ${u.level + 1}`,
        onClick: `dispatch('UPGRADE', {type: '${u.type}'})`
      })}
      </div>
  `
    return [...a, h]
  }, [])

  return html`<div class="flex-column w-100 ba bw3 pa1">
    <div class="flex">
      Men (${ms.length}):
      <div>
        ${ms.join(' ')}
        <div></div>
      </div>
    </div>

    <div class="flex">${plR.join(' ')}</div>
    <div class="flex-column">${upR.join(' ')}</div>
  </div>`
})

// TODO DEBUG
window.dispatch('NEXT_SCENE')

const App = connect(({ scene }: MainState) => {
  let sceneScreen: () => string = () => ''
  switch (scene) {
    case 'day':
      // sceneScreen = DayScComponent();
      break
    case 'planing':
      sceneScreen = PlaningComponent
      break
    default:
      break
  }

  return html` <div class="flex-column w-100">
    <div class="dt w-100 mw8 center flex justify-between">
      ${DayComponent()} ${MoneyComponent()}
    </div>
    <div>${sceneScreen()}</div>
  </div>`
})

attach(App, document.querySelector('#root')!)
