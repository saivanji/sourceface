import { useEffect, useState } from "react"
import { isPlainObject } from "is-plain-object"
import * as engine from "packages/engine"
import * as template from "packages/template"
import { useScope, useIdentity } from "./container"

// TODO: rename commands to queries completely

// TODO: since we pass applyAction (not async) it might be a reason that async functions in a pipe
// applied synchronously.
//
// TODO: rename to "useFunction"
export const useComputation = (...expressions) => {
  const id = useIdentity()
  const scope = useScope(id)

  return evaluateMany(expressions, scope).map(x => pipe(x, applyAction))
}

// TODO: rename to "useValue"

// TODO: the major problem is when we get cached data we still need to be subscribed on cache changes. With
// current setup that's not possible since "onStale" function is passed at a point when we apply Action and
// we get cached data, we don't have actions in evaluated data and therefore not applying them. We're using such
// approach in order to avoid triggering "loading" variable and therefore displaying spinner at short amount of
// time in case when it's not needed.
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
  // TODO: most likely if all functions from the scope should return Action objects, executeCommand function
  // do not need to return raw data from the cache and therefore `hasActions` will always be true. Need to rethink
  // how to understand that data is cached.
  const shouldFetch = result.stale || hasActions(evaluated)

  /*
   * Calling only when evaluated result was changed.
   */
  useEffect(() => {
    if (!shouldFetch) {
      setResult(result => ({
        ...result,
        data: evaluated.map(x => pipe(x)),
      }))
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
      // TODO: do we need to provide "onStale" here at all? or it's enough to provide it only
      // on cached pipe? probably need to remove
      () => setResult(result => ({ ...result, stale: true }))
    )
  }, [identifier, shouldFetch])

  return [result.data, result.loading, result.pristine]
}

export const useTemplate = str => {
  const expressions = template.parse(str).map(x => [x])
  const [results, loading, pristine] = useAsyncComputation(...expressions)

  return [template.replace(str, i => results[i]), loading, pristine]
}

// TODO: experiment, can Action be either sync or async? or always async consideres as side effect?
// TODO: should all functions in the scope return Actions, even they do pure computation? if yes, why?
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
  const output = evaluated.map(x =>
    pipe(x, applyActionAsync, () => !canceled && onStale())
  )

  Promise.all(output).then(data => !canceled && onComplete(data))

  return () => {
    canceled = true
  }
}

// TODO: remove in favor of "applyAction", since rollup function will be always async
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

// TODO: it should be "async" function in all cases since we need to apply pipes asynchronously
// for the functions
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
// TODO: split on pipeFunction and pipeValue functions
// TODO: 2nd argument will be removed since we'll use applyAction everywhere
const pipe = ([head, ...tail], fn = x => x, onStale) =>
  typeof head === "function"
    ? (...args) => rollup(tail, fn(head(...args), onStale), fn, onStale)
    : rollup(tail, fn(head, onStale), fn, onStale)
