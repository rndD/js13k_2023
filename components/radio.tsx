import * as React from 'react'

import emptyFunction from '@/lib/empty-function'

interface Props <T> {
  name: string
  onChange?: (value: T) => unknown
  options: Array<{ title: string, value: T }>
  value?: T
}

export default function Radio <T extends string> (props: Props<T>): React.JSX.Element[] {
  const { name, onChange = emptyFunction, value } = props

  return separate(props.options.map(option => {
    const id = `${name}_${String(option.value)}`

    return (
      <label htmlFor={id} key={String(option.value)}>
        <input
          id={id}
          checked={value === option.value}
          name={name}
          onChange={() => onChange(option.value)}
          type='radio'
          value={option.value}
        />
        {' '}{option.title}
      </label>
    )
  }), ' ')
}

function separate (
  elements: any[],
  delimiter: any
): any[] {
  return elements.reduce((r, elem, index) => {
    r.push(elem)
    if (index < elements.length - 1) r.push(delimiter)
    return r
  }, [])
}
