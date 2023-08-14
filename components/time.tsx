import { useStore } from 'effector-react'
import * as React from 'react'

import { $time } from '@/lib/model'

const days = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс']

interface Props {
  className?: string
}

export default function Time (props: Props): React.JSX.Element {
  const { dayOfWeek, week } = useStore($time)

  return (
    <span className={props.className}>
      {week} неделя, {days[dayOfWeek - 1]}
    </span>
  )
}
