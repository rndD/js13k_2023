/* eslint-disable max-classes-per-file */
import { Entity, System } from '@/lib/ecs'
import {
  Draggable,
  Mov,
  Physical,
  Pos,
  Soundable
} from './component'
import { controls } from '../controls'
import {
  pixelScale,
  tileSize
} from '../draw-engine'
import {
  isPointerIn
} from '@/lib/physics'
import { zzfx } from '@/lib/zzFx'

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

      // reset value
      drag.dropped = false

      if (drag.hovered && !drag.dragging && this.dragging === -1) {
        if (controls.isMouseDown) {
          drag.dragging = true
          this.dragging = entity
        }
      }

      if (!controls.isMouseDown && drag.dragging) {
        drag.dragging = false
        drag.dropped = true
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

export class SoundSystem extends System {
  state = {
    soundsPlaying: {
      colliding: 0, // remaining duration in ms
      dropping: 0
    },
    muted: false,
    volume: 0.01
  }

  sounds = {
    // eslint-disable-next-line
    colliding: [1.31, , 200, , 0.02, 0.01, 2, 2.1, , , , , , , -242, , , 0.53],

    // eslint-disable-next-line
    dropping: [
      ,
      ,
      435,
      0.02,
      0.07,
      0.06,
      1,
      1.6,
      -12,
      ,
      ,
      ,
      ,
      ,
      ,
      ,,
      0.91,
      0.01
    ]
  }

  componentsRequired = new Set<Function>([Soundable])
  update (entities: Set<Entity>): void {
    if (this.state.muted) {
      return
    }

    // update volume
    // @ts-ignore
    window.zzfxV = this.state.volume

    for (const key in this.state.soundsPlaying) {
      // @ts-ignore
      if (this.state.soundsPlaying[key] > 0) {
        // @ts-ignore
        this.state.soundsPlaying[key] -= this.ecs.currentDelta
      }
    }

    for (const entity of entities) {
      const comps = this.ecs.getComponents(entity)
      const sound = comps.get(Soundable)
      if (!sound) {
        continue
      }
      // FIXME colide sound is not working, probably because of the colide system
      // const collidable = comps.get(Collidable)
      // if (collidable) {
      //   // console.log("collidable", collidable.colliding);
      // }
      // if (
      //   collidable &&
      //   collidable.colliding &&
      //   this.state.soundsPlaying.colliding <= 0
      // ) {
      //   zzfx(...this.sounds.colliding)
      //   this.state.soundsPlaying.colliding = 100
      // }

      const draggable = comps.get(Draggable)

      if (
        draggable &&
        draggable.dropped &&
        this.state.soundsPlaying.dropping <= 0
      ) {
        zzfx(...this.sounds.dropping)
        this.state.soundsPlaying.dropping = 500
      }
    }
  }
}
