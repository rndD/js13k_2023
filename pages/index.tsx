import { useStore } from 'effector-react'
import * as React from 'react'

import {
  soulPrice,
  $main, $sacks, $souls, $outcome,
  buySoul, commit, resetModifiers, setModifier,
  createCollectModifier, createTradeModifier
} from '@/lib/model'
import Radio from '@/components/radio'

const activities = [
  { title: 'Добыча', value: 'collect' },
  { title: 'Продажа', value: 'trade' }
]

export default function Home (): React.JSX.Element {
  const [activity, setActivity] = React.useState(activities[0].value)

  const { day, silver } = useStore($main)
  const sacks = useStore($sacks)
  const souls = useStore($souls)
  const outcome = useStore($outcome)

  function _updateModifiers (): undefined {
    resetModifiers()
    switch (activity) {
      case 'collect':
        souls.forEach(soul => {
          if (['player', 'employee'].includes(soul.type)) {
            setModifier(createCollectModifier(soul))
          }
        })
        break
      case 'trade':
        souls.forEach(soul => {
          if (['player', 'employee'].includes(soul.type)) {
            setModifier(createTradeModifier(soul))
          }
        })
        break
    }
  }

  React.useEffect(() => {
    _updateModifiers()
  }, [activity])

  return (
    <section className='mw7 pv3 center'>
      <div className='mb4'>День {day}, серебро {silver}</div>

      <div className='fl w-third pr2'>
        Души
        <ul>
          {souls.map(soul => {
            const sack = sacks.find(s => s.id === soul.sackID)

            return (
              <li key={soul.id}>
                {soul.type === 'player' ? 'Барин' : 'Холоп'}
                {sack != null ? `: ${sack.value}кг соли` : ''}
              </li>
            )
          })}
        </ul>
      </div>

      <div className='fl w-third pr2'>Склад</div>

      <div className='fl w-third pr2'>
        План
        <div className='mv3'>
          <Radio
            name='activity'
            onChange={setActivity}
            options={activities}
            value={activity}
          />
        </div>
        <div className='mt4'>
          Результат:
          <ul>
            {outcome.map((str, index) => (
              <li key={`${index}${str}`}>{str}</li>
            ))}
          </ul>
        </div>
        <div className='mt3'>
          <button onClick={commit}>Поехали</button>
        </div>
      </div>

      <div className='cf' />

      <div className='mv4'>
        Улучшения
        <ul>
          <li>
            Души: {souls.length - 1}{' '}
            <button
              onClick={() => {
                if (silver >= soulPrice) {
                  buySoul('employee')
                  _updateModifiers()
                }
              }}
            >
              +1 за {soulPrice}
            </button>
          </li>
        </ul>
      </div>
    </section>
  )
}
