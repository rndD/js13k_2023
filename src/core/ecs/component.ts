// eslint-disable-next-line max-classes-per-file
import { Component } from '@/lib/ecs'
import { Layers } from './systems/render'

export type EntityType =
  | 'wall'
  | 'door'
  | 'freight'
  | 'floor'
  | 'roof'
  | 'sellPoint'
  | 'spawnPoint'
  | 'stairs'
  | 'ice'
  | 'water';

// FIXME remove super to reduce size

export class GameObject extends Component {
  constructor (public type: EntityType) {
    super()
  }
}

export class Pos extends Component {
  constructor (public x: number, public y: number) {
    super()
  }
}

export class Mov extends Component {
  constructor (public dx = 0, public dy = 0) {
    super()
  }
}

export class Renderable extends Component {
  constructor (
    public sprite: number | undefined,
    public layer: Layers,
    public spriteAngle: number = 0,
    public visible: boolean = true,
    public carry: number|null = null
  ) {
    super()
  }
}

interface Physics {
  mass?: number;
  friction?: number;
}

export class Physical extends Component {
  constructor (public data: Physics) {
    super()
  }
}

export class Collidable extends Component {
  constructor (public wh: { w:number, h: number }) {
    super()
  }
}

export class Draggable extends Component {
  constructor (
    public draggable: boolean = true,
    public dragging: boolean = false,
    public hovered: boolean = false
  ) {
    super()
  }
}

export class FloorPoint extends Component {
  constructor (public occupiedBy: number = -1) {
    super()
  }
}

// interface SpawnTimer {
//   nextSpawn?: number;
//   spawnInterval?: number;
//   whatToSpawn?: EntityType;
// }

// export class SpawnPoint extends Component {
//   constructor (public timer: SpawnTimer) {
//     super()
//   }
// }

interface PhysicsModifiers {
  frictionMulti?: number;
  massMulti?: number;
  dx?: number;
  dy?: number;
}

export class FloorModifier extends Component {
  constructor (public physicsModifiers: PhysicsModifiers) {
    super()
  }
}

export class Particle extends Component {
  constructor (
    public lifeTime: number,
    public size: number,
    public color: string
  ) {
    super()
  }
}

type Resource = 'wood' | 'stone' | 'food';

type BuyerState = 'walking' | 'buying' | 'inQ' | 'walkingBack';
export class Buyer extends Component {
  // @ts-ignore
  constructor (public resToBuy: { [key: Resource]: number } = {}, public time: number, public targetPos: [number, number], public queuePos: number = -1, public state: BuyerState = 'walking', public bought: boolean = false) {
    super()
  }
}
