/* eslint-disable max-classes-per-file */
import { Entity, System } from '@/lib/ecs'
import {
  Draggable,
  Mov,
  Particle,
  Physical,
  Pos,
  Renderable
} from './component'
import { controls } from '../controls'
import {
  pixelScale,
  tileSize,
  tileSizeUpscaled
} from '../draw-engine'
import {
  isPointerIn
} from '@/lib/physics'
import { zzfx } from '@/lib/zzFx'
import { Layers } from './systems/render'

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
  componentsRequired = new Set<Function>([Mov, Pos, Draggable])
  dragging = -1

  update (entities: Set<Entity>): void {
    const mousePos = controls.mousePosition

    for (const entity of entities) {
      const comps = this.ecs.getComponents(entity)
      const pos = comps.get(Pos)
      const drag = comps.get(Draggable)

      drag.hovered = isPointerIn(mousePos, {
        x: pos.x,
        y: pos.y,
        w: tileSize * pixelScale,
        h: tileSize * pixelScale
      })

      if (drag.hovered && !drag.dragging && this.dragging === -1) {
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

export class ParticleSystem extends System {
  inited = false
  nextTick = 0
  tick = 200

  componentsRequired = new Set<Function>([Pos, Mov])

  init (): void {
    this.ecs.ee.on('collide', (entity: Entity, other :Entity) => {
      const comps = this.ecs.getComponents(entity)
      const pos = comps.get(Pos)
      const mov = comps.get(Mov)

      const otherComps = this.ecs.getComponents(other)
      const otherPos = otherComps.get(Pos)

      // find center of the collision
      const impactPoint = {
        x: (pos.x + otherPos.x) / 2,
        y: (pos.y + otherPos.y) / 2 - tileSizeUpscaled / 2
      }

      // random 3-6 particles
      const count = Math.floor(Math.random() * 3) + 3
      for (let i = 0; i < count; i++) {
        this.createParticle(impactPoint, mov, i, 'white')
      }
    })
  }

  createParticle (pos: Pos, mov: Mov, i: number, color: string): void {
    const e = this.ecs.addEntity()
    this.ecs.addComponent(e, new Pos(pos.x + tileSizeUpscaled / 2 + i, pos.y + tileSizeUpscaled))
    // randomise dx, dy a bit to make it more interesting and limit the speed by 0.5
    const dx = (Math.random() - 0.5) / 2
    const dy = (Math.random() - 0.5) / 2
    this.ecs.addComponent(e, new Mov(dx, dy))
    // color should be transparent
    this.ecs.addComponent(e, new Particle(500, 3, color))
    this.ecs.addComponent(e, new Renderable(undefined, Layers.Effects))
  }

  update (entities: Set<Entity>): void {
    if (!this.inited) {
      this.init()
      this.inited = true
    }

    this.nextTick -= this.ecs.currentDelta
    if (this.nextTick <= 0) {
      for (const entity of entities) {
        const comps = this.ecs.getComponents(entity)
        const mov = comps.get(Mov)

        const particle = comps.get(Particle)
        if (particle) {
          continue
        }

        if (Math.abs(mov.dx) > 0.2 || Math.abs(mov.dy) > 0.2) {
          // random 3-6 particles
          const count = Math.floor(Math.random() * 3) + 3
          for (let i = 0; i < count; i++) {
            const pos = comps.get(Pos)
            const DIRT_COLOR = 'rgba(145, 79, 25, 0.2)'
            this.createParticle(pos, mov, i, DIRT_COLOR)
          }
        }
      }
      this.nextTick = this.tick
    }

    // remove old
    for (const entity of entities) {
      const comps = this.ecs.getComponents(entity)

      const particle = comps.get(Particle)
      if (particle) {
        particle.lifeTime -= this.ecs.currentDelta
        if (particle.lifeTime <= 0) {
          this.ecs.removeEntity(entity)
        }
        continue
      }
    }
  }
}
