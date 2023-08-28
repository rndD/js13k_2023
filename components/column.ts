import { html } from '@/lib/innerself'

export default function Column (
  content: string,
  title: string
): string {
  return html`
    <div class='fl w-third ph1 pv2'>
      <div class='pa2 bg-light-yellow'>
        <div class='mb3 tc'>${title}</div>
        ${content}
      </div>
    </div>
  `
}
