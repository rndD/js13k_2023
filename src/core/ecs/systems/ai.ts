import { ComponentContainer, Entity, System } from '@/lib/ecs'
import { AI, AIState, Aible, Collidable, Draggable, Mov, Position, Sellable } from '../component'
import { aStar, create2DArray, manhattanDistance } from '@/lib/utils'
import { isPointerIn } from '@/lib/physics'
import { DROP_POINTS, YARD } from '@/params/main'
import { Events } from '../events'
import { getGridPointFromPixels, getGridPointInPixels } from '@/lib/grid'
import { tileSizeUpscaled } from '@/params/pixels'

const aiSpeed = 2
const interval = 500

export class AISystem extends System {
  componentsRequired = new Set<Function>([Aible])

  inited = false
  // 40x23 it's current map size
  // true == obstacle
  obstacles: number[][] = create2DArray(40, 23, 0)

  // target -> entity
  targetList: { [key: number]: number } = {}

  ais: number[] = []

  next = 0

  public addEntity (entity: number, componentContainer: ComponentContainer): void {
    // Build map
    const collidable = componentContainer.get(Collidable)
    if (collidable?.aiObstacle) {
      const pos = componentContainer.get(Position)
      const [x, y] = getGridPointFromPixels(pos.x, pos.y)
      this.obstacles[x][y] = 1
    }

    if (componentContainer.get(AI)) {
      this.ais.push(entity)
    }
  }

  public removeEntity (entity: number): void {
    // remove from map
    const comps = this.ecs.getComponents(entity)
    const collidable = comps.get(Collidable)
    if (collidable) {
      if (collidable.aiObstacle) {
        const pos = comps.get(Position)
        const [x, y] = getGridPointFromPixels(pos.x, pos.y)
        this.obstacles[x][y] = 0
      }
    }

    if (comps.get(AI)) {
      this.ais = this.ais.filter((e) => e !== entity)
    }

    if (this.targetList[entity]) {
      const aiE = this.targetList[entity]
      delete this.targetList[entity]
      this.ecs.getComponents(aiE).get(AI).targetPos = null
      this.ecs.getComponents(aiE).get(AI).targetEntity = null
    }
  }

  init (): void {
    // console.log('map', this.obstacles)
    // console.log('path', aStar([8, 10], [30, 16], this.obstacles))
    this.inited = true
  }

  tooglePickup (aiE: Entity, resource: Entity): void {
    const comps = this.ecs.getComponents(aiE)
    const ai = comps.get(AI)
    if (ai.state === AIState.toTarget) {
      const basePoint = this.findNearestDropPoint(comps.get(Position))
      const path = this.findTargetPath(aiE, getGridPointFromPixels(...basePoint))
      if (!path) {
        return
      }
      if (path === true) {
        return
      }

      ai.state = AIState.toBase
      ai.targetPos = path
      ai.pickedUp = true
      this.ecs.ee.emit(Events.pickup, resource)
      return
    }
    if (ai.state === AIState.toBase) {
      this.resetTarget(aiE)
      // drop
      const pos = comps.get(Position)
      const _pos = getGridPointFromPixels(pos.x, pos.y)
      const dropD = DROP_POINTS[_pos.join(',')]

      const resC = this.ecs.getComponents(resource)
      const resMov = resC.get(Mov)
      const resPos = resC.get(Position)
      if (dropD === 1) {
        resMov.dx = 1.5
        resPos.x += tileSizeUpscaled
      }
      if (dropD === -1) {
        resMov.dy = 1.5
        resPos.y += tileSizeUpscaled
      }
      if (dropD === 2) {
        resMov.dx -= 1.5
        resPos.x -= tileSizeUpscaled
      }

      this.ecs.ee.emit(Events.drop, resource)
    }
  }

