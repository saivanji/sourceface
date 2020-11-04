import { useEffect, useState } from "react"
import { isPlainObject } from "is-plain-object"
import * as engine from "packages/engine"
import * as template from "packages/template"
import { useScope, useIdentity } from "./container"

// TODO: move pipelining to a separate package?

// TODO: rename commands to queries completely

export const useFunction = (...expressions) => {
  const id = useIdentity()
  const scope = useScope(id)

  return evaluateMany(expressions, scope).map(rollupFunction)
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
    let canceled = false
    const reload = () =>
      !canceled && setResult(result => ({ ...result, stale: true }))
    const populate = data =>
      !canceled &&
      setResult(result => ({
        ...result,
        data,
        loading: false,
        pristine: false,
        stale: false,
      }))

    setResult(result => ({ ...result, loading: true }))
    Promise.all(evaluated.map(pipe => rollupValue(pipe, reload))).then(populate)

    return () => {
      canceled = true
    }
  }, [identifier, result.stale])

  if (result.pristine && isSyncEvaluation(evaluated)) {
    /**
     * No need to subscribe on invalidation since we always subscribe to it in "useEffect".
     */
    return [evaluated.map(pipe => rollupValue(pipe)), false, false]
  }

  return [result.data, result.loading, result.pristine]
}

export const useTemplate = str => {
  const expressions = template.parse(str).map(x => [x])
  const [results, loading, pristine] = useValue(...expressions)

  return [template.replace(str, i => results[i]), loading, pristine]
}

export class Action {
  // TODO: use "group" field to mark that this action might be groupped with others and then given
  // to action function. Will be useful for calling many graphql queries in one request.
  constructor(fn, payload, isSync) {
    this.fn = fn
    this.payload = payload
    this.isSync = isSync
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

  return expressions.map((pipe = []) =>
    pipe.map(stage => engine.evaluate(stage, evaluatedScope, evaluateOptions))
  )
}

const processStage = (stage, args) =>
  typeof stage === "function" ? stage(args) : stage

const rollupValue = (items, onStale, prev) => {
  if (!items.length) {
    return prev
  }

  const [head, ...tail] = items
  const applied = applyAction(processStage(head, { prev }), onStale)

  if (applied instanceof Promise) {
    return applied.then(data => rollupValue(tail, onStale, data))
  }

  return rollupValue(tail, onStale, applied)
}

const rollupFunction = ([head, ...tail]) => args =>
  rollupValue([processStage(head, args), ...tail])

const isSyncEvaluation = data =>
  data.every(pipe =>
    pipe.every(stage => !(stage instanceof Action) || stage.isSync)
  )
