import type { ActivityType, ManType } from '@/lib/types'
import { html } from '@/lib/innerself'

import Man from './man'

export default function Slots (
  men: ManType[],
  activity?: ActivityType
): string {
  return html`
    <div class='slots' data-activity='${activity ?? ''}'>
      ${men.map(Man)}
      &nbsp;
    </div>
  `
}
