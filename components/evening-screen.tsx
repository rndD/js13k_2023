import { useStore } from 'effector-react'
import * as React from 'react'

import {
  nextPhase,
  $resource,
  $schedule,
  $souls,
  sellFlourSack,
  sellSaltSack,
  createFlourSack,
  createSaltSack

} from '@/lib/model'
import { delay } from '@/lib/delay'
import Button from '@/components/button'
import Modal from '@/components/modal'
import Time from '@/components/time'

export default function EveningScreen (): React.JSX.Element | null {
  const { phase, silver, saltSack, flourSack, maxStorageSack } = useStore($resource)
  const { flourSouls, saltSouls, tradeSouls } = useStore($schedule)

  const [progress, setProgress] = React.useState(0)

  React.useEffect(() => {
    if (flourSouls > 0) {
      createFlourSack(flourSouls)
    }
    if (saltSouls > 0) {
      createSaltSack(saltSouls)
    }
    if (tradeSouls > 0) {
      if (saltSack > 0) {
        sellSaltSack(tradeSouls)
      }
      if (flourSack > 0) {
        sellFlourSack(tradeSouls)
      }
    }
  }, [progress])

  React.useEffect(() => {
    if (phase === 3) {
      /* eslint-disable @typescript-eslint/no-floating-promises */
      ;(async () => {
        const time = 500
        setProgress(0)
        await delay(time)
        setProgress(v => v + 1)
        await delay(time)
        setProgress(v => v + 1)
        await delay(time)
        setProgress(v => v + 1)
        await delay(time)
        nextPhase()
        setProgress(0)
      })()
      /* eslint-enable @typescript-eslint/no-floating-promises */
    }
  }, [phase])

  if (phase !== 3 && phase !== 4) return null

  return (
    <section className='mw8 mh4 ph4 pv3 center relative'>
      <Time className='fr' />
      {phase === 3 &&
        <div className='i'>красивая анимация{'.'.repeat(progress)}</div>}
      <div> Серебро: {silver}</div>
      <div> Соль: {saltSack}</div>
      <div> Мука: {flourSack}</div>
      <div> Место на складе: {maxStorageSack}</div>
      {phase === 4 &&
        <Modal>
          Поработал — молодец!
          <div className='mt3 tc'>
            <Button onClick={nextPhase} title='Понятно' />
          </div>
        </Modal>}
    </section>
  )
}
