/* eslint-disable max-classes-per-file */
import { Entity, System } from '@/lib/ecs'
import {
  Clickable,
  Draggable,
  Mov,
  Physical,
  Pos
} from '../component'
import { controls } from '@/core/controls'

// can be part of move system?
export class PhysicsSystem extends System {
  componentsRequired = new Set<Function>([Mov, Physical])
  update (entities: Set<Entity>): void {
    for (const entity of entities) {
      const comps = this.ecs.getComponents(entity)
      const mov = comps.get(Mov)
      const phys = comps.get(Physical)

      const defaultFriction = 0.95
      mov.dx *= phys.data.friction || defaultFriction
      mov.dy *= phys.data.friction || defaultFriction
    }
  }
}

export class MoveSystem extends System {
  componentsRequired = new Set<Function>([Mov, Pos])
  update (entities: Set<Entity>): void {
    for (const entity of entities) {
      const comps = this.ecs.getComponents(entity)
      const mov = comps.get(Mov)
      const pos = comps.get(Pos)

      pos.x += mov.dx
      pos.y += mov.dy

      // stops if value is too small
      if (Math.abs(mov.dx) < 0.01) {
        mov.dx = 0
      }
      if (Math.abs(mov.dy) < 0.01) {
        mov.dy = 0
      }
    }
  }
}

export class DragSystem extends System {
  componentsRequired = new Set<Function>([Mov, Pos, Draggable, Clickable])
  dragging = -1

  update (entities: Set<Entity>): void {
    const mousePos = controls.mousePosition

    for (const entity of entities) {
      const comps = this.ecs.getComponents(entity)
      const pos = comps.get(Pos)
      const drag = comps.get(Draggable)
      const cl = comps.get(Clickable)

      if (cl.hovered && !drag.dragging && this.dragging === -1) {
        if (controls.isMouseDown) {
          drag.dragging = true
          this.ecs.ee.emit('pickup', entity)
          this.dragging = entity
        }
      }

      if (!controls.isMouseDown && drag.dragging) {
        drag.dragging = false
        this.ecs.ee.emit('drop', entity)
        this.dragging = -1
      }

      if (drag.dragging) {
        const mov = comps.get(Mov)
        mov.dx = (mousePos.x - pos.x) / 50 // FIXME: use mass and mouse force
        mov.dy = (mousePos.y - pos.y) / 50
      }
    }
  }
}
