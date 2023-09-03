/* eslint-disable max-classes-per-file */
import { ComponentContainer, Entity, System } from '@/lib/ecs'
import {
  Collidable,
  Draggable,
  Layers,
  Mov,
  Player,
  Physical,
  Pos,
  Renderable,
  Soundable
} from './component'
import { controls } from '../controls'
import {
  drawEngine,
  pixelScale,
  tileSize,
  tileSizeUpscaled
} from '../draw-engine'
import {
  correctAABBCollision,
  isPointerIn,
  testAABBCollision
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

export class CollideSystem extends System {
  componentsRequired = new Set<Function>([Pos, Collidable])
  update (entities: Set<Entity>): void {
    for (const entity of entities) {
      // check only mov
      const comps = this.ecs.getComponents(entity)
      const mov = comps.get(Mov)
      const col = comps.get(Collidable)
      if (!mov) {
        continue
      }

      const pos = comps.get(Pos)

      for (const other of entities) {
        if (other === entity) {
          continue
        }

        const otherComps = this.ecs.getComponents(other)
        const otherPos = otherComps.get(Pos)
        const t = testAABBCollision(
          pos,
          { w: tileSizeUpscaled, h: tileSizeUpscaled }, // FIXME: implement and use w ,h from col
          otherPos,
          { w: tileSizeUpscaled, h: tileSizeUpscaled }
        )

        col.colliding = t.collide

        if (t.collide) {
          //   console.log("collide", entity, col);
          const otherMov = otherComps.get(Mov) as Mov | undefined
          //   console.log(
          //     "colide",
          //     comps.get(GameObject)?.type,
          //     entity,
          //     otherComps.get(GameObject)?.type,
          //     other
          //   );

          correctAABBCollision(
            { mov, pos },
            { mov: otherMov, pos: otherPos },
            t
          )
        }
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

export class RenderSystem extends System {
  componentsRequired = new Set<Function>([Renderable])

  entitiesByLayers = new Map<Layers, Set<Entity>>()

  public addEntity (entity: number, componentContainer: ComponentContainer): void {
    const render = componentContainer.get(Renderable)
    if (!this.entitiesByLayers.has(render.layer)) {
      this.entitiesByLayers.set(render.layer, new Set())
    }
    this.entitiesByLayers.get(render.layer)?.add(entity)
  }

  public removeEntity (entity: number): void {
    for (const layer of this.entitiesByLayers.values()) {
      layer.delete(entity)
    }
  }

  update (entities: Set<Entity>): void {
    drawEngine.drawBg()
    // draw entities
    for (const layer of Object.values(Layers)) {
      // FIXME: remove then size limit hits
      if (typeof layer === 'string' || !this.entitiesByLayers.has(layer)) {
        continue
      }

      for (const entity of this.entitiesByLayers.get(layer)!) {
        const comps = this.ecs.getComponents(entity)
        const render = comps.get(Renderable)
        if (!render.visible) {
          continue
        }
        const pos = comps.get(Pos)
        const drag = comps.get(Draggable)
        if (drag) {
          if (drag.dragging) {
            drawEngine.drawShadow(pos)
          }
          if (drag.hovered && !drag.dragging) {
            drawEngine.drawOverlay(pos)
          }
        }

        drawEngine.drawEntity(pos, render.sprite, render.spriteAngle)
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
      const collidable = comps.get(Collidable)
      if (collidable) {
        // console.log("collidable", collidable.colliding);
      }
      if (
        collidable &&
        collidable.colliding &&
        this.state.soundsPlaying.colliding <= 0
      ) {
        zzfx(...this.sounds.colliding)
        this.state.soundsPlaying.colliding = 100
      }

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

export class PlayerControlSystem extends System {
  componentsRequired = new Set<Function>([Player])
  lastMove = 0

  update (entities: Set<Entity>): void {
    if (this.lastMove > 0) {
      this.lastMove -= this.ecs.currentDelta
      return
    }

    entities.forEach(player => {
      const comps = this.ecs.getComponents(player)
      const pos = comps.get(Pos)
      const speed = tileSizeUpscaled

      if (controls.isUp) {
        pos.y -= speed
      }

      if (controls.isDown) {
        pos.y += speed
      }

      if (controls.isLeft) {
        pos.x -= speed
      }

      if (controls.isRight) {
        pos.x += speed
      }

      this.lastMove = 200
    })
  }
}
