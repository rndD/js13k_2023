const keyMap = {
  ArrowDown: 'isDown',
  ArrowLeft: 'isLeft',
  ArrowRight: 'isRight',
  ArrowUp: 'isUp',

  ы: 'isDown',
  ф: 'isLeft',
  в: 'isRight',
  ц: 'isUp',

  s: 'isDown',
  a: 'isLeft',
  d: 'isRight',
  w: 'isUp',

  Enter: 'isAction',
  ' ': 'isAction'
}

class Controls {
  isDown: boolean
  isUp: boolean
  isLeft: boolean
  isRight: boolean
  isAction: boolean

  constructor () {
    this.isDown = false
    this.isUp = false
    this.isLeft = false
    this.isRight = false
    this.isAction = false

    document.addEventListener('keydown', (event: KeyboardEvent) => {
      this._setKey(event, event.key, true)
    })

    document.addEventListener('keyup', (event: KeyboardEvent) => {
      this._setKey(event, event.key, false)
    })
  }

  _setKey (event: KeyboardEvent, key: string, value: boolean) {
    // @ts-ignore
    const prop = keyMap[key]
    if (prop != null) {
      // @ts-ignore
      this[prop] = value
      event.preventDefault()
    }
  }
}

export default new Controls()
