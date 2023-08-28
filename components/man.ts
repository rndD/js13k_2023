import type { ManType } from '@/lib/types'
import { html } from '@/lib/innerself'

export default function Man (man: ManType): string {
  return html`
    <span class='mr1 grab' draggable='true' id='${man.id}'>👨🏻‍💼</span>
  `
}
