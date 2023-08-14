import * as React from 'react'

import { className } from '@/lib/classname'

interface Props {
  className?: string
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => unknown
  title: string
}

export default function Button (props: Props): React.JSX.Element {
  return (
    <button
      className={className(['ph3 pv2 dim br1 ba b--black link dib black b--black bg-white', props.className])}
      onClick={props.onClick}
    >
      {props.title}
    </button>
  )
}
