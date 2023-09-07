/* eslint-disable max-classes-per-file */
import { Entity, System } from '@/lib/ecs'
import {
  Clickable,
  Mov,
  Pos,
  ResourceSource
} from '../component'
import { controls } from '../../controls'
import {
  tileSizeUpscaled
} from '../../draw-engine'
import {
  isPointerIn
} from '@/lib/physics'
import { createFreight } from '../helpers'

export class ClickSystem extends System {
  componentsRequired = new Set<Function>([Clickable, Pos])
  prevMouse = false
  nextClickIn = 0
  clickTime = 500

  click (entity: Entity): void {
    const comps = this.ecs.getComponents(entity)

    const resS = comps.get(ResourceSource)
    const pos = comps.get(Pos)

    if (resS) {
      const e = this.ecs.addEntity()

      createFreight([pos.x, pos.y + tileSizeUpscaled / 2], 'freight', 1, 'wood').forEach((c) => {
        this.ecs.addComponent(e, c)
      })
      const mov = this.ecs.getComponents(e).get(Mov)
      mov.dx = 0
      mov.dy = 1.5

      this.ecs.ee.emit('gether', entity)
    }
  }

  update (entities: Set<Entity>): void {
    const mousePos = controls.mousePosition

    for (const entity of entities) {
      const comps = this.ecs.getComponents(entity)
      const pos = comps.get(Pos)
      const cl = comps.get(Clickable)
      cl.hovered = isPointerIn(mousePos, {
        x: pos.x,
        y: cl.withTop ? pos.y - tileSizeUpscaled : pos.y,
        w: tileSizeUpscaled,
        h: cl.withTop ? tileSizeUpscaled * 2 : tileSizeUpscaled
      })

      if (cl.hovered && this.prevMouse !== controls.isMouseDown) {
        if (this.nextClickIn <= 0) {
          this.click(entity)
          this.nextClickIn = this.clickTime
        }
      }
    }

    if (this.nextClickIn > 0) {
      this.nextClickIn -= this.ecs.currentDelta
    }

    this.prevMouse = controls.isMouseDown
  }
}
