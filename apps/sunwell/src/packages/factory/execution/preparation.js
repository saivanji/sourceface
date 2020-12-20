import { difference, clone, props, keys, isEmpty } from "ramda"

import { createVariable, IncompleteEvaluation } from "../variables"

export const prepare = (
  dependencies,
  fields,
  identify = false,
  restore = false,
  input = {},
  result = { identifier: "", executions: {}, initial: restore ? {} : null }
) => {
  const {
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
  } = dependencies

  let identifier = result.identifier
  let executions = clone(result.executions)
  let initial = clone(result.initial)
  let suspended = []

  for (let field of difference(fields, keys(executions))) {
    let sequence = []
    let runtime = createInputRuntime(input)
    /**
     * By default pipe initial value is the same field in config. It will be overwritten when processing actions.
     */
    let initialValue = config[field]

    try {
      for (let action of selectors.actions(moduleId, field)) {
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
        executions[field] = (onReload, input) =>
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
        executions[field] = () => config[field]
      }

      if (initial) {
        initial[field] = initialValue
      }
    } catch (err) {
      if (!(err instanceof IncompleteEvaluation)) {
        throw err
      }

      suspended.push(field)

      continue
    }
  }

  if (suspended.length) {
    return prepare(dependencies, fields, identify, restore, input, {
      identifier,
      executions,
      initial,
    })
  }

  return [props(fields, executions), identifier, props(fields, initial)]
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
