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
  const [result, setResult] = useState({
    data: [],
    loading: false,
    pristine: true,
    stale: false,
  })

  const id = useIdentity()
  const scope = useScope(id)
  const evaluated = evaluateMany(expressions, scope)
  const identifier = JSON.stringify(evaluated)
  const shouldFetch = result.stale || hasActions(evaluated)

  /*
   * Calling only when evaluated result was changed.
   */
  useEffect(() => {
    if (!shouldFetch) {
      return
    }

    setResult(result => ({ ...result, loading: true }))

    return applyAll(
      evaluated,
      data =>
        setResult(result => ({
          ...result,
          data,
          loading: false,
          pristine: false,
          stale: false,
        })),
      // TODO: when multiple items became stale, that function will be called multiple
      // times.
      () => setResult(result => ({ ...result, stale: true }))
    )
  }, [identifier, shouldFetch])

  // TODO: when table changes page from 3(cached) to 4(not cached) for short time data from
  // page 2 will appear since it was last fetched in the state. Set cached data to state in case
  // identifiers are different.
  if (!shouldFetch) {
    return [evaluated.map(x => pipe(x)), false, false]
  }

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

  apply(onStale) {
    return this.fn(this.payload, onStale)
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

export const applyAction = (value, onStale) =>
  typeof value === "function"
    ? (...args) => applyAction(value(...args), onStale)
    : value instanceof Action
    ? value.apply(onStale)
    : value

const applyAll = (evaluated, onComplete, onStale) => {
  let canceled = false
  const output = evaluated.map(x => pipe(x, applyActionAsync, onStale))

  Promise.all(output).then(data => !canceled && onComplete(data))

  return () => {
    canceled = true
  }
}

const applyActionAsync = async (value, onStale) =>
  applyAction(await value, onStale)

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

const rollup = (items, prev, fn, onStale) => {
  if (!items.length) {
    return prev
  }

  const [head, ...tail] = items

  return rollup(
    tail,
    fn(typeof head === "function" ? head({ prev }) : head, onStale),
    fn
  )
}

/**
 * User can have 2 ways to pipe(first item type in the pipe determines whether we return function or value):
 * - Pipe function
 * - Pipe values
 */
const pipe = ([head, ...tail], fn = x => x, onStale) =>
  typeof head === "function"
    ? (...args) => rollup(tail, fn(head(...args), onStale), fn, onStale)
    : rollup(tail, fn(head, onStale), fn, onStale)
