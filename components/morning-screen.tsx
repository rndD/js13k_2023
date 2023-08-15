import {
  Resource, soulPrice, storagePrice,
  nextPhase,
  removeSoul,
  sendSoul,
  $resource,
  $schedule,
  $souls,
  buySoul,
  upgradeStorage

} from '@/lib/model'

import { useStore } from 'effector-react'
import * as React from 'react'

import Button from '@/components/button'
import Modal from '@/components/modal'
import Time from '@/components/time'

export default function MorningScreen (): React.JSX.Element | null {
  const { phase, silver, saltSack, flourSack } = useStore($resource)
  const { souls } = useStore($souls)
  const { flourSouls, saltSouls, tradeSouls } = useStore($schedule)
  if (phase !== 1 && phase !== 2) return null

  const resources: Array<[Resource, string, number]> = [
    ['flour', 'Производство муки:', flourSouls],
    ['salt', 'Добыча соли:', saltSouls],
    ['trade', 'Продажи:', tradeSouls]
  ]

  return (
    <section className='mw8 ph4 pv3 center relative'>
      <Time className='fr' />

      <div>серебро: {silver}, души: {souls}</div>
      <div>Мука: {flourSack}, Соль: {saltSack}</div>

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

      <div className='mt4 mb4'>
        <button className='mr2' onClick={buySoul}>Купить душу ({soulPrice})</button>
        <button className='mr2' onClick={upgradeStorage}>Увеличить склад ({storagePrice})</button>
      </div>

      <Button onClick={nextPhase} title='За работу' />

      {phase === 1 &&
        <Modal>
          Государь объявил неделю масленицы!
          <div className='mt3 tc'>
            <Button
              autoFocus
              onClick={nextPhase}
              title='Понятно'
            />
          </div>
        </Modal>}
    </section>
  )
}
