import { ComponentContainer, Entity, System } from '@/lib/ecs'
import { Buyer, Clickable, Collidable, Draggable, GameData, Particle, Position, Renderable, Resource, ResourceSource } from '../component'
import { drawEngine, tileSizeUpscaled } from '@/core/draw-engine'
import { I_ARROW_HAND, I_FIST_HAND, TREE_TOP, WELL_TOP, convertResToSprite } from '@/tiles'
import { controls } from '@/core/controls'

export const enum Layers {
  Floor = 0,
  Points = 1,
  Effects = 2,
  Objects = 3,
  AlwaysOnTop = 4,
  UI = 5,
}

export class RenderSystem extends System {
  debug = false

  componentsRequired = new Set<Function>([Renderable])

  entitiesByLayers = new Map<Layers, Set<Entity>>()
  tmpTopLayer: {x:number, y:number, sprite: number}[] = []

  mouseIcon: [number, number, number] | null = null
  helpText = ''

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
    this.mouseIcon = [controls.mousePosition.x, controls.mousePosition.y, I_ARROW_HAND]

    drawEngine.drawBg()

    // draw entities
    for (const layer of [Layers.Floor, Layers.Points, Layers.Effects, Layers.Objects, Layers.AlwaysOnTop, Layers.UI]) {
      // mouse icon
      if (layer === Layers.UI && this.mouseIcon) {
        drawEngine.drawIcon(...this.mouseIcon)
        if (this.helpText) {
          drawEngine.drawHelpText(this.helpText)
          this.helpText = ''
        }
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
        // ECS mid-update
        if (!comps) {
          continue
        }

        const render = comps.get(Renderable)
        if (!render.visible) {
          continue
        }
        const pos = comps.get(Position)
        const drag = comps.get(Draggable)
        const click = comps.get(Clickable)
        const buyer = comps.get(Buyer)
        if (drag) {
          if (drag.dragging) {
            drawEngine.drawRope(pos, { mx: this.mouseIcon![0], my: this.mouseIcon![1] })
            this.mouseIcon = [controls.mousePosition.x, controls.mousePosition.y, I_FIST_HAND]
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
          if (click.text) {
            this.helpText = click.text
          }
          if (click.enabled) {
            this.mouseIcon = [controls.mousePosition.x, controls.mousePosition.y, click.icon]
          }
        }

        // hack for tree or well
        const resS = comps.get(ResourceSource)
        if (resS && (resS.type === Resource.wood || resS.type === Resource.water)) {
          this.tmpTopLayer.push({ x: pos.x, y: pos.y - tileSizeUpscaled, sprite: resS.type === Resource.water ? WELL_TOP : TREE_TOP })
        }

        if (render.sprite !== undefined) {
          // draw sprite
          drawEngine.drawEntity(pos, render.sprite)

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
            drawEngine.drawTimer(gameData.timeLeft)
          }
        }

        // Progress Bars
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
