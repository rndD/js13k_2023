export class Component {
  // eslint-disable-next-line no-useless-constructor
  constructor (...args: any[]) {}
}

export class Entity {
  components: Component[]

  constructor () {
    this.components = []
  }
}

export class System {
  _requiredComponent?: typeof Component
  _requiredEntity?: typeof Entity

  components?: Component[]
  entity?: Entity

  update (elapsedFrames: number, totalFrames: number, perf: unknown) {}
}
