import React, { createContext, useContext, useState } from "react"
import { mergeRight, assocPath, keys, mapObjIndexed } from "ramda"
import { Bind, Action, overScope, applyAction } from "./computation"

const rootContext = createContext({})
const identityContext = createContext({})

export function Container({
  children,
  queries,
  modules,
  stock,
  actions: { navigate, executeCommand },
}) {
  const coreActions = mergeRight(internalActions, { navigate })

  /**
   * Transforming modules list to the dictionary for the performance reasons of
   * accessing the module by it's id.
   */
  const dict = toDict(modules)

  const [state, setState] = useState({})

  function readState(id) {
    const { initialState } = stock[dict[id].type]

    return state[id] ?? initialState
  }

  function assignState(id, key, value) {
    setState(assocPath([id, key], value))
  }

  // TODO: move scope creation completely to the app? since it's might not be aware of a specific business details(scope data) and it's responsibility is perform state/scope handling
  function getScope(id) {
    const { binds } = dict[id]

    return {
      // TODO: think of how to memoize?
      queries: createQueriesScope(queries, executeCommand),
      modules: createModulesScope(id, modules, state, assignState, stock),
      //
      core: createCoreScope(coreActions),
      local: createLocalScope(dict[id], state, assignState, stock),
      binds: binds && overScope(binds, value => new Bind(value)),
      // TODO: for example in case when we have editable cell or action cell in the table
      // parent: {}
      // TODO: for global page info
      // page: {
      //   params: {}
      // }
      // TODO: for custom defined JS functions
      // scripts: {}
      //
      // state: {
      //   get: (key) => {},
      //   set: (path, value) => {}
      // }
      //
      // schemas: {}
    }
  }

  return (
    <rootContext.Provider
      value={{
        readState,
        assignState,
        getScope,
      }}
    >
      {children}
    </rootContext.Provider>
  )
}

export function Identifier({ children, id }) {
  return (
    <identityContext.Provider value={{ id }}>
      {children}
    </identityContext.Provider>
  )
}

export const useIdentity = function Identity() {
  const { id } = useContext(identityContext)

  return id
}

// TODO: remove in favor of useContainer? or vice versa?
export const useScope = function Scope(id) {
  const { getScope } = useContext(rootContext)

  return getScope(id)
}

export const useTransition = function StateTransition(key) {
  const { assignState } = useContext(rootContext)
  const id = useIdentity()

  return value => assignState(id, key, value)
}

export const useContainer = function Container() {
  return useContext(rootContext)
}

// TODO: Benefit of using Action instead of direct function calls is that makes evaluation result serializable and therefore allows to call useEffect only if evaluation result was changed. In the future, they will be useful when we'll need to group actions(for single graphql calls)
// or when we'll need to pass action results as arguments to other functions between evaluations(probably useful with pipelines).
// it's not possible to pass action across evaluations since it will be executed right after evaluation is done.

const createCoreScope = actions => mapObjIndexed(purify, actions)

const createQueriesScope = (queries, executeCommand) =>
  queries.reduce(
    (acc, command) => ({
      ...acc,
      [command.id]: args =>
        new Action(executeCommand, {
          commandId: command.id,
          args,
        }),
    }),
    {}
  )

const createModulesScope = (id, modules, state, assignState, stock) =>
  modules.reduce((acc, module) => {
    const local = createLocalScope(module, state, assignState, stock)

    if (!local || module.id === id) {
      return acc
    }

    return {
      ...acc,
      [module.id]: local,
    }
  }, {})

const createLocalScope = (module, state, assignState, stock) => {
  const { type, config } = module
  const { createLocalVariables, initialState } = stock[type]
  const transition = (key, value) => assignState(module.id, key, value)

  return (
    createLocalVariables &&
    purifyScope(
      createLocalVariables(
        config,
        mergeRight(initialState, state[module.id]),
        transition
      )
    )
  )
}

/**
 * Transforms list to dictionary by element id.
 */
const toDict = list =>
  list.reduce((acc, item) => ({ ...acc, [item.id]: item }), {})

const purify = fn => args => new Action(fn, args)

/**
 * Purifies functions in a scope so it can be safely used in evaluation.
 */
const purifyScope = scope =>
  overScope(scope, value =>
    typeof value === "function" ? purify(value) : value
  )

const internalActions = {
  // TODO: have that syntax sugar in engine instead?
  // `binds.form.*.justify`
  map: ({ data, fn }) => {
    // TODO: might be array
    let result = {}
    let errors = {}

    for (let key of keys(data)) {
      // TODO: find a way to applyAction automatically.
      /**
       * Since all functions in a scope return Action, we have to apply it
       * in order to make it work.
       */
      try {
        result[key] = applyAction(data[key][fn]())
      } catch (err) {
        errors[key] = err
      }
    }

    if (keys(errors).length) {
      throw errors
    }

    return result
  },
  // TODO: returns undefined instead of actual args when function is returned as variable from the expression. Works
  // well when we define function inside of the expression.
  //
  // it will be solved when we'll allow to return functions(implement "do foo" in engine). Right now it's considered as a
  // function call
  debug: args => {
    // TODO: will print results to a notification or something instead of console.log
    console.log(args)
    return args
  },
}
