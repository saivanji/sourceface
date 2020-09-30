import { useEffect, useState } from "react"
import { isPlainObject } from "is-plain-object"
import * as engine from "packages/engine"
import * as template from "packages/template"
import { useScope, useIdentity } from "./container"

// TODO: rename commands to queries completely

export const useComputation = (...expressions) => {
  const id = useIdentity()
  const scope = useScope(id)

  return evaluateMany(expressions, scope).map(pipe)
}

export const useAsyncComputation = (...expressions) => {
  const [result, setResult] = useState({
    data: [],
    loading: false,
    pristine: true,
  })
  const id = useIdentity()
  const scope = useScope(id)
  const evaluated = _evaluateMany(expressions, scope)

  /*
   * Calling only when evaluated result was changed.
   */
  // TODO: getting "Can't perform a React state update on an unmounted component" error when component
  // is unmounted and mounted again. see "promise-hook" library for a fix.
  // TODO: module is displaying loader when entering edit mode. because entering edit mode causes that
  // component to completely re-mount, which make "pristine" to become "true" by default and therefore
  // affect spinner.
  useEffect(() => {
    const output = evaluated.map(applyAction)

    /**
     * When everything is sync no need to change "loading" variable and execute promises.
     */
    if (isSync(output)) {
      setResult(result => ({ ...result, data: output, pristine: false }))
    } else {
      setResult(result => ({ ...result, loading: true }))
      ;(async () => {
        const fetched = await Promise.all(output)
        setResult(result => ({
          ...result,
          data: fetched,
          loading: false,
          pristine: false,
        }))
      })()
    }
  }, [JSON.stringify(evaluated)])

  return [result.data, result.loading, result.pristine]
}

export const useTemplate = str => {
  const expressions = template.parse(str)
  const [results, loading, pristine] = useAsyncComputation(...expressions)

  return [template.replace(str, i => results[i]), loading, pristine]
}

export class Action {
  // TODO: use "group" field to mark that this action might be groupped with others and then given
  // to action function. Will be useful for calling many graphql queries in one request.
  constructor(fn, payload) {
    this.fn = fn
    this.payload = payload
  }

  apply() {
    return this.fn(this.payload)
  }
}

export class Bind {
  constructor(value) {
    this.value = value
  }
}

export const overScope = (scope, fn) => {
  let result = {}

  for (let key of Object.keys(scope)) {
    const value = scope[key]
    /**
     * "value" should be plain object so we make sure map only leaves in a scope.
     */
    result[key] = isPlainObject(value) ? overScope(value, fn) : fn(value)
  }

  return result
}

export const applyAction = value =>
  typeof value === "function"
    ? (...args) => applyAction(value(...args))
    : value instanceof Action
    ? value.apply()
    : value

const evaluateOptions = { namespaces: { local: "~" } }

/**
 * It is important to note that evaluation process should be pure and side-effect free
 * as well as return serializable results. That will allow to perform evaluation on every
 * render and apply async operations with "useEffect" hook when result was changed. Therefore
 * every function appeared in the scope should return "Action" object.
 */
const evaluateMany = (expressions, scope) => {
  // TODO: how to use other bounded variables inside of a bind?
  const evaluatedScope = overScope(scope, item =>
    item instanceof Bind
      ? engine.evaluate(item.value, scope, evaluateOptions)
      : item
  )

  return expressions.map(expression => {
    /**
     * In case expression not defined, returning "undefined" as a result. That's
     * needed for the cases when provided empty data from the config.
     * TODO: probably in the future will be removed when empty evaluation will be
     * implemented in engine. Or set default value of `expression` as empty array?
     */
    if (!expression) {
      return undefined
    }

    /**
     * User can have 2 ways to pipe(first item type in the pipe determines whether we return function or value?):
     * - Pipe function
     * - Pipe values
     */
    return expression.map(x =>
      engine.evaluate(x, evaluatedScope, evaluateOptions)
    )
  })
}

// TODO: fallback
const _evaluateMany = (expressions, scope) => {
  const evaluatedScope = overScope(scope, item =>
    item instanceof Bind
      ? engine.evaluate(item.value, scope, evaluateOptions)
      : item
  )

  return expressions.map(expression => {
    if (!expression) {
      return undefined
    }

    if (expression instanceof Array) {
      return engine.evaluate(expression[0], evaluatedScope, evaluateOptions)
    }

    // from template
    return engine.evaluate(expression, evaluatedScope, evaluateOptions)
  })
}

const isSync = items => !items.some(x => x instanceof Promise)

// TODO: use pipe/asyncPipe instead of applyAction in useComputation/useAsyncComputation

// TODO: syncRollup
const rollup = (items, initial) =>
  items.reduce(
    (prev, value) =>
      applyAction(typeof value === "function" ? value({ prev }) : value),
    initial
  )

// TODO: pipe will be used for both sync and async actions and will accept
// rollup function which can vary depending on whether it's sync or async
const pipe = ([head, ...tail]) =>
  typeof head === "function"
    ? (...args) => rollup(tail, applyAction(head(...args)))
    : rollup(tail, applyAction(head))

const asyncPipe = items => {}
