import { useEffect, useState } from "react"
import { mergeLeft } from "ramda"
import { useEditor } from "./editor"
import { useModule } from "./module"
import { useContainer } from "./container"
import { useVariables } from "./variables"

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
    serialize(selectors.actions(actionIds), stock, evaluate)
  )

  useEffect(() => {
    console.log("eff")

    let canceled = false
    const start = () => !canceled && setResult(mergeLeft({ loading: true }))
    const failure = (error) => !canceled && setResult(mergeLeft({ error }))
    const populate = (data) =>
      !canceled &&
      setResult(
        mergeLeft({ data, loading: false, pristine: false, error: null })
      )

    start()
    Promise.all(sequences.map(execute)).then(populate).catch(failure)

    return () => {
      canceled = true
    }
  }, [JSON.stringify(sequences)])

  return [result.data, result.loading, result.pristine, result.error]
}

const serialize = (actions, stock, evaluate) =>
  actions.map(({ config, type }) => {
    const { serialize, execute } = stock.actions.dict[type]
    return [serialize(config, evaluate), (args) => execute(args, config, {})]
  })

const execute = async ([[args, fn], ...tail]) => {
  // TODO: have memoization on the execution level. Should be defined here. If action was executed with existing
  // arguments - get result from cache. Handle stale data here. That change will make obsolete query cache and handling
  // stale results there. That will help to return cache data on a very first render.
  //
  // Have cache limit or ttl for example 3 mins.
  //
  // Cache need to be enabled manually from action file. It's disabled by default
  const out = await fn(args)

  if (!tail.length) {
    return out
  }

  return execute(tail)
}
