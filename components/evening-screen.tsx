import { useStore } from 'effector-react'
import * as React from 'react'

import { $resource } from '@/lib/model'
import Time from '@/components/time'

export default function MorningScreen (): React.JSX.Element | null {
  const { phase } = useStore($resource)
  if (phase !== 3 && phase !== 4) return null

  return (
    <section className=''>
      <Time />
    </section>
  )
}
