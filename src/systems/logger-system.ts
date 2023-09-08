import { Player } from '@/entities/player'
import { Entity, System } from '@/utils/elements'

export class LoggerSystem extends System {
  _container: HTMLPreElement
  _lastOutput: number

  entities?: Player[]

  constructor () {
    super()

    this._container = document.createElement('pre')
    // @ts-ignore
    this._container.style = 'margin: 1rem;'
    this._lastOutput = Date.now()
    this._requiredEntities = [Player]

    document.body.append(this._container)
  }

  _serializeEntity (entity: Entity) {
    const components = '  ' + entity.components
      .map(component => {
        const name = component.constructor.name
        const keys = Object.keys(component).map(key => {
          // @ts-ignore
          const value = component[key]
          return `${key}: ${typeof value === 'object' ? '{...}' : value}`
        }).join(', ')
        return `${name} { ${keys} }`
      }).join('\n  ')

    return [
      entity.constructor.name + ' [',
      components,
      ']'
    ].join('\n')
  }

  update () {
    const player = this.entities![0]
    this._container.innerHTML = this._serializeEntity(player)
  }
}
