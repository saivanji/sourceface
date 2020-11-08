import { useEffect, useState } from "react"
import { mergeLeft } from "ramda"
import { useEditor } from "../editor"
import { useModule } from "../module"
import { useContainer } from "../container"
import { useVariables } from "../variables"

export const useFunction = () => {
  return [() => {}]
}

export const useValue = (...input) => {
  const { stock, queries } = useContainer()
  const { selectors } = useEditor()
  const { module } = useModule()
  const { evaluate } = useVariables(module.id)
  const deps = { queries }

  const [result, setResult] = useState({
    data: [],
    error: null,
    loading: false,
    pristine: true,
    stale: false,
  })

  const sequences = input.map((actionIds) =>
    prepare(selectors.actions(actionIds), evaluate, stock, (execute, args) => [
      (onReload) => execute(deps, { onReload })(...args),
      args,
    ])
  )

  const initial =
    result.pristine && init(input, evaluate, stock, deps, selectors)

  useEffect(() => {
    let canceled = false
    const start = () => !canceled && setResult(mergeLeft({ loading: true }))
    const failure = (error) => !canceled && setResult(mergeLeft({ error }))
    const populate = (data) =>
      !canceled &&
      setResult(
        mergeLeft({ data, loading: false, pristine: false, error: null })
      )
    const reload = () => !canceled && setResult(mergeLeft({ stale: true }))

    if (initial) {
      populate(initial)

      return
    }

    start()
    Promise.all(sequences.map((seq) => reduce((prev, [fn]) => fn(reload), seq)))
      .then(populate)
      .catch(failure)

    return () => {
      canceled = true
    }
  }, [JSON.stringify(sequences), result.stale])

  if (initial) {
    return [initial, false, false, null]
  }

  return [result.data, result.loading, result.pristine, result.error]
}

const prepare = (actions, evaluate, stock, fn) =>
  actions.map(({ config, type }) => {
    const { serialize, execute } = stock.actions.dict[type]
    const args = serialize(config, evaluate)

    return fn(execute, args)
  })

const reduce = async (fn, [head, ...tail], acc) => {
  const out = await fn(acc, head)

  if (!tail.length) {
    return out
  }

  return reduce(fn, tail, out)
}

const init = (input, evaluate, stock, deps, selectors) => {
  let result = []

  for (let actionIds of input) {
    const output = selectors
      .actions(actionIds)
      .reduce((acc, { config, type }) => {
        if (!result) {
          return
        }

        const { serialize, execute, readCache, settings } = stock.actions.dict[
          type
        ]

        const args = serialize(config, evaluate)
        const cached = readCache(deps)(...args)
        const cacheable = !!readCache

        if (cacheable && !cached) {
          result = null
          return
        }

        return !settings?.effect && !cacheable
          ? execute(deps, {})(...args)
          : cached
      }, null)

    result?.push(output)
  }

  return result
}
