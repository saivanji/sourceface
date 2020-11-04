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

  const [state, dispatch] = useReducer(reducer, initialState)
  const actions = useActions(state, initialState, dispatch)

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

export const useEditor = () => {
  return useContext(context)
}
