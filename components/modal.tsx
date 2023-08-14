import * as React from 'react'

import { className } from '@/lib/classname'

interface Props {
  children: React.ReactNode
  className?: string
}

export default function Modal (props: Props): React.JSX.Element {
  return (
    <div
      className={className([
        'ph4 pv3 absolute absolute-center ba br2 b--black bg-white',
        props.className
      ])}
    >
      {props.children}
    </div>
  )
}
