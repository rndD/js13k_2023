import { ComponentContainer, Entity, System } from '@/lib/ecs'
import { Collidable, Draggable, Particle, Pos, Renderable } from '../component'
import { drawEngine } from '@/core/draw-engine'
export enum Layers {
  Background,
  Floor,
  Points,
  Effects,
  Objects,
  AlwaysOnTop,
  UI,
}
export class RenderSystem extends System {
  debug = false

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
        // We need this check because entity can be removed from the
        // ECS mid-update.
        if (!comps) {
          continue
        }
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

        if (render.sprite !== undefined) {
          drawEngine.drawEntity(pos, render.sprite, render.spriteAngle)
        } else {
          // particle
          const particle = comps.get(Particle)
          drawEngine.drawParticle(pos, particle.color, particle.size)
        }

        if (this.debug) {
          const coll = comps.get(Collidable)
          if (coll) {
            drawEngine.drawDebugRect(pos, coll.wh.w, coll.wh.h)
          }
        }
      }
    }
  }
}
