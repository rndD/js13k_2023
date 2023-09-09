// eslint-disable-next-line max-classes-per-file
import { Component, Entity } from '@/lib/ecs'
import { Layers } from './systems/render'

export const enum Resource {
  wood,
  food,
  box,
  water,
  barrel
}

export const enum Obstacles {
  anvil,
  wagon
}

export class GameData extends Component {
  timeLeft = 5 * 1000 * 60
  level = 0
  constructor (public money: number) {
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

export interface Physics {
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

type PointType = 'sellPoint' | 'spawnPoint';
export class FloorPoint extends Component {
  constructor (public type: PointType, public occupiedBy: number = -1, public bindedTo: number = -1) {
    super()
  }
}

export type SellObjectType = Resource | 'point';
export class Sell extends Component {
  constructor (public type: SellObjectType, public price: number = -1) {
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
    public color: string,
    public sprite?: number
  ) {
    super()
  }
}

// @ts-ignore
type ResourceNMap = { [key: Resource]: number };
type BuyerState = 'walking' | 'buying' | 'inQ' | 'walkingBack';
export class Buyer extends Component {
  constructor (public resToBuy: ResourceNMap = {}, public time: number, public targetPos: [number, number], public queuePos: number = -1, public state: BuyerState = 'walking', public bought: boolean = false) {
    super()
  }
}

export class ResourceSource extends Component {
  constructor (public type: Resource, public needResource: ResourceNMap = {}, public interval: number = 0, public nextIn: number = 0) {
    super()
  }
}

export class Clickable extends Component {
  constructor (public icon: number, public withTop: boolean = false, public enabled: boolean = true, public hovered: boolean = false) {
    super()
  }
}

export const enum AIState {
  idle,
  toTarget,
  toBase
}

export class AI extends Component {
  state: AIState = AIState.idle
  targetPos: [number, number] | null = null
  targetEntity: Entity = -1
  constructor (public isFriendly: boolean = true) {
    super()
  }
}
