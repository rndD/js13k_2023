import type { ManType } from '@/lib/types'
import { html } from '@/lib/innerself'

const emoji = {
  1: '👨🏻‍💼',
  2: '👨🏻‍🌾',
  3: '👨🏻‍🏭'
}

export default function Man ({ id, level }: ManType): string {
  return html`
    <span class='mr1 grab' draggable='true' id='${id}'>${emoji[level]}</span>
  `
}
