import type { Resource } from '@/lib/model'

import { useStore } from 'effector-react'
import * as React from 'react'

import {
  sendSoul, removeSoul,
  $resource, $schedule,
  $souls
} from '@/lib/model'
import Time from '@/components/time'

export default function MorningScreen (): React.JSX.Element | null {
  const { phase, silver } = useStore($resource)
  const { souls } = useStore($souls)
  const { flourSouls, saltSouls, tradeSouls } = useStore($schedule)
  if (phase !== 1 && phase !== 2) return null

  const resources: Array<[Resource, string, number]> = [
    ['flour', 'Добыча соли:', flourSouls],
    ['salt', 'Производство муки:', saltSouls],
    ['trade', 'Продажи:', tradeSouls]
  ]

  return (
    <section className='mw8 ph4 pv3 center'>
      <Time className='fr' />

      <div>серебро: {silver}, души: {souls}</div>

      <div className='mt4'>Наряды:</div>
      <ul>
        {resources.map(([resource, label, value]) => (
          <li key={resource}>
            {label} {value}{' '}
            <button onClick={() => sendSoul(resource)}>+</button>
            <button onClick={() => removeSoul(resource)}>-</button>
          </li>
        ))}
      </ul>

      <button>За работу</button>
    </section>
  )
}
