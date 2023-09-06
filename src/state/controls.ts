const keyMap = {
  ArrowDown: 'isDown',
  ArrowLeft: 'isLeft',
  ArrowRight: 'isRight',
  ArrowUp: 'isUp',
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

    document.addEventListener('keydown', event => {
      this._setKey(event.key, true)
    })

    document.addEventListener('keyup', event => {
      this._setKey(event.key, false)
    })
  }

  _setKey (key: string, value: boolean) {
    // @ts-ignore
    const prop = keyMap[key]
    // @ts-ignore
    if (prop != null) this[prop] = value
  }
}

export default new Controls()
