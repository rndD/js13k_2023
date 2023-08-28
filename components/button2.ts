import { html } from '@/lib/innerself'

interface Props {
  children: string
  onClick?: string
  disabled?: boolean
}

// не уверен что нужен но пока сохраню
/* eslint-disable */
export const ButtonComponent2 = (props: Props) => {
  const disabled = props.disabled ? 'disabled' : ''
  const onClick = props.onClick
    ? `onclick="${props.onClick.replaceAll('"', "'")}"`
    : ''
  return html`<button class="" ${disabled} ${onClick}>
    ${props.children}
  </button>`
}
