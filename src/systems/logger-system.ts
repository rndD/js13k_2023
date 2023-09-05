import { System } from '@/utils/elements'

export class LoggerSystem extends System {
  _lastOutput: number

  constructor () {
    super()

    this._lastOutput = Date.now()
  }

  update (
    elapsedFrames: number,
    totalFrames: number,
    perf: unknown
  ) {
    const delta = Date.now() - this._lastOutput
    if (delta > 2000) {
      this._lastOutput = Date.now()
      console.table(perf)
    }
  }
}
