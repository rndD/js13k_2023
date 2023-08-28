import type { ActivityType } from './lib/types'
import {attach} from './model/store'
import Planner from './scenes/planner'

attach(Planner, document.querySelector('#root'))

;[
  function dragstart(e) {
    const elem = e.target
    if (!elem?.classList.contains('grab')) return

    elem.style.opacity = 0.5
    e.dataTransfer.setData('id', elem.id)
  },
  function drop(e) {
    const elem = e.target
    if (!elem?.classList.contains('slots')) return
    e.stopPropagation()

    const id = e.dataTransfer.getData('id')
    const activity: ActivityType = elem.dataset.activity
    window.dispatch('ADD_ACTIVITY', id, activity)
  },

  function dragend(e) {
    const elem = e.target
    if (!elem?.classList.contains('grab')) return

    elem.style.opacity = 1
  },
  function dragover(e) {
    const elem = e.target
    if (!elem?.classList.contains('slots')) return
    e.preventDefault() // required

    elem.classList.add('bg-yellow')

    return false
  },
  function dragleave(e) {
    const elem = e.target
    if (!elem?.classList.contains('slots')) return

    elem.classList.remove('bg-yellow')
  },
].forEach(fn => {
  document.body.addEventListener(fn.name, fn)
})