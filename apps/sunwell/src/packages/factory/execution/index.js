import { useEffect, useState } from "react"
import { mergeLeft } from "ramda"
import { useParams } from "hooks/index"
import { useModule } from "../module"
import { useMount } from "../mount"
import { useStore } from "../store"
import { useEditor } from "../editor"
import { useContainer } from "../container"
import { useFunctions } from "../functions"
import { prepare } from "./preparation"

export const useHandlers = (...fields) => {
  const dependencies = useDependencies()
  const [executions] = prepare(dependencies, fields)

  // TODO: consider function arguments as input to the action
  return executions.map((fn) => fn && ((input) => fn(null, input)))
  // same as the above
  // return executions
}

// TODO: do ordering of the fields, since "limit" needs to be evaluated first in order to be
// available for "data" evaluation in example of table
// Try not to rely on action config's variables here.
// Also try not to rely on variables when rendering dependent modules.
// Flow is the following:
// - Go over fields and if fields can be evaluated - evaluate, if can't then skip it. After all correct fields are evaluated go to the first unevaluated field and try to evaluate it, repeat until all fields be evaluated. That might solve both cases
// Throw error from "evaluate" in case something is not available and catch it here
// No need to sort the fields using that approach
export const useValues = (...fields) => {
  const last = fields[fields.length - 1]
  const onUpdate = typeof last === "function" ? last : null

  fields = onUpdate ? fields.slice(0, -1) : fields

  const [result, setResult] = useState({
    data: [],
    error: null,
    loading: false,
    pristine: true,
    stale: false,
  })
  const dependencies = useDependencies()

  const [executions, identifier, initial] = prepare(
    dependencies,
    fields,
    true,
    result.pristine
  )

  useEffect(() => {
    let canceled = false
    const start = () => !canceled && setResult(mergeLeft({ loading: true }))
    const failure = (error) =>
      !canceled && setResult(mergeLeft({ data: [], error, loading: false }))
    const populate = (data) => {
      if (!canceled) {
        setResult(
          mergeLeft({ data, loading: false, pristine: false, error: null })
        )
        onUpdate?.(data)
      }
    }
    const reload = () => !canceled && setResult(mergeLeft({ stale: true }))

    if (initial) {
      populate(initial)

      return
    }

    start()
    Promise.all(executions.map((fn) => fn?.(reload)))
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

const useDependencies = () => {
  const { stock } = useContainer()
  const { id: moduleId, config } = useModule()
  const { modules, actions, selectors } = useEditor()
  const { scope } = useStore()
  const mount = useMount()
  const functions = useFunctions()
  const params = useParams()

  return {
    moduleId,
    stock,
    config,
    modules,
    actions,
    selectors,
    scope,
    mount,
    functions,
    params,
  }
}