  aiMove (entity: Entity): void {
    const pos = this.ecs.getComponents(entity).get(Position)
    const ai = this.ecs.getComponents(entity).get(AI)
    // check if target is not dragged or removed
    const targetC = this.ecs.getComponents(ai.targetEntity!)
    if (!targetC || targetC.get(Draggable).dragging) {
      this.resetTarget(entity)
      return
    }

    const { x, y } = pos
    const [tx, ty] = ai.targetPos!

    if (x === tx && y === ty) {
      const basePoint = this.findNearestDropPoint(pos)
      const nextStep = ai.state === AIState.toTarget ? this.findTargetPath(entity, ai.targetEntity!) : this.findTargetPath(entity, basePoint)
      if (!nextStep) {
        this.resetTarget(entity)
        return
      } else if (nextStep === true) {
        this.tooglePickup(entity, ai.targetEntity!)
      } else {
        ai.targetPos = nextStep
      }
    }

    if (ai.targetPos) {
      if (pos.x < tx) {
        pos.x += aiSpeed
      }
      if (pos.x > tx) {
        pos.x -= aiSpeed
      }
      if (pos.y < ty) {
        pos.y += aiSpeed
      }
      if (pos.y > ty) {
        pos.y -= aiSpeed
      }
    }
    if (ai.pickedUp) {
      const target = this.ecs.getComponents(ai.targetEntity!)
      const tPos = target.get(Position)
      tPos.x = pos.x
      tPos.y = pos.y
    }
  }

  resetTarget (entity: Entity): void {
    const ai = this.ecs.getComponents(entity).get(AI)
    delete this.targetList[ai.targetEntity!]
    ai.targetPos = null
    ai.targetEntity = null
    ai.pickedUp = false
    ai.state = AIState.idle
  }

  findNearestDropPoint (pos: Position): [number, number] {
    const _pos = getGridPointFromPixels(pos.x, pos.y)
    let near: [number, number] | null = null
    Object.keys(DROP_POINTS).forEach((k) => {
      const p = k.split(',').map((n) => parseInt(n, 10)) as [number, number]
      if (near === null) {
        near = p
      } else {
        const nearDist = manhattanDistance(_pos, near)
        const pDist = manhattanDistance(_pos, p)
        if (pDist < nearDist) {
          near = p
        }
      }
    })

    return near!
  }

  findTargetPath (entity: Entity, target: Entity | [number, number]): undefined|[number, number]|true {
    let _end: [number, number]
    if (Array.isArray(target)) {
      _end = target
    } else {
      const pos = this.ecs.getComponents(target).get(Position)
      _end = getGridPointFromPixels(pos.x, pos.y)
    }
    const aiPos = this.ecs.getComponents(entity).get(Position)
    const _start = getGridPointFromPixels(aiPos.x, aiPos.y)
    const path = aStar(_start, _end, this.obstacles)
    if (!path) {
      // console.warn('cant find path')
      return
    }
    if (path.length < 2) {
      return true
    }
    return getGridPointInPixels(...path[1])
  }

  findTargetEntity (entity: Entity, resources: number[]):void {
    const comps = this.ecs.getComponents(entity)
    const ai = comps.get(AI)
    for (const res of resources) {
      if (!this.targetList[res]) {
        const resC = this.ecs.getComponents(res)
        if (resC.get(Draggable)?.dragging) {
          continue
        }
        const pos = resC.get(Position)
        // its in yard
        if (isPointerIn(pos, YARD)) {
          continue
        }

        const path = this.findTargetPath(entity, res)
        if (!path) {
          continue
        }

        ai.targetEntity = res
        this.targetList[res] = entity
        ai.state = AIState.toTarget
        if (path === true) {
          this.tooglePickup(entity, res)
        } else {
          ai.targetPos = path
        }

        return
      }
    }
  }

  update (entities: Set<number>): void {
    if (!this.inited) {
      this.init()
    }

    const ent = [...entities]

    const aiEntities = ent.filter((e) => {
      return !!this.ecs.getComponents(e).get(AI)
    })

    if (this.next <= 0) {
      const resources = ent.filter((e) => {
        return !!this.ecs.getComponents(e).get(Sellable)
      })

      for (const aiEntity of aiEntities) {
        const ai = this.ecs.getComponents(aiEntity).get(AI)
        if (!ai.targetEntity) {
          this.findTargetEntity(aiEntity, resources)
        }
      }
    }

    for (const aiEntity of aiEntities) {
      const ai = this.ecs.getComponents(aiEntity).get(AI)
      if (ai.targetPos) {
        this.aiMove(aiEntity)
      }
    }

    if (this.next <= 0) {
      this.next = interval
    }

    this.next -= this.ecs.currentDelta
  }
}
