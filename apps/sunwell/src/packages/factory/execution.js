import { keys } from "ramda"
import { createVariable } from "./variables"

export const prepare = (dependencies, fields = [], input = {}) => {
  const {
    module,
    stock,
    modules,
    actions,
    selectors,
    mount,
    functions,
    params,
  } = dependencies

  let executions = []
  let cache = null
  let identifier = ""

  for (let [i, field] of fields.entries()) {
    let sequence = []
    let runtime = createInputRuntime(input)
    /**
     * By default pipe initial value is the same field in config. It will be overwritten when processing actions.
     */
    let initialValue = module.config[field]

    for (let action of selectors.actions(module.id, field)) {
      const { type } = action

      const { serialize, execute, readCache, settings } = stock.actions.dict[
        type
      ]

      const args = serialize(action, {
        createVariable: (definition) =>
          createVariable(definition, module.id, mount, params, dependencies, {
            modules,
            actions,
          }),
      })

      identifier += JSON.stringify(args)

      sequence.push([
        action.id,
        (runtime, onReload) =>
          execute({ functions, modules, runtime, onReload })(...args),
      ])

      const cacheable = !!readCache
      const cached =
        cacheable &&
        // TODO: "readCache" returns promise
        (runtime[`action/${action.id}`] = readCache({ runtime })(...args))

      if ((cacheable && !cached) || (settings?.effect && !cacheable)) {
        cache = null
        continue
      }

      if (cache) {
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
    } else if (typeof module.config[field] !== "undefined") {
      /**
       * When no actions defined for the option - returning value from config
       * if it exists there.
       */
      executions[i] = () => module.config[field]
    }

    cache?.push(initialValue)
  }

  return [executions, cache, identifier]
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
