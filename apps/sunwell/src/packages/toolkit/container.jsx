import React, { createContext, useContext, useState } from "react"
import { mergeRight, assocPath } from "ramda"

const rootContext = createContext({})
const identityContext = createContext({})

export function Container({ children, queries, modules, stock }) {
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

  // TODO: getLocalScope
  // TODO: getGlobalScope

  function getScope(id) {
    const { type, config } = dict[id]
    const { createLocalVariables, initialState } = stock[type]

    return createScope(
      queries,
      createLocalVariables(config, mergeRight(initialState, state[id]))
    )
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

/**
 * Creating scope to be used in module.
 */
const createScope = (commands, local) => ({
  local,
  ...commands.reduce(
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
  ),
})

/**
 * Transforms list to dictionary by element id.
 */
const toDict = list =>
  list.reduce((acc, item) => ({ ...acc, [item.id]: item }), {})
