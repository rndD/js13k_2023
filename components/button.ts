import { html } from '@/lib/innerself'

export default function Button (title: string): string {
  return html`
    <button class='mb2 mr1 link dim bw0 light-yellow bg-light-red pointer'>
      ${title}
    </button>
  `
}
