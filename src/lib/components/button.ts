import { html } from '../innerself'

interface Props {
  children: string
  onClick?: string
  disabled?: boolean
}

export const ButtonComponent = (props: Props) => {
  const disabled = props.disabled ? 'disabled' : ''
  const onClick = props.onClick
    ? `onclick="${props.onClick.replaceAll('"', "'")}"`
    : ''
  return html`<button class="" ${disabled} ${onClick}>
    ${props.children}
  </button>`
}
