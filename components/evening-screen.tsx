import { useStore } from 'effector-react'
import * as React from 'react'

import {
  nextPhase,
  $resource
} from '@/lib/model'
import { delay } from '@/lib/delay'
import Button from '@/components/button'
import Modal from '@/components/modal'
import Time from '@/components/time'

export default function EveningScreen (): React.JSX.Element | null {
  const { phase } = useStore($resource)

  const [progress, setProgress] = React.useState(0)

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
    <section className='mw8 ph4 pv3 center relative'>
      <Time className='fr' />
      {phase === 3 &&
        <div className='i'>красивая анимация{'.'.repeat(progress)}</div>}
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
