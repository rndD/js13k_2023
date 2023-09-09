import { drawEngine } from '@/core/draw-engine'
import { controls } from '@/core/controls'
import { gameStateMachine } from '@/game-state-machine'
import { State } from '@/core/state-machine'
import { I_ARROW_HAND, I_COIN, SACK, SIGN, resourcesSprites } from '@/tiles'
import { randomFromList } from '@/lib/utils'
import { getGameState } from './game.state'

const helpText =
`Welcome to Mini Merchant(js13k games 2023 entry)!
You are a merchant who has to sell goods to the people of the village.
Use your mouse to interact with the world. Drag&Drop items near the stole to sell them.
Read more about possible interactions by clicking on 
You have a short live, so you have to sell as much as possible in 5 min.
TIP: Prepare more goods in your yard in advance. 

`.split('\n').map((s) => s.trim())
class MenuState implements State {
  private selected = 0

  coins = Array(200).fill({}).map(() => ({
    x: Math.random() * drawEngine.w,
    y: Math.random() * -200 - 10,
    vx: Math.random() * 2 - 1,
    vy: Math.random() * 5 - 1,
    s: randomFromList([I_COIN, I_COIN, resourcesSprites.wood, SACK])
  }))

  updateCoins () {
    this.coins.forEach((c) => {
      c.x += c.vx
      c.y += c.vy
      c.vy += 0.1
      if (c.x < 0 || c.x > drawEngine.w) {
        c.vx *= -1
      }
      if (c.y > drawEngine.h) {
        c.y = 0
        c.vy = Math.min(c.vy, 8)
      }
    })
  }

  drawCoins () {
    this.coins.forEach((c) => {
      drawEngine.drawEntity({ x: c.x, y: c.y }, c.s)
    })
  }

  onUpdate () {
    const xCenter = drawEngine.w / 2

    if (!drawEngine.ready) {
      drawEngine.drawText('Loading...', 80, xCenter, 90)
      return
    }
    this.updateCoins()

    drawEngine.drawBg()

    this.drawCoins()

    // draw box for text
    drawEngine.drawBox(0, 0, drawEngine.w, drawEngine.h)

    drawEngine.drawText('Mini merchant', 80, xCenter + 2, 90, 'blacks')
    drawEngine.drawText('Mini merchant', 80, xCenter, 90, 'gold')

    drawEngine.drawBox(0, 150, drawEngine.w, 210, false)
    helpText.forEach((t, i) => drawEngine.drawText(t, 22, xCenter, 180 + (i * 32), 'white'))
    drawEngine.drawEntity({ x: xCenter + 350, y: 250 }, SIGN)

    drawEngine.drawText(
      'Start Game',
      60,
      xCenter,
      600,
      this.selected === 1 ? 'gold' : 'white'
    )
    drawEngine.drawText(
      'Toggle Fullscreen',
      60,
      xCenter,
      700,
      this.selected === 2 ? 'gold' : 'white'
    )

    drawEngine.drawIcon(controls.mousePosition.x, controls.mousePosition.y, I_ARROW_HAND)

    this.updateControls()
  }

  updateControls () {
    const { y } = controls.mousePosition
    if (y < 610 && y > 550) {
      this.selected = 1
    } else if (y > 660) {
      this.selected = 2
    } else {
      this.selected = 0
    }
    // Autoskip for testing
    if (drawEngine.ready) {
      gameStateMachine.setState(getGameState())
    }

    // if (
    //   (controls.isUp && !controls.previousState.isUp) ||
    //   (controls.isDown && !controls.previousState.isDown)
    // ) {
    //   this.isStartSelected = !this.isStartSelected
    // }

    if (controls.isMouseDown) {
      if (this.selected === 1) {
        gameStateMachine.setState(getGameState())
      } else if (this.selected === 2) {
        this.toggleFullscreen()
        controls.isMouseDown = false
      }
    }
  }

  toggleFullscreen () {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }
}

export const menuState = new MenuState()
