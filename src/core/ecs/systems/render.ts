import { ComponentContainer, Entity, System } from '@/lib/ecs'
import { Buyer, Clickable, Collidable, Draggable, GameData, Particle, Pos, Renderable, ResourceSource } from '../component'
import { drawEngine, tileSizeUpscaled } from '@/core/draw-engine'
import { I_ARROW, I_AXE, P_SPAWN, TREE_TOP, WELL_BOTTOM, WELL_TOP, convertResToSprite } from '@/tiles'
import { controls } from '@/core/controls'
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
  tmpTopLayer: {x:number, y:number, sprite: number}[] = []

  mouseIcon: [number, number, number] | null = null

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
    this.tmpTopLayer = []
    this.mouseIcon = [controls.mousePosition.x, controls.mousePosition.y, I_ARROW]

    drawEngine.drawBg()
    // draw entities
    for (const layer of Object.values(Layers)) {
      // mouse icon
      if (layer === Layers.UI && this.mouseIcon) {
        drawEngine.drawIcon(...this.mouseIcon)
      }

      // FIXME: remove then size limit hits
      if (typeof layer === 'string' || !this.entitiesByLayers.has(layer)) {
        continue
      }
      // hack for tree
      if (layer === Layers.AlwaysOnTop) {
        for (const t of this.tmpTopLayer) {
          drawEngine.drawEntity({ x: t.x, y: t.y }, t.sprite)
        }
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
        const click = comps.get(Clickable)
        const buyer = comps.get(Buyer)
        if (drag) {
          if (drag.dragging) {
            drawEngine.drawShadow(pos)
          }
          // hover for objects
          if (click?.hovered && !drag.dragging) {
            drawEngine.drawOverlay(pos, { w: tileSizeUpscaled, h: tileSizeUpscaled })
          }
        } else {
          // hoverl for clickable
          if (click?.hovered) {
            const h = click.withTop ? tileSizeUpscaled * 2 : tileSizeUpscaled
            const y = click.withTop ? pos.y - tileSizeUpscaled : pos.y
            drawEngine.drawOverlay({ x: pos.x, y }, { w: tileSizeUpscaled, h })
          }
        }

        if (click?.hovered) {
          this.mouseIcon = [controls.mousePosition.x, controls.mousePosition.y, click.icon]
        }

        // hack for tree
        const t = comps.get(ResourceSource)
        if (t && t.type === 'wood') {
          this.tmpTopLayer.push({ x: pos.x, y: pos.y - tileSizeUpscaled, sprite: TREE_TOP })
        }
        if (t && t.type === 'water') {
          this.tmpTopLayer.push({ x: pos.x, y: pos.y - tileSizeUpscaled, sprite: WELL_TOP })
        }

        if (render.sprite !== undefined) {
          // draw sprite
          drawEngine.drawEntity(pos, render.sprite, render.spriteAngle)

          if (buyer?.state === 'buying') {
            const res = Object.keys(buyer.resToBuy).reduce((acc, curr) => {
              // @ts-ignore
              acc[convertResToSprite(curr)] = buyer.resToBuy[curr]
              return acc
            }, {})
            drawEngine.drawBuying(pos, res)
          }
          if (render.carry !== null) {
            drawEngine.drawCarry(pos, render.carry)
          }
        } else {
          // not sprites

          const particle = comps.get(Particle)
          if (particle) {
            drawEngine.drawParticle(pos, particle.color, particle.size, particle.sprite)
          }
          const gameData = comps.get(GameData)
          if (gameData) {
            drawEngine.drawUIMoney(gameData.money)
          }
        }

        // Progress Bards
        const resS = comps.get(ResourceSource)
        if (resS?.nextIn > 0) {
          drawEngine.drawProgress(pos, resS.nextIn, resS.interval)
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
