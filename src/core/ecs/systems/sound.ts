import { Entity, System } from '@/lib/ecs'
import { zzfx } from '@/lib/zzFx'
import { GameObject } from '../component'

export class SoundSystem extends System {
  inited = false
  state: {
    soundsPlaying: {
      [key: string]: number
    },
    muted: boolean,
    volume: number
  } = {
      soundsPlaying: {

      },
      muted: false,
      volume: 0.01
    }

  sounds = {
    // eslint-disable-next-line
    collide: [1.31, , 200, , 0.02, 0.01, 2, 2.1, , , , , , , -242, , , 0.53],

    // eslint-disable-next-line
    drop: [1.1,,332,,.06,.14,1,.31,,8,,,,,,.1,,.49,.01,.03],
    // eslint-disable-next-line
    pickup: [
      ,
      ,
      435,
      0.02,
      0.07,
      0.06,
      1,
      1.6,
      -12,
      ,
      ,
      ,
      ,
      ,
      ,
      ,,
      0.91,
      0.01
    ]
  }

  init () {
    // @ts-ignore
    this.ecs.ee.on('soundMute', () => {
      this.state.muted = !this.state.muted
    })

    for (const s in this.sounds) {
      this.state.soundsPlaying[s] = 0
      this.ecs.ee.on(s, () => {
        if (
          this.state.soundsPlaying[s] <= 0
        ) {
          // @ts-ignore
          zzfx(...this.sounds[s])
          this.state.soundsPlaying[s] = 300
        }
      })
    }
  }

  componentsRequired = new Set<Function>([GameObject])
  update (entities: Set<Entity>): void {
    if (!this.inited) {
      this.init()
      this.inited = true
    }
    // update volume
    // @ts-ignore
    window.zzfxV = this.state.volume

    for (const key in this.state.soundsPlaying) {
      // @ts-ignore
      if (this.state.soundsPlaying[key] > 0) {
        // @ts-ignore
        this.state.soundsPlaying[key] -= this.ecs.currentDelta
      }
    }
  }
}