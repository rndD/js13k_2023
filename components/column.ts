import { html } from '@/lib/innerself'

interface Props {
  content: string
  title: string
}

export default function Column (props: Props): string {
  return html`
    <div class='fl w-third ph1 pv2'>
      <div class='pa2 bg-light-yellow'>
        <div class='mb3 tc'>${props.title}</div>
        ${props.content}
      </div>
    </div>
  `
}
