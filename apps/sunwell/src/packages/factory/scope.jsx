import React, { createContext, useState, useContext } from "react"
import { assocPath, mergeRight } from "ramda"
import { useContainer } from "./container"
import { useEditor } from "./editor"

const context = createContext({})

export function Scope({ children }) {
  const { stock } = useContainer()
  const { modules } = useEditor()
  const [state, setState] = useState({})

  function readState(id) {
    const { initialState } = stock.modules.dict[dict[id].type]

    return state[id] ?? initialState
  }

  function assignState(id, key, value) {
    setState(assocPath([id, key], value))
  }

  /**
   * Transforming modules list to the dictionary for the performance reasons of
   * accessing the module by it's id.
   */
  const dict = toDict(modules)

  return (
    <context.Provider
      value={{
        scope: {
          modules: createModulesScope(modules, state, assignState, stock),
        },
        readState,
        assignState,
      }}
    >
      {children}
    </context.Provider>
  )
}

export const useScope = () => {
  return useContext(context)
}

const createModulesScope = (modules, state, assignState, stock) =>
  modules.reduce(
    (acc, module) => ({
      ...acc,
      [module.id]: createLocalScope(module, state, assignState, stock) || {},
    }),
    {}
  )

const createLocalScope = (module, state, assignState, stock) => {
  const { type, config } = module
  const { createVariables, initialState } = stock.modules.dict[type]
  const transition = (key, value) => assignState(module.id, key, value)

  return (
    createVariables &&
    // purifyScope(
    createVariables(
      config,
      mergeRight(initialState, state[module.id]),
      transition
    )
    // )
  )
}

// /**
//  * Purifies function so it can be easily used in evaluation. It's important
//  * since evaluation stage is happening on every render and it should be side-effect
//  * free.
//  */
// const purify = (fn) => (args) => new Action(fn, args, true)

// const purifyScope = (scope) =>
//   overScope(scope, (value) =>
//     typeof value === "function" ? purify(value) : value
//   )

/**
 * Transforms list to dictionary by element id.
 */
const toDict = (list) =>
  list.reduce((acc, item) => ({ ...acc, [item.id]: item }), {})
