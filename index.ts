import type { ActivityType } from './lib/types'
import { attach } from './model/store'

import Planner from './scenes/planner'
import nullthrows from './lib/nullthrows'

attach(Planner, nullthrows(document.querySelector('#root')))

;[
  function dragstart (e: DragEvent) {
    const t = e.target as HTMLElement

    if (t.classList.contains('grab')) {
      t.style.opacity = '0.5'
      e.dataTransfer?.setData('id', t.id)
    }
  },

  function drop (e: DragEvent) {
    const t = e.target as HTMLElement

    if (t.classList.contains('slots')) {
      e.stopPropagation()

      const id = e.dataTransfer?.getData('id') as string
      const activity = nullthrows(t.dataset.activity) as ActivityType

      window.dispatch('ADD_ACTIVITY', id, activity)
    }
  },

  function dragend (e: DragEvent) {
    const t = e.target as HTMLElement

    if (t.classList.contains('grab')) {
      t.style.opacity = '1'
    }
  },

  function dragover (e: DragEvent) {
    const t = e.target as HTMLElement

    if (t.classList.contains('slots')) {
      e.preventDefault() // required
      t.classList.add('bg-yellow')

      return false
    }
  },

  function dragleave (e: DragEvent) {
    const t = e.target as HTMLElement

    if (t.classList.contains('slots')) {
      t.classList.remove('bg-yellow')
    }
  }
].forEach(fn => {
  document.body.addEventListener(fn.name, fn as any)
})
