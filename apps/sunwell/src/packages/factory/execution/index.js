import { useEffect, useState } from "react"
import { mergeLeft } from "ramda"
import { useModule } from "../module"
import { useMount } from "../mount"
import { useScope } from "../scope"
import { useEditor } from "../editor"
import { useContainer } from "../container"
import { createVariable } from "../variables"
import { useFunctions } from "../functions"

export const useHandler = (...fields) => {
  const [executions] = useData(fields)

  // TODO: consider function arguments as input to the action
  return executions.map((fn) => (args) => fn())
  // same as the above
  // return executions
}

export const useValue = (...fields) => {
  const [result, setResult] = useState({
    data: [],
    error: null,
    loading: false,
    pristine: true,
    stale: false,
  })

  const [executions, identifier, initial] = useData(
    fields,
    true,
    result.pristine
  )

  useEffect(() => {
    let canceled = false
    const start = () => !canceled && setResult(mergeLeft({ loading: true }))
    const failure = (error) =>
      !canceled && setResult(mergeLeft({ error, loading: false }))
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

// TODO: might not need to have "useData" in favor of having logic in a separate function and keeping other hooks in
// "useFunction" and "useValue"
const useData = (fields, identify = false, restore = false) => {
  const { stock } = useContainer()
  const { id: moduleId } = useModule()
  const { modules, actions, selectors } = useEditor()
  const { scope } = useScope()
  const mountScope = useMount()
  const functions = useFunctions()

  let identifier = ""
  let executions = []
  let initial = restore ? [] : null

  for (let field of fields) {
    let sequence = []
    let runtime = {}
    let initialValue

    for (let action of selectors.actions(moduleId, field)) {
      /**
       * Skipping not existing actions
       */
      // TODO: should we keep it since all data will be integrient?
      if (!action) {
        continue
      }

      const { config, type } = action

      const { serialize, execute, readCache, settings } = stock.actions.dict[
        type
      ]

      const args = serialize(config, action, {
        createVariable: (definition) =>
          createVariable(
            definition,
            moduleId,
            scope,
            mountScope,
            {},
            {
              modules,
              actions,
            }
          ),
      })

      if (identify) {
        identifier += JSON.stringify(args)
      }
      sequence.push([
        action.id,
        (runtime, onReload) =>
          execute({ functions, modules, runtime, onReload })(...args),
      ])

      const cacheable = !!readCache
      const cached =
        cacheable &&
        (runtime[`action/${action.id}`] = readCache({ runtime })(...args))

      if ((cacheable && !cached) || (settings?.effect && !cacheable)) {
        initial = null
        continue
      }

      if (initial) {
        initialValue =
          !settings?.effect && !cacheable
            ? execute({ functions, modules, runtime })(...args)
            : cached
      }
    }

    executions.push((onReload) =>
      reduce(
        (runtime, [, fn]) => fn(runtime, onReload),
        ([actionId]) => `action/${actionId}`,
        sequence
      )
    )
    initial?.push(initialValue)
  }

  return [executions, identifier, initial]
}

const reduce = async (fn, createKey, [head, ...tail], acc = {}) => {
  if (!head) {
    return acc.last
  }

  const last = await fn(acc.stack, head)

  if (!tail.length) {
    return last
  }

  return reduce(fn, createKey, tail, {
    stack: {
      ...acc.stack,
      [createKey(head)]: last,
    },
    last,
  })
}
