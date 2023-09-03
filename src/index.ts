import { Surface } from './entities/surface'
import { LoggerSystem } from './systems/logger-system'
import { RenderSystem } from './systems/render-system'
import { GameController } from './utils/game-controller'
import './state/controls'

const fps = 48

const gameController = new GameController(
  [Surface],
  [RenderSystem, LoggerSystem]
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
