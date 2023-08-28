// W to @stasm for https://github.com/stasm/innerself

/* eslint-disable @typescript-eslint/no-invalid-void-type */
type HTML = (
  components: TemplateStringsArray,
  ...values: Array< | boolean
  | void
  | null
  | string
  | number
  | Array<void | null | boolean | string | number>>
) => string
/* eslint-enable @typescript-eslint/no-invalid-void-type */

export const html: HTML = ([first, ...strings], ...values) => {
  // Weave the literal strings and the interpolations.
  // We don't have to explicitly handle array-typed values
  // because concat will spread them flat for us.
  return (
    values
      .reduce(
        (acc: any[], cur: any) => acc.concat(cur, strings.shift()),
        [first]
      )

      // Filter out interpolations which are bools, null or undefined.
      .filter((x) => (x && x !== true) || x === 0) // eslint-disable-line @typescript-eslint/strict-boolean-expressions
      .join('')
  )
}

export type CreateStore = <State, Action>(
  reducer: (state: State, action: Action, params: unknown) => State
) => {
  /**
   * dispatch an app action
   */
  dispatch: (action: Action, ...args: any[]) => void

  /**
   * mount a component on an element
   */
  attach: <Component extends (...args: any[]) => string>(
    component: Component,
    root: Element
  ) => void

  /**
   * attach the app state to a component
   */
  connect: ((component: (state: State) => string) => () => string) & (<A>(component: (state: State, a: A) => string) => (a: A) => string) & (<A, B>(
    component: (state: State, a: A, b: B) => string
  ) => (a: A, b: B) => string) & (<A, B, C>(
    component: (state: State, a: A, b: B, c: C) => string
  ) => (a: A, b: B, c: C) => string) & ((
    component: (state: State, ...args: any[]) => string
  ) => (...args: any[]) => string)
}

export const createStore: CreateStore = (reducer) => {
  // @ts-expect-error
  let state = reducer()
  const roots = new Map()
  const prevs = new Map()

  function render (): void {
    for (const [root, component] of roots) {
      const output = component()

      // Poor man's Virtual DOM implementation :)  Compare the new output
      // with the last output for this root.  Don't trust the current
      // value of root.innerHTML as it may have been changed by other
      // scripts or extensions.
      if (output !== prevs.get(root)) {
        prevs.set(root, (root.innerHTML = output))

        // Dispatch an event on the root to give developers a chance to
        // do some housekeeping after the whole DOM is replaced under
        // the root. You can re-focus elements in the listener to this
        // event. See example03.
        root.dispatchEvent(new CustomEvent('render', { detail: state }))
      }
    }
  }

  return {
    attach (component, root) {
      roots.set(root, component)
      render()
    },
    // @ts-expect-error
    connect (component) {
      // Return a decorated component function.
      // @ts-expect-error
      return (...args) => component(state, ...args)
    },
    dispatch (action, ...args) {
      state = reducer(state, action, args)
      render()
    }
  }
}
