import { useEffect, useState } from "react"
import { mergeLeft } from "ramda"
import { useParams } from "hooks/index"
import { useModule } from "./module"
import { useMount } from "./mount"
import { useEditor } from "./editor"
import { useContainer } from "./container"
import { useFunctions } from "./functions"
import { useStore } from "./store"

// TODO: caclulate all variables upfront and pass down only literals as identifier/arguments?
export const useLoad = (funcs, cached, identifier) => {
  const [result, setResult] = useState({
    data: [],
    isLoading: false,
    isPristine: true,
    error: null,
    stale: false,
  })

  useEffect(() => {
    let canceled = false
    const start = () => !canceled && setResult(mergeLeft({ isLoading: true }))
    const failure = (error) =>
      !canceled && setResult(mergeLeft({ data: [], error, isLoading: false }))
    const populate = (data) =>
      !canceled &&
      setResult(
        mergeLeft({ data, isLoading: false, isPristine: false, error: null })
      )
    const reload = () => !canceled && setResult(mergeLeft({ stale: true }))

    if (cached) {
      populate(cached)

      return
    }

    start()
    Promise.all(funcs.map((fn) => fn?.(reload)))
      .then(populate)
      .catch(failure)

    return () => {
      canceled = true
    }
  }, [identifier, result.stale])

  if (cached) {
    return shape({
      data: cached,
      isLoading: false,
      isPristine: false,
      error: null,
    })
  }

  return shape(result)
}

export const useDependencies = () => {
  const { stock } = useContainer()
  const module = useModule()
  const { modules, actions, selectors } = useEditor()
  const mount = useMount()
  const functions = useFunctions()
  const params = useParams()
  const store = useStore()

  return {
    module,
    stock,
    store,
    modules,
    actions,
    selectors,
    mount,
    functions,
    params,
  }
}

const shape = ({ data, isLoading, isPristine, error }) => [
  data,
  { isLoading, isPristine, error },
]
