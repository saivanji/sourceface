import { useEffect, useState } from "react"
import * as engine from "packages/engine"
import * as template from "packages/template"
import { useContainer, useScope, useIdentity } from "./container"

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
  // TODO: getting "Can't perform a React state update on an unmounted component" error when component
  // is unmounted and mounted again. see "promise-hook" library for a fix.
  // TODO: module is displaying loader when entering edit mode. because entering edit mode causes that
  // component to completely re-mount, which make "pristine" to become "true" by default and therefore
  // affect spinner.
  useEffect(() => {
    const output = evaluated.map(value => applyEffect(value, effects))

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

const isSync = items => !items.some(x => x instanceof Promise)
