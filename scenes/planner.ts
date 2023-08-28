import type { State } from '@/model/store'
import { connect } from '@/model/store'
import { html } from '@/lib/innerself'

import Button from '@/components/button'
import Column from '@/components/column'
import Layout from '@/components/layout'

function Planner (props: State): string {
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
          <div>${Button('storage space')}</div>
          <div>${Button('buy land')}</div>
          <div>${Button('buy axe')}</div>
        `,
        'Build and upgrade'
      )}
      ${Column(
        html`
          <div>${Button('storage space')}</div>
          <div>${Button('buy land')}</div>
          <div>${Button('buy axe')}</div>
        `,
        'Build and upgrade'
      )}
    `
  )
}

export default connect(Planner)
