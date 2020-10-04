import { useEffect, useState } from "react"
import { isPlainObject } from "is-plain-object"
import * as engine from "packages/engine"
import * as template from "packages/template"
import { useScope, useIdentity } from "./container"

// TODO: rename commands to queries completely

export const useFunction = (...expressions) => {
  const id = useIdentity()
  const scope = useScope(id)

  return evaluateMany(expressions, scope).map(x => pipeFunction(x))
}

export const useValue = (...expressions) => {
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

  /*
   * Calling only when evaluated result was changed.
   */
  useEffect(() => {
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
  }, [identifier, result.stale])

  // TODO: there is a short blink on component mount(first render) when evaluation data is
  // cached. It's happening because we apply actions in this case asynchronously and it takes
  // extremely short time. Think, how to return cached data on a first render while subscribing on
  // invalidation at the same time.

  return [result.data, result.loading, result.pristine]
}

export const useTemplate = str => {
  const expressions = template.parse(str).map(x => [x])
  const [results, loading, pristine] = useValue(...expressions)

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
  const output = evaluated.map(x => pipeValue(x, () => !canceled && onStale()))

  Promise.all(output).then(data => !canceled && onComplete(data))

  return () => {
    canceled = true
  }
}

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

const rollup = async (items, prev, onStale) => {
  if (!items.length) {
    return prev
  }

  const [head, ...tail] = items

  return rollup(
    tail,
    await applyAction(
      typeof head === "function" ? head({ prev }) : head,
      onStale
    ),
    onStale
  )
}

const pipeValue = async ([head, ...tail], onStale) =>
  rollup(tail, await applyAction(head, onStale), onStale)

const pipeFunction = ([head, ...tail], onStale) => (...args) =>
  pipeValue([head(...args), ...tail], onStale)
