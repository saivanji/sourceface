import { useEffect, useState } from "react"
import { assoc, mergeLeft } from "ramda"
import { useEditor } from "./editor"
import { useModule } from "./module"
import { useContainer } from "./container"
import { useVariables } from "./variables"

export const useFunction = () => {
  return [() => {}]
}

// TODO: have pipes as input in future
export const useValue = (input) => {
  const { stock } = useContainer()
  const { selectors } = useEditor()
  const { module } = useModule()
  const { evaluate } = useVariables(module.id)

  const [result, setResult] = useState({
    data: [],
    loading: false,
    pristine: true,
  })

  const sequences = input.map((actionIds) =>
    serialize(selectors.actions(actionIds), stock, evaluate)
  )

  // TODO: should distinct between sync and async if loading true/false state updates might be stacked and
  // it will not cause loading flickering.
  useEffect(() => {
    console.log("eff")

    const out = executeAll(sequences)

    let canceled = false
    const start = () => !canceled && setResult(mergeLeft({ loading: true }))
    const populate = (data) =>
      !canceled &&
      setResult(mergeLeft({ data, loading: false, pristine: false }))

    if (!isAsync(out)) {
      populate(out)
    } else {
      // TODO: handle errors
      start()
      out.then(populate)
    }

    return () => {
      canceled = true
    }
  }, [JSON.stringify(sequences)])

  return [result.data, result.loading, result.pristine]
}

const serialize = (actions, stock, evaluate) =>
  actions.map(({ config, type }) => {
    const { serialize, execute } = stock.actions.dict[type]
    return [serialize(config, evaluate), (args) => execute(args, config, {})]
  })

const execute = ([[args, fn], ...tail]) => {
  const out = fn(args)

  if (!tail.length) {
    return out
  }

  return isAsync(out) ? out.then(() => execute(tail)) : execute(tail)
}

const executeAll = (items) => {
  let async = false

  const out = items.map((x) => {
    const out = execute(x)

    if (isAsync(out)) {
      async = true
    }

    return out
  })

  return !async ? out : Promise.all(out)
}

const isAsync = (x) => x instanceof Promise
