import * as React from 'react'

import MorningScreen from '@/components/morning-screen'
import EveningScreen from '@/components/evening-screen'

export default function Home (): React.JSX.Element {
  return (
    <>
      <MorningScreen />
      <EveningScreen />
    </>
  )
}
