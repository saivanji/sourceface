import { useEffect, useState } from "react"
import { isPlainObject } from "is-plain-object"
import * as engine from "packages/engine"
import * as template from "packages/template"
import { useScope, useIdentity } from "./container"

// TODO: rename commands to queries completely

export const useComputation = (...expressions) => {
  const id = useIdentity()
  const scope = useScope(id)

  return evaluateMany(expressions, scope).map(x => pipe(x, applyAction))
}

export const useAsyncComputation = (...expressions) => {
  const id = useIdentity()
  const scope = useScope(id)
  const evaluated = evaluateMany(expressions, scope)
  const isReady = hasActions(evaluated)

  const [result, setResult] = useState({
    data: isReady ? [] : evaluated.map(x => pipe(x)),
    loading: false,
    pristine: isReady,
  })

  /*
   * Calling only when evaluated result was changed.
   */
  useEffect(() => {
    if (!isReady) {
      return
    }

    const output = evaluated.map(x => pipe(x, applyActionAsync))

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
  }, [JSON.stringify(evaluated)])

  return [result.data, result.loading, result.pristine]
}

export const useTemplate = str => {
  const expressions = template.parse(str).map(x => [x])
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

const applyActionAsync = async value => applyAction(await value)

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

  return expressions.map((pipes = []) =>
    pipes.map(x => engine.evaluate(x, evaluatedScope, evaluateOptions))
  )
}

const hasActions = items => items.some(x => x.some(y => y instanceof Action))

const rollup = (items, prev, fn) => {
  if (!items.length) {
    return prev
  }

  const [head, ...tail] = items

  return rollup(
    tail,
    fn(typeof head === "function" ? head({ prev }) : head),
    fn
  )
}

/**
 * User can have 2 ways to pipe(first item type in the pipe determines whether we return function or value):
 * - Pipe function
 * - Pipe values
 */
const pipe = ([head, ...tail], fn = x => x) =>
  typeof head === "function"
    ? (...args) => rollup(tail, fn(head(...args)), fn)
    : rollup(tail, fn(head), fn)
