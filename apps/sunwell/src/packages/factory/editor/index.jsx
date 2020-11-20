import React, { createContext, useContext, useReducer } from "react"
import { normalize, denormalize } from "normalizr"
import schema, { action as actionSchema } from "./schema"
import { useActions } from "./actions"
import reducer from "./reducer"
import { useSave } from "./persistence"

const context = createContext({})

// TODO: rename "page" to something meaningful
// TODO: do not mix UI and data state
export function Editor({ children, page: cached }) {
  const initialState = normalize(cached, schema)

  const [state, dispatch] = useReducer(reducer, initialState)
  const actions = useActions(state, initialState, dispatch)
  const selectors = createSelectors(state)

  const page = !state.isEditing
    ? cached
    : denormalize(state.result, schema, state.entities)

  const selected = page.modules.find((x) => x.id === state.selection)

  const [isPristine, isSaving, save] = useSave(initialState, state)

  return (
    <context.Provider
      value={{
        save,
        selectors,
        // TODO: move to selectors?
        isEditing: state.isEditing,
        isPristine,
        isSaving,
        //
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
  actions: (ids) =>
    ids.reduce((acc, actionId) => {
      const action = denormalize(
        state.entities.actions[actionId],
        actionSchema,
        state.entities
      )

      /**
       * Filtering out not existing actions.
       */
      return !action ? acc : [...acc, action]
    }, []),
})

export const useEditor = () => {
  return useContext(context)
}
