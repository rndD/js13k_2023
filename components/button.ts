import { html } from '@/lib/innerself'

interface Props {
  title: string
}

export default function Button (props: Props): string {
  return html`
    <button class='mb2 mr1 link dim bw0 light-yellow bg-light-red pointer'>
      ${props.title}
    </button>
  `
}
