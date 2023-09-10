import { Entity, System } from '@/lib/ecs'
import { Buyer, Clickable, GameData, Position, Renderable, Resource, Sellable, SellObjectType } from '../component'
import { Layers } from './render'
import { SACK } from '@/tiles'
import { Events } from '../events'
import { createAI, createBuyer } from '../helpers'
import { GYM_PRICE, HIRE_PRICE, INITIAL_MONEY, MAX_GYM, MAX_HIRE } from '@/params/main'
import { getGridPointInPixels } from '@/lib/grid'

const posStart = [24, 22]
const posEnd: [number, number] = [21, 22]
const qPosEnd: [number, number] = [24, 14]
const qPosStart: [number, number] = [21, 14]
const maxBuyers = 4
const interval = 3000
const intervalMove = 30

export class SellSystem extends System {
  inited = false

  bSpeed = 2 // only odd numbers

  q:Entity[] = []

  next = 0
  nextMove = 0

  componentsRequired = new Set<Function>([Buyer, Position])
  init (): void {
    // sell event
    this.ecs.ee.on(Events.sell, (entity: Entity) => {
      const comps = this.ecs.getComponents(entity)
      const sell = comps.get(Sellable)

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
          const isEverythingProvided = Object.values(buyer.resToBuy).every((v) => v === 0)
          if (isEverythingProvided) {
            this.leaveQ(b)
          }
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
    createBuyer(getGridPointInPixels(posStart[0], posStart[1]),
      { [Resource.wood]: 1 }, 10000, qPosEnd).forEach(c =>
      this.ecs.addComponent(buyer, c)
    )

    // @ts-ignore
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
      buyer.targetPos = [qPosStart[0] + position, qPosStart[1]]
    }

    const pos = comp.get(Position)
    const tPos = getGridPointInPixels(...buyer.targetPos)
    const isOnTarget = pos.x === tPos[0] && pos.y === tPos[1]
    if (isOnTarget) {
      if (position === 0) {
        buyer.state = 'buying'
        this.ecs.ee.emit(Events.newCustomer, entity)
      } else {
        buyer.state = 'inQ'
      }
    }
  }

  moveBuyer (entity: Entity): void {
    const comp = this.ecs.getComponents(entity)
    const buyer = comp.get(Buyer)
    const pos = comp.get(Position)

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
    this.next -= this.ecs.currentDelta
    if (this.next <= 0) {
      this.next = interval
      if (entities.size < maxBuyers) {
        this.createBuyer()
      }
    }

    // move
    this.nextMove -= this.ecs.currentDelta
    if (this.nextMove <= 0) {
      this.nextMove = intervalMove
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
          this.leaveQ(entity)
        }
      }
    }
  }

  leaveQ (entity: Entity): void {
    const comp = this.ecs.getComponents(entity)
    const buyer = comp.get(Buyer)
    buyer.state = 'walkingBack'
    buyer.targetPos = posEnd
    this.q.shift()
    if (buyer.bought) {
      const r = comp.get(Renderable)
      r.carry = SACK
    }
  }
}

export class GameDataSystem extends System {
  componentsRequired = new Set<Function>([GameData])

  inited = false
  e: Entity = -1
  hired = 0
  gymed = 0

  init (): void {
    this.e = this.ecs.addEntity()
    this.ecs.addComponent(this.e, new GameData(INITIAL_MONEY))
    this.ecs.addComponent(this.e, new Renderable(undefined, Layers.UI))

    this.ecs.ee.on(Events.sold, (entity: Entity, type: SellObjectType, price: number) => {
      this.ecs.getComponents(this.e).get(GameData).money += price
    })

    this.ecs.ee.on(Events.hire, (entity: Entity) => {
      const gd = this.ecs.getComponents(this.e).get(GameData)
      if (this.hired < MAX_HIRE && gd.money >= HIRE_PRICE) {
        const e = this.ecs.addEntity()
        createAI(getGridPointInPixels(15, 15), true).forEach(c =>
          this.ecs.addComponent(e, c)
        )
        gd.money -= HIRE_PRICE
        this.hired += 1
        this.ecs.ee.emit(Events.gether, entity)

        if (this.hired === MAX_HIRE) {
          this.ecs.getComponents(entity).get(Clickable).enabled = false
        }
      } else {
        this.ecs.ee.emit(Events.notSold, entity) // FIXME hack
      }
    })

    this.ecs.ee.on(Events.gym, (entity: Entity) => {
      const gd = this.ecs.getComponents(this.e).get(GameData)
      if (gd.money >= GYM_PRICE && this.gymed < MAX_GYM) {
        gd.money -= GYM_PRICE
        this.gymed += 1

        if (this.gymed === MAX_GYM) {
          this.ecs.getComponents(entity).get(Clickable).enabled = false
        }
        this.ecs.ee.emit(Events.gymDone, entity)
      } else {
        this.ecs.ee.emit(Events.notSold, entity) // FIXME hack
      }
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
