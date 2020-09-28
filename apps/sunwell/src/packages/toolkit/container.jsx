import React, { createContext, useContext, useState } from "react"
import { mergeRight, assocPath } from "ramda"
import { Effect } from "./computation"

const rootContext = createContext({})
const identityContext = createContext({})

export function Container({ children, queries, modules, stock, effects }) {
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
    return {
      // TODO: think of how to memoize?
      queries: createQueriesScope(queries),
      modules: createModulesScope(id, modules, state, assignState, stock),
      //
      core: createCoreScope(),
      local: createLocalScope(dict[id], state, assignState, stock),
      binds: {},
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
    <rootContext.Provider value={{ readState, assignState, getScope, effects }}>
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

// TODO: Benefit of sugin Effect instead of direct function calls is that makes evaluation result serializable and therefore allows to call useEffect only if evaluation result was changed. In the future, they will be useful when we'll need to group effects(for single graphql calls)
// or when we'll need to pass effect results as arguments to other functions between evaluations(probably useful with pipelines).
// it's not possible to pass effect across evaluations since it will be executed right after evaluation is done.

const createCoreScope = () => {
  return {
    navigate: payload => new Effect("navigate", payload),
    notify: () => {},
  }
}

const createQueriesScope = queries =>
  queries.reduce(
    (acc, command) => ({
      ...acc,
      [command.id]: args =>
        new Effect("command", {
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
    createLocalVariables(
      config,
      mergeRight(initialState, state[module.id]),
      transition
    )
  )
}

/**
 * Transforms list to dictionary by element id.
 */
const toDict = list =>
  list.reduce((acc, item) => ({ ...acc, [item.id]: item }), {})
