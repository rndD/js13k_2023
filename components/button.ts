import { html } from '@/lib/innerself'

interface Props {
  children: string
  onClick?: string
  disabled?: boolean
}

export default function Button (props: Props): string {
  const disabled = props.disabled ? 'disabled' : ''
  const onClick = props.onClick
    ? `onclick="${props.onClick.replaceAll('"', "'")}"`
    : ''
  return html`
    <button ${disabled} ${onClick} class='mb2 mr1 link dim bw0 light-yellow bg-light-red pointer'>
    ${props.children}
    </button>
  `
}
