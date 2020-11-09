import React, { createContext, useContext, useReducer } from "react"
import { detailedDiff } from "deep-object-diff"
import { normalize, denormalize } from "./schema"
import { useActions } from "./actions"
import reducer from "./reducer"

const context = createContext({})

// TODO: instead of diffing, do a mapping between dispatched actions and mutations(next deletion mutation will exclude past creation mutation)

// TODO: rename "page" to something meaningful
// TODO: do not mix UI and data state
export function Editor({ children, page: cached }) {
  const initialState = normalize(cached)

  const [state, dispatch] = usePersistedReducer(reducer, initialState)
  const actions = useActions(state, initialState, dispatch)
  const selectors = createSelectors(state)

  const page = !state.isEditing
    ? cached
    : denormalize(state.result, state.entities)

  const selected = page.modules.find((x) => x.id === state.selection)

  function diff() {
    return detailedDiff(initialState.entities, state.entities)
  }

  return (
    <context.Provider
      value={{
        selectors,
        isEditing: state.isEditing,
        layout: page.layout,
        modules: page.modules,
        selected,
        ...actions,
      }}
    >
      {children}
    </context.Provider>
  )
}

const createSelectors = (state) => ({
  actions: (ids) => ids.map((actionId) => state.entities.actions[actionId]),
})

export const useEditor = () => {
  return useContext(context)
}

// Temp. Unless diff algorythm will be implemented.
const usePersistedReducer = (reducer, initialState) => {
  const key = "editor_state"
  const raw = localStorage.getItem(key)
  const persisted = raw && JSON.parse(raw)

  const [state, dispatch] = useReducer(reducer, persisted || initialState)

  return [
    state,
    (action) => {
      const nextState = reducer(state, action)

      localStorage.setItem(key, JSON.stringify(nextState))

      return dispatch(action)
    },
  ]
}
