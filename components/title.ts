import { html } from '@/lib/innerself'

export default function Title (title: string): string {
  return html`
    <div class='mv3 tc'>
      ${title}
    </div>
  `
}
