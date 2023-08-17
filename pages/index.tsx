import { useStore } from 'effector-react'
import * as React from 'react'

import { $main, $souls, $modifiers } from '@/lib/model'
import Radio from '@/components/radio'

const activities = [
  { title: 'Добыча', value: 'collect' },
  { title: 'Продажа', value: 'trade' }
]

export default function Home (): React.JSX.Element {
  const [activity, setActivity] = React.useState(activities[0].value)

  const { day, silver } = useStore($main)
  const souls = useStore($souls)

  React.useEffect(() => {
    //
  }, [activity])

  return (
    <section className='mw7 pv3 center'>
      <div className='mb4'> День {day}, серебро {silver} </div>

      <div className='fl w-third pr2'>
        Души
        <ul>
          {souls.map(soul => (
            <li key={soul.id}>
              {soul.type === 'player' ? 'Барин' : 'Холоп'}
            </li>
          ))}
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
        <div className='mt3'>
          <button>Поехали</button>
        </div>
        <div className='mt3'>
          <button>Улучшения</button>
        </div>
      </div>
    </section>
  )
}
