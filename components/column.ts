import { html } from '@/lib/innerself'

export default function Column (
  content?: string | null,
  title?: string | null,
  smallColumn?: boolean
): string {
  return html`
    <div class='fl w-third ph1 ${smallColumn ? 'pt2 pb0' : 'pv2'}'>
      ${content != null
        ? `<div class='${smallColumn ? 'h3' : 'h5'} pa2 bg-light-yellow'>
            ${title != null ? `<div class='mb3 tc'>${title}</div>` : ''}
            ${content}
          </div>`
        : ''}
    </div>
  `
}
