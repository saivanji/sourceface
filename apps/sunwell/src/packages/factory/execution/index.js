import { useEffect, useState } from "react"
import { mergeLeft } from "ramda"
import { useEditor } from "../editor"
import { useModule } from "../module"
import { useContainer } from "../container"
import { useVariables } from "../variables"
import Cache from "./cache"

let cache = new Cache()

export const useFunction = () => {
  return [() => {}]
}

export const useValue = (...input) => {
  const { stock } = useContainer()
  const { selectors } = useEditor()
  const { module } = useModule()
  const { evaluate } = useVariables(module.id)

  const [result, setResult] = useState({
    data: [],
    error: null,
    loading: false,
    pristine: true,
  })

  const sequences = input.map((actionIds) =>
    serializeSequence(selectors.actions(actionIds), stock, evaluate)
  )

  const initial = result.pristine && init(input, stock, evaluate, selectors)

  useEffect(() => {
    let canceled = false
    const start = () => !canceled && setResult(mergeLeft({ loading: true }))
    const failure = (error) => !canceled && setResult(mergeLeft({ error }))
    const populate = (data) =>
      !canceled &&
      setResult(
        mergeLeft({ data, loading: false, pristine: false, error: null })
      )

    if (initial) {
      populate(initial)

      return
    }

    start()
    Promise.all(sequences.map(applyMany)).then(populate).catch(failure)

    return () => {
      canceled = true
    }
  }, [JSON.stringify(sequences)])

  if (initial) {
    return [initial, false, false, null]
  }

  return [result.data, result.loading, result.pristine, result.error]
}

const serializeSequence = (actions, stock, evaluate) =>
  actions.map(({ id, config, type }) => {
    const { serialize, execute, settings = {} } = stock.actions.dict[type]
    const args = serialize(config, evaluate)
    const initialFn = execute(config, {})

    const fn = settings.cacheable
      ? (...args) => cache.apply(id, args, initialFn)
      : initialFn

    return [fn, args]
  })

const applyMany = async ([[fn, args], ...tail]) => {
  const out = await fn(...args)

  if (!tail.length) {
    return out
  }

  return applyMany(tail)
}

const init = (input, stock, evaluate, selectors) => {
  let result = []

  for (let actionIds of input) {
    const output = selectors
      .actions(actionIds)
      .reduce((acc, { id, config, type }) => {
        if (!result) {
          return
        }

        const { serialize, execute, settings } = stock.actions.dict[type]

        const args = serialize(config, evaluate)
        const cached = cache.get(cache.stringify(id, args))

        if (settings.cacheable && !cached) {
          result = null
          return
        }

        return !settings.effect && !settings.cacheable
          ? execute(config, {})
          : cached
      }, null)

    result?.push(output)
  }

  return result
}
