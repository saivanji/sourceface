import React, { createContext, useContext, useState } from "react"
import { mergeRight, assocPath } from "ramda"

const rootContext = createContext({})
const identityContext = createContext({})

export function Container({
  children,
  queries,
  modules,
  stock,
  options: { navigate } = {},
}) {
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

  function getScope(id) {
    return {
      // TODO: think of how to memoize?
      queries: createQueriesScope(queries),
      modules: createModulesScope(id, modules, state, stock),
      //
      core: createCoreScope({ navigate }),
      local: createLocalScope(dict[id], state, stock),
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
    <rootContext.Provider value={{ readState, assignState, getScope }}>
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

const createQueriesScope = queries =>
  queries.reduce(
    (acc, command) => ({
      ...acc,
      [command.id]: args => ({
        type: "command",
        payload: {
          commandId: command.id,
          args,
        },
      }),
    }),
    {}
  )

const createModulesScope = (id, modules, state, stock) =>
  modules.reduce((acc, module) => {
    const local = createLocalScope(module, state, stock)

    if (!local || module.id === id) {
      return acc
    }

    return {
      ...acc,
      [module.id]: local,
    }
  }, {})

const createLocalScope = (module, state, stock) => {
  const { type, config } = module
  const { createLocalVariables, initialState } = stock[type]

  return (
    createLocalVariables &&
    createLocalVariables(config, mergeRight(initialState, state[module.id]))
  )
}

const createCoreScope = ({ navigate }) => {
  return {
    navigate: ({ to }) => navigate(to),
    notify: () => {},
  }
}

/**
 * Transforms list to dictionary by element id.
 */
const toDict = list =>
  list.reduce((acc, item) => ({ ...acc, [item.id]: item }), {})
