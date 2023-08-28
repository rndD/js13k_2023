import type { State } from '@/model/store'
import { connect } from '@/model/store'
import { html } from '@/lib/innerself'

import Button from '@/components/button'
import Column from '@/components/column'
import Layout from '@/components/layout'

function Planner (props: State): string {
  return Layout({
    content: html`
      ${Column({
        content: html`
          <div>${Button({ title: 'storage space' })}</div>
          <div>${Button({ title: 'buy land' })}</div>
          <div>${Button({ title: 'buy axe' })}</div>
        `,
        title: 'Build and upgrade'
      })}
      ${Column({
        content: html`
          <div>${Button({ title: 'storage space' })}</div>
          <div>${Button({ title: 'buy land' })}</div>
          <div>${Button({ title: 'buy axe' })}</div>
        `,
        title: 'Build and upgrade'
      })}
      ${Column({
        content: html`
          <div>${Button({ title: 'storage space' })}</div>
          <div>${Button({ title: 'buy land' })}</div>
          <div>${Button({ title: 'buy axe' })}</div>
        `,
        title: 'Build and upgrade'
      })}
    `
  })
}

export default connect(Planner)
