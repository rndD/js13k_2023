import { Entity, System } from '@/lib/ecs'
import { correctAABBCollision, testAABBCollision } from '@/lib/physics'
import { Collidable, Mov, Pos } from '../component'
import { tileSizeUpscaled } from '@/core/draw-engine'
import { Events } from '../events'

// return x,y of the hitbox from center
export const getColPos = (pos: Pos, col: Collidable): Pos => {
  return {
    x: pos.x + ((tileSizeUpscaled - col.wh.w) / 2),
    y: pos.y + ((tileSizeUpscaled - col.wh.h) / 2)
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

      const pos = getColPos(comps.get(Pos), comps.get(Collidable))

      for (const other of entities) {
        if (other === entity) {
          continue
        }

        const otherComps = this.ecs.getComponents(other)
        const otherCol = otherComps.get(Collidable)
        const otherPos = getColPos(otherComps.get(Pos), otherCol)
        const t = testAABBCollision(
          pos,
          col.wh, // FIXME: implement and use w ,h from col
          otherPos,
          otherCol.wh
        )

        if (t.collide) {
          const otherMov = otherComps.get(Mov)
          this.ecs.ee.emit(Events.collide, entity, other)

          correctAABBCollision(
            { mov, pos, col },
            { mov: otherMov, pos: otherPos, col: otherCol },
            t
          )
        }
      }
    }
  }
}
