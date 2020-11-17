import { useEffect, useState } from "react"
import { mergeLeft } from "ramda"
import { useModule } from "../module"
import { useContainer } from "../container"
import { useVariables } from "../variables"
import { populateRelations } from "../action"

export const useFunction = (...input) => {
  const [executions] = useData(input)

  // TODO: consider function arguments as input to the action
  return executions.map((fn) => (args) => fn())
}

export const useValue = (...input) => {
  const [result, setResult] = useState({
    data: [],
    error: null,
    loading: false,
    pristine: true,
    stale: false,
  })

  const [executions, identifier, initial] = useData(
    input,
    true,
    result.pristine
  )

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
    Promise.all(executions.map((fn) => fn(reload)))
      .then(populate)
      .catch(failure)

    return () => {
      canceled = true
    }
  }, [identifier, result.stale])

  if (initial) {
    return [initial, false, false, null]
  }

  return [result.data, result.loading, result.pristine, result.error]
}

const useData = (input, identify = false, restore = false) => {
  const { stock } = useContainer()
  const { module } = useModule()
  const { evaluate } = useVariables(module.id)

  let identifier = ""
  let executions = []
  let initial = restore ? [] : null

  for (let actionIds of input) {
    let sequence = []
    let initialValue

    const actions = actionIds.map((id) =>
      module.actions.find((a) => a.id === id)
    )

    for (let action of actions) {
      const { config, type } = action

      const { serialize, execute, readCache, settings } = stock.actions.dict[
        type
      ]
      const args = serialize(config, populateRelations(action), evaluate)

      if (identify) {
        identifier += JSON.stringify(args)
      }
      sequence.push((onReload) => execute({ onReload })(...args))

      const cacheable = !!readCache
      const cached = cacheable && readCache(...args)

      if (cacheable && !cached) {
        initial = null
        continue
      }

      if (initial) {
        initialValue =
          !settings?.effect && !cacheable ? execute({})(...args) : cached
      }
    }

    executions.push((onReload) => reduce((_, fn) => fn(onReload), sequence))
    initial?.push(initialValue)
  }

  return [executions, identifier, initial]
}

// TODO: get data from on of the previous named modules instead of previous acc
const reduce = async (fn, [head, ...tail], acc) => {
  const out = await fn(acc, head)

  if (!tail.length) {
    return out
  }

  return reduce(fn, tail, out)
}
