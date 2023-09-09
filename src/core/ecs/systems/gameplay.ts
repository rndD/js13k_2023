import { Entity, System } from '@/lib/ecs'
import { Buyer, Collidable, GameData, Pos, Renderable, Resource, Sell, SellObjectType } from '../component'
import { tileSizeUpscaled } from '@/core/draw-engine'
import { getGridPointInPixels, randomFromList } from '@/lib/utils'
import { Layers } from './render'
import { MEN, SACK } from '@/tiles'
import { Events } from '../events'

export class SellSystem extends System {
  inited = false

  maxBuyers = 4
  bSpeed = 4 // only odd numbers
  componentsRequired = new Set<Function>([Buyer, Pos])
  start = [24, 22]
  end: [number, number] = [21, 22]
  qPosEnd: [number, number] = [24, 14]
  qPosStart: [number, number] = [21, 14]

  q:Entity[] = []

  nextTick = 0
  tick = 3000

  tickMove = 30
  nextTickMove = 0

  init (): void {
    // sell event
    this.ecs.ee.on(Events.sell, (entity: Entity) => {
      const comps = this.ecs.getComponents(entity)
      const sell = comps.get(Sell)

      if (!sell) {
        return
      }

      if (this.q.length) {
        const b = this.q[0]
        const buyerComp = this.ecs.getComponents(b)
        const buyer = buyerComp.get(Buyer)
        if (buyer.state !== 'buying') {
          return
        }
        // @ts-ignore
        if ((buyer.resToBuy[sell.type] || 0) > 0) {
          this.ecs.ee.emit(Events.sold, entity, sell.type, sell.price)
          // @ts-ignore
          buyer.resToBuy[sell.type] -= 1
          buyer.bought = true
          // console.log(buyer, sell.type, buyer.resToBuy[sell.type])
          this.ecs.removeEntity(entity)
        } else {
          this.ecs.ee.emit(Events.notSold, entity)
        }
      }
    })
  }

  createBuyer (): void {
    const buyer = this.ecs.addEntity()
    this.ecs.addComponent(buyer, new Buyer(
      { [Resource.wood]: 3, [Resource.food]: 1, [Resource.box]: 1, [Resource.barrel]: 9, [Resource.water]: 1 },

      10000, // time,
      this.qPosEnd
    ))

    // @ts-ignore
    this.ecs.addComponent(buyer, new Pos(...getGridPointInPixels(...this.start)))
    this.ecs.addComponent(buyer, new Renderable(randomFromList(MEN), Layers.Objects))
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
        pos.x += this.bSpeed
      }
      if (pos.x > bx) {
        pos.x -= this.bSpeed
      }
      if (pos.y < by) {
        pos.y += this.bSpeed
      }
      if (pos.y > by) {
        pos.y -= this.bSpeed
      }
    }
  }

  update (entities: Set<Entity>): void {
    if (!this.inited) {
      this.init()
      this.inited = true
    }

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
          // FIXME
          if (buyer.bought) {
            const r = comps.get(Renderable)
            r.carry = SACK
          }
        }
      }
    }
  }
}

export class GameDataSystem extends System {
  componentsRequired = new Set<Function>([GameData])

  inited = false
  e: Entity = -1

  init (): void {
    this.e = this.ecs.addEntity()
    this.ecs.addComponent(this.e, new GameData(0))
    this.ecs.addComponent(this.e, new Renderable(undefined, Layers.UI))

    this.ecs.ee.on(Events.sold, (entity: Entity, type: SellObjectType, price: number) => {
      this.ecs.getComponents(this.e).get(GameData).money += price
    })

    this.inited = true
  }

  update (entities: Set<Entity>): void {
    if (!this.inited) {
      this.init()
    }

    for (const entity of entities) {
      const comps = this.ecs.getComponents(entity)
      const gameData = comps.get(GameData)

      gameData.timeLeft -= this.ecs.currentDelta

      if (gameData.timeLeft <= 0) {
        this.ecs.ee.emit(Events.gameOver, gameData.money)
      }
    }
  }
}
