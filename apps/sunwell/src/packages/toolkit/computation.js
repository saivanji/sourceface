import { useEffect, useState } from "react"
import * as engine from "packages/engine"
import * as template from "packages/template"
import { useContainer, useScope, useIdentity } from "./container"

// TODO: completely refactor the way we perform evaluation.
// - change the way we execute queries(use external cache)
//   - should query execution be in the app side(probably in a separate package, query fetching(not with urql) + cache) and that module will just accept the list of execution functions?
//   Responsibility of that part is code evaluation for modules. It's completely not aware of queries, it's caching and other business logic details

// TODO: rename commands to queries completely

export const useComputation = (...expressions) => {
  const { effects } = useContainer()
  const id = useIdentity()
  const scope = useScope(id)

  return evaluateMany(expressions, scope).map(value =>
    applyEffect(value, effects)
  )
}

export const useAsyncComputation = (...expressions) => {
  const [result, setResult] = useState({
    data: [],
    loading: false,
    pristine: true,
  })
  const { effects } = useContainer()
  const id = useIdentity()
  const scope = useScope(id)
  const evaluated = evaluateMany(expressions, scope)

  /*
   * Calling only when evaluated result was changed.
   */
  useEffect(() => {
    const output = evaluated.map(value => applyEffect(value, effects))

    ;(async () => {
      setResult(result => ({ ...result, loading: true }))
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
  const expressions = template.parse(str)
  const [results, loading, pristine] = useAsyncComputation(...expressions)

  return [template.replace(str, i => results[i]), loading, pristine]
}

export class Effect {
  // TODO: use "group" field to mark that this effect might be groupped with others and then given
  // to effect function. Will be useful for calling many graphql queries in one request.
  constructor(type, payload) {
    this.type = type
    this.payload = payload
  }
}

const evaluateOptions = { namespaces: { local: "~" } }

const evaluateMany = (expressions, scope) =>
  expressions.map(expression => {
    /**
     * In case expression not defined, returning "undefined" as a result. That's
     * needed for the cases when provided empty data from the config.
     */
    if (!expression) {
      return undefined
    }

    return engine.evaluate(expression, scope, evaluateOptions)
  })

const applyEffect = (value, effects) =>
  typeof value === "function"
    ? (...args) => applyEffect(value(...args), effects)
    : value instanceof Effect
    ? effects[value.type](value.payload)
    : value
