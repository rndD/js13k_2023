// eslint-disable-next-line max-classes-per-file
import { Component } from '@/lib/ecs'

export type EntityType =
  | 'wall'
  | 'door'
  | 'crate'
  | 'floor'
  | 'roof'
  | 'sellPoint'
  | 'spawnPoint'
  | 'stairs'
  | 'ice'
  | 'water';

export enum Layers {
  Background,
  Floor,
  Points,
  Objects,
  Effects,
  AlwaysOnTop,
  UI,
}

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
    public sprite: [number, number],
    public layer: Layers,
    public spriteAngle: number = 0,
    public visible: boolean = true
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
  constructor (public wh: { w: number; h: number }, public colliding = false) {
    super()
  }
}

export class Draggable extends Component {
  constructor (
    public draggable: boolean = true,
    public dragging: boolean = false,
    public hovered: boolean = false,
    public dropped: boolean = false
  ) {
    super()
  }
}

export class FloorPoint extends Component {
  constructor (public occupiedBy: number = -1) {
    super()
  }
}

interface SpawnTimer {
  nextSpawn?: number;
  spawnInterval?: number;
  whatToSpawn?: EntityType;
}

export class SpawnPoint extends Component {
  constructor (public timer: SpawnTimer) {
    super()
  }
}

interface SoundData {
  // TODO do we need this?
}

export class Soundable extends Component {
  constructor (public sound: SoundData) {
    super()
  }
}

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
