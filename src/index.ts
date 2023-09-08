import { Player } from './entities/player'
import { Sack } from './entities/sack'
import { Surface } from './entities/surface'
import { ControllerSystem } from './systems/controller-system'
import { DirectionSystem } from './systems/direction-system'
import { HaulSystem } from './systems/haul-system'
import { LoggerSystem } from './systems/logger-system'
import { RenderSystem } from './systems/render-system'
import { WalkSystem } from './systems/walk-system'
import { GameController } from './utils/game-controller'

const fps = 48

const gameController = new GameController(
  [Surface, Player, Sack],
  [
    ControllerSystem, DirectionSystem,
    HaulSystem, WalkSystem, RenderSystem,
    LoggerSystem
  ]
)

function animate (
  fn: (frames: number) => boolean | void,
  startTime = Date.now()
) {
  const currentTime = Date.now()
  const elapsedFrames = (currentTime - startTime) * fps / 1000
  const result = fn(elapsedFrames) // wrap with try catch?

  if (result !== false) {
    window.requestAnimationFrame(() => {
      animate(fn, currentTime)
    })
  }
}

function gameLoop (elapsedFrames: number) {
  gameController.update(elapsedFrames)
}

animate(gameLoop)
