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

  return evaluateMany(expressions, scope, effects)
}

export const useAsyncComputation = (...expressions) => {
  const [result, setResult] = useState({ data: [], isLoading: true })
  const { effects } = useContainer()
  const id = useIdentity()
  const scope = useScope(id)

  // TODO: recalculate when scope changed
  useEffect(() => {
    const output = evaluateMany(expressions, scope, effects)
    const process = async () => {
      setResult(result => ({ ...result, isLoading: true }))
      const fetched = await Promise.all(output)
      setResult(result => ({ ...result, data: fetched, isLoading: false }))
    }
    process()
  }, expressions)

  return [result.data, result.isLoading]
}

export const useTemplate = str => {
  const expressions = template.parse(str)

  const [results, isLoading] = useAsyncComputation(...expressions)

  return [template.replace(str, i => results[i]), isLoading]
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

const evaluateMany = (expressions, scope, effects) =>
  expressions.map(expression => {
    /**
     * In case expression not defined, returning "undefined" as a result. That's
     * needed for the cases when provided empty data from the config.
     */
    if (!expression) {
      return undefined
    }

    const result = engine.evaluate(expression, scope, evaluateOptions)

    if (typeof result === "function") {
      return args => applyEffect(result(args), effects)
    }

    return applyEffect(result, effects)
  })

const applyEffect = (value, effects) =>
  value instanceof Effect ? effects[value.type](value.payload) : value
