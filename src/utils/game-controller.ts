import { invariant } from './validate'

export class Component {}

export class Entity {
  _components: Component[]

  constructor () {
    this._components = []
  }
}

export class System {
  static requiredComponents?: Component

  components: Component[]
  constructor (components: Component[]) {
    this.components = components
  }

  update (elapsedFrames: number, totalFrames: number) {}
}

/**
 * GameController acts as a glue between entities and systems
 */

export class GameController {
  _components: Component[]
  _entities: Entity[]
  _systems: System[]
  _totalFrames: number

  constructor (
    entities: Array<typeof Entity>,
    systems: Array<typeof System>
  ) {
    this._components = []
    this._entities = []
    this._systems = []
    this._totalFrames = 0

    entities.forEach(EntityKlass => {
      const entity = new EntityKlass()
      invariant(entity instanceof Entity)
      this._entities.push(entity)

      entity._components.forEach(component => {
        invariant(component instanceof Component)
        this._components.push(component)
      })
    })

    systems.forEach(SystemKlass => {
      const requiredComponents = SystemKlass.requiredComponents
      const components = requiredComponents != null
        ? this._components.filter(component =>
          component instanceof requiredComponents)
        : []

      const system = new SystemKlass(components)
      invariant(system instanceof System)
      this._systems.push(system)
    })
  }

  update (elapsedFrames: number) {
    const totalFrames = this._totalFrames / 10

    this._systems.forEach(system => {
      system.update(elapsedFrames, totalFrames)
    })

    this._totalFrames = (this._totalFrames + (elapsedFrames * 10) >> 0) % 10000
  }
}
