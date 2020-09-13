import React, { createContext, useContext, useState } from "react"
import { mergeRight, assocPath, path } from "ramda"

const rootContext = createContext({})
const identityContext = createContext({})

export function Container({ children, queries, modules, stock }) {
  /**
   * Transforming modules list to the dictionary for the performance reasons of
   * accessing the module by it's id.
   */
  // TODO: remove sanity check
  const dict = modules && toDict(modules)

  const [state, setState] = useState({})

  function readState(id, key) {
    const { initialState } = stock[dict[id].type]

    return path([id, key], state) ?? initialState[key]
  }

  function assignState(id, key, value) {
    setState(assocPath([id, key], value))
  }

  function getScope(id) {
    const { type, config } = dict[id]
    const { createVariables, initialState } = stock[type]

    return createScope(
      queries,
      createVariables(config, mergeRight(initialState, state[id]))
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

export const useScope = function Scope(id) {
  const { getScope } = useContext(rootContext)

  return getScope(id)
}

export const useConnectedState = function ConnectedState(key) {
  const { readState, assignState } = useContext(rootContext)
  const id = useIdentity()

  return [readState(id, key), value => assignState(id, key, value)]
}

export const useVariables = function Variables() {
  const id = useIdentity()
  const scope = useScope(id)

  return scope.constants
}

/**
 * Creating scope to be used in module.
 */
const createScope = (commands, constants) => ({
  funcs: {
    commands: commands.reduce(
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
  },
  constants,
})

/**
 * Transforms list to dictionary by element id.
 */
const toDict = list =>
  list.reduce((acc, item) => ({ ...acc, [item.id]: item }), {})
