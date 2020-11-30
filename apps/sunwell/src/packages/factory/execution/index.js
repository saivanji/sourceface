import { useEffect, useState } from "react"
import { mergeLeft } from "ramda"
import { useModule } from "../module"
import { useScope } from "../scope"
import { useEditor } from "../editor"
import { useContainer } from "../container"
import { createVariable } from "../variables"
import { useFunctions } from "../functions"
import { populateRelations } from "../action"

export const useHandler = (...input) => {
  const [executions] = useData(input)

  // TODO: consider function arguments as input to the action
  return executions.map((fn) => (args) => fn())
  // same as the above
  // return executions
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
  const { modules } = useEditor()
  const { scope } = useScope()
  const functions = useFunctions()

  let identifier = ""
  let executions = []
  let initial = restore ? [] : null

  for (let actionIds of input) {
    let sequence = []
    let initialValue

    const actions =
      actionIds?.map((id) => module.actions.find((a) => a.id === id)) || []

    for (let action of actions) {
      /**
       * Skipping not existing actions
       */
      if (!action) {
        continue
      }

      const { config, type } = action

      const { serialize, execute, readCache, settings } = stock.actions.dict[
        type
      ]

      const args = serialize(config, populateRelations(action), {
        createVariable: (definition) =>
          createVariable(definition, module.id, scope, { modules, actions }),
      })

      if (identify) {
        identifier += JSON.stringify(args)
      }
      sequence.push([
        action.id,
        (runtime, onReload) =>
          execute({ functions, runtime, onReload })(...args),
      ])

      const cacheable = !!readCache
      const cached = cacheable && readCache(...args)

      if (cacheable && !cached) {
        initial = null
        continue
      }

      if (initial) {
        initialValue =
          !settings?.effect && !cacheable
            ? execute({ functions })(...args)
            : cached
      }
    }

    executions.push((onReload) =>
      reduce(
        (runtime, [, fn]) => fn(runtime || {}, onReload),
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
