import { html } from '@/lib/innerself'

export default function Layout (content: string): string {
  return html`
    <section class='mw8 ma4 ph1 cf center bg-green'>
      ${content}
    </section>
  `
}
