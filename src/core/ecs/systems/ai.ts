import { Entity, System } from '@/lib/ecs'
import { Buyer, Collidable, Pos, Renderable } from '../component'
import { tileSizeUpscaled } from '@/core/draw-engine'
import { getGridPointInPixels } from '@/lib/utils'
import { Layers } from './render'
import { MAN, SACK } from '@/tiles'

export class BuyerSystem extends System {
  maxBuyers = 4
  componentsRequired = new Set<Function>([Buyer, Pos])
  start = [14, 22]
  end: [number, number] = [11, 22]
  qPosEnd: [number, number] = [14, 14]
  qPosStart: [number, number] = [11, 14]

  q:Entity[] = []

  nextTick = 0
  tick = 3000

  tickMove = 30
  nextTickMove = 0

  createBuyer (): void {
    const buyer = this.ecs.addEntity()
    this.ecs.addComponent(buyer, new Buyer(
      { wood: 1, stone: 1 },
      3000, // time,
      this.qPosEnd
    ))

    // @ts-ignore
    this.ecs.addComponent(buyer, new Pos(...getGridPointInPixels(...this.start)))
    this.ecs.addComponent(buyer, new Renderable(MAN, Layers.Objects))
    this.ecs.addComponent(buyer, new Collidable({ w: tileSizeUpscaled, h: tileSizeUpscaled }))
  }

  qCheck (entity: Entity): void {
    let position = 0
    if (this.q.includes(entity)) {
      position = this.q.indexOf(entity)
    } else {
      position = this.q.length
      this.q.push(entity)
    }

    const comp = this.ecs.getComponents(entity)
    const buyer = comp.get(Buyer)

    // position updated
    if (buyer.queuePos !== position) {
      buyer.queuePos = position
      buyer.state = 'walking'
      buyer.targetPos = [this.qPosStart[0] + position, this.qPosStart[1]]
    }

    const pos = comp.get(Pos)
    const tPos = getGridPointInPixels(...buyer.targetPos)
    const isOnTarget = pos.x === tPos[0] && pos.y === tPos[1]
    if (isOnTarget) {
      if (position === 0) {
        buyer.state = 'buying'
      } else {
        buyer.state = 'inQ'
      }
    }
  }

  moveBuyer (entity: Entity): void {
    const comp = this.ecs.getComponents(entity)
    const buyer = comp.get(Buyer)
    const pos = comp.get(Pos)

    const [x, y] = buyer.targetPos
    const [bx, by] = getGridPointInPixels(x, y)
    if (pos.x === bx && pos.y === by) {
      if (buyer.state === 'walking') {
        this.qCheck(entity)
      }
      if (buyer.state === 'walkingBack') {
        this.ecs.removeEntity(entity)
      }
    } else {
      if (pos.x < bx) {
        pos.x += 1
      }
      if (pos.x > bx) {
        pos.x -= 1
      }
      if (pos.y < by) {
        pos.y += 1
      }
      if (pos.y > by) {
        pos.y -= 1
      }
    }
  }

  update (entities: Set<Entity>): void {
    // create
    this.nextTick -= this.ecs.currentDelta
    if (this.nextTick <= 0) {
      this.nextTick = this.tick
      if (entities.size < this.maxBuyers) {
        this.createBuyer()
      }
    }

    // move
    this.nextTickMove -= this.ecs.currentDelta
    if (this.nextTickMove <= 0) {
      this.nextTickMove = this.tickMove
      for (const entity of entities) {
        const comps = this.ecs.getComponents(entity)
        const buyer = comps.get(Buyer)
        if (buyer.state === 'walking' || buyer.state === 'walkingBack') {
          this.moveBuyer(entity)
        }
        if (buyer.state === 'inQ') {
          this.qCheck(entity)
        }
      }
    }

    // update time for buyers
    for (const entity of entities) {
      const comps = this.ecs.getComponents(entity)
      const buyer = comps.get(Buyer)
      if (buyer.state === 'buying') {
        buyer.time -= this.ecs.currentDelta
        if (buyer.time <= 0) {
          buyer.state = 'walkingBack'
          buyer.targetPos = this.end
          this.q.shift()
          // if (buyer.bought) {
          if (true) {
            const r = comps.get(Renderable)
            r.carry = SACK
          }
        }
      }
    }
  }
}
