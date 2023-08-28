import type { ManType, State } from '@/lib/types'
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
      <div class='cf'>
        ${Column()}
        ${Column(
          html`
            Day ${props.day}
            Silver ${props.silver}
          `,
          null,
          true
        )}
        ${Column()}
      </div>
      <div class='cf'>
        ${Column(
          html`
            <div>${Button({ children: 'storage space' })}</div>
            <div>${Button({ children: 'buy land' })}</div>
            <div>${Button({ children: 'buy axe' })}</div>
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
      </div>
    `
  )
}

export default connect(Planner)
