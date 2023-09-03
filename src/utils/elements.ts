export class Component {}

export class Entity {
  components: Component[]

  constructor () {
    this.components = []
  }
}

export class System {
  _requiredComponent?: Component
  _requiredEntity?: Entity

  components?: Component[]
  entity?: Entity

  update (elapsedFrames: number, totalFrames: number, perf: unknown) {}
}
