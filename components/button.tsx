import * as React from 'react'

import { className } from '@/lib/classname'

interface Props {
  autoFocus?: boolean
  className?: string
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => unknown
  title: string
}

export default function Button (props: Props): React.JSX.Element {
  const ref = React.useRef<HTMLButtonElement>(null)

  React.useEffect(() => {
    if (props.autoFocus === true) {
      ref.current?.focus()
    }
  }, [])

  return (
    <button
      autoFocus={props.autoFocus === true}
      className={className(['ph3 pv2 dim br1 ba b--black link dib black b--black bg-white', props.className])}
      onClick={props.onClick}
      ref={ref}
    >
      {props.title}
    </button>
  )
}
