import { Entity, System } from '@/lib/ecs'
import { Draggable, FloorPoint, PointType, Position, Sell } from '../component'
import { isPointerIn } from '@/lib/physics'
import { tileSizeUpscaled } from '@/core/draw-engine'
import { Events } from '../events'

export class PointSystem extends System {
  componentsRequired = new Set<Function>([Sell])

  update (entities: Set<Entity>): void {
    for (const entity of entities) {
      const comps = this.ecs.getComponents(entity)
      const sell = comps.get(Sell)
      const floor = comps.get(FloorPoint)

      if (sell.type !== 'point' || !floor) {
        continue
      }
      floor.occupiedBy = -1

      for (const other of entities) {
        if (other === entity || this.ecs.getComponents(other).get(Sell).type === 'point') {
          continue
        }

        const pos = comps.get(Position)
        const otherPos = this.ecs.getComponents(other).get(Position)

        const isOn = isPointerIn(
          new DOMPoint(
            pos.x + tileSizeUpscaled / 2,
            pos.y + tileSizeUpscaled / 2
          ),
          {
            x: otherPos.x,
            y: otherPos.y,
            w: tileSizeUpscaled,
            h: tileSizeUpscaled
          }
        )

        if (isOn) {
          floor.occupiedBy = other
        }
      }

      if (floor.occupiedBy !== -1) {
      // sell
        if (floor.type === PointType.sellPoint) {
          this.ecs.ee.emit(Events.sell, floor.occupiedBy)
        }
      }

      // spawn
      // if (floor.type === 'spawnPoint') {
      //   if (floor.timers.nextSpawn) {
      //     floor.timers.nextSpawn -= this.ecs.currentDelta

      //     if (floor.timers.nextSpawn <= 0) {
      //       floor.timers.nextSpawn = floor.timers.spawnInterval
      //     }
      //   }
      // }
    }
  }
}
