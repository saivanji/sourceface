import { useEffect, useState } from "react"
import { keys, mergeLeft } from "ramda"
import { useParams } from "hooks/index"
import { useModule } from "../module"
import { useMount } from "../mount"
import { useStore } from "../store"
import { useEditor } from "../editor"
import { useContainer } from "../container"
import { createVariable } from "../variables"
import { useFunctions } from "../functions"

export const useHandlers = (...fields) => {
  const [executions] = useData(fields)

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

  const [executions, identifier, initial] = useData(
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

// TODO: might not need to have "useData" in favor of having logic in a separate function and keeping other hooks in
// "useFunction" and "useValues"
const useData = (fields, identify = false, restore = false, input = {}) => {
  const { stock } = useContainer()
  const { id: moduleId, config } = useModule()
  const { modules, actions, selectors } = useEditor()
  const { scope } = useStore()
  const mount = useMount()
  const functions = useFunctions()
  const params = useParams()

  let identifier = ""
  let executions = []
  let initial = restore ? [] : null

  for (let [i, field] of fields.entries()) {
    let sequence = []
    let runtime = createInputRuntime(input)
    /**
     * By default pipe initial value is the same field in config. It will be overwritten when processing actions.
     */
    let initialValue = config[field]

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

      // TODO: remove "config" and pass only action instead?
      const args = serialize(config, action, {
        createVariable: (definition) =>
          createVariable(definition, moduleId, scope, mount, params, {
            modules,
            actions,
          }),
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

    if (sequence.length) {
      executions[i] = (onReload, input) =>
        reduce(
          (actionRuntime, [, fn]) =>
            fn({ ...actionRuntime, ...createInputRuntime(input) }, onReload),
          ([actionId]) => `action/${actionId}`,
          sequence
        )
    } else if (typeof config[field] !== "undefined") {
      /**
       * When no actions defined for the option - returning value from config
       * if it exists there.
       */
      executions[i] = () => config[field]
    }

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

const createInputRuntime = (input) =>
  keys(input).reduce(
    (acc, key) => ({ ...acc, [`input/${key}`]: input[key] }),
    {}
  )
