import { html } from '@/lib/innerself'

interface Props {
  content: string
}

export default function Layout (props: Props): string {
  return html`
    <section class='mw8 ma4 ph1 cf center bg-green'>
      ${props.content}
    </section>
  `
}
