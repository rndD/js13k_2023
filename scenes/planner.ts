import type { ManType } from '@/lib/types'
import type { State } from '@/model/store'
import { connect } from '@/model/store'
import { html } from '@/lib/innerself'
import { values } from '@/lib/util'
import nullthrows from '@/lib/nullthrows'

import Button from '@/components/button'
import Column from '@/components/column'
import Layout from '@/components/layout'
import Slots from '@/components/slots'
import Title from '@/components/title'

function Planner (props: State): string {
  console.log('nextState', props)

  const availableMen = values(props.men)
    .filter(man => !props.activities.some(a => a.manID === man.id))
  const traders: ManType[] = props.activities.filter(a => a.type === 'trade')
    .map(a => nullthrows(props.men.get(a.manID)))
  const miners: ManType[] = props.activities.filter(a => a.type === 'salt')
    .map(a => nullthrows(props.men.get(a.manID)))

  return Layout(
    html`
      ${Column(
        html`
          <div>${Button('storage space')}</div>
          <div>${Button('buy land')}</div>
          <div>${Button('buy axe')}</div>
        `,
        'Build and upgrade'
      )}
      ${Column(
        html`
          ${Slots(availableMen)}
          ${Title('Trade')}
          ${Slots(traders, 'trade')}
          ${Title('Salt mines')}
          ${Slots(miners, 'salt')}
        `,
        'Plan work for a day'
      )}
      ${Column(
        html``,
        'Storage'
      )}
    `
  )
}

export default connect(Planner)
