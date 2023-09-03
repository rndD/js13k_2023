import { Component, Entity, System } from './elements'

import { isInstance } from './helpers'
import { invariant } from './validate'

/**
 * GameController acts as a glue between entities and systems
 */

export class GameController {
  _components: Component[]
  _entities: Entity[]
  _systems: System[]

  _perf: {[name: string]: number}
  _totalFrames: number

  constructor (
    entities: Array<typeof Entity>,
    systems: Array<typeof System>
  ) {
    this._components = []
    this._entities = entities.map(EntityFactory => {
      const entity = new EntityFactory()
      invariant(entity instanceof Entity)
      this._components.push(...entity.components)
      return entity
    })

    this._systems = systems.map(SystemFactory => {
      const system = new SystemFactory()
      invariant(system instanceof System)

      if (system._requiredComponent != null) {
        system.components = this._components.filter(component =>
          isInstance(component, system._requiredComponent))
      }

      if (system._requiredEntity != null) {
        system.entity = this._entities.find(entity =>
          isInstance(entity, system._requiredEntity))
      }

      return system
    })

    this._perf = {}
    this._totalFrames = 0
  }

  update (elapsedFrames: number) {
    const totalFrames = this._totalFrames / 10

    this._systems.forEach(system => {
      const startTime = Date.now()
      system.update(elapsedFrames, totalFrames, this._perf)
      this._perf[system.constructor.name] = Date.now() - startTime
    })

    this._totalFrames = (this._totalFrames + (elapsedFrames * 10) >> 0) % 10000
  }
}
