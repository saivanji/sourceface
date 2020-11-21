import React, { createContext, useContext, useReducer, useEffect } from "react"
import { denormalize } from "normalizr"
import schema, { action as actionSchema } from "./schema"
import { useActions } from "./actions"
import reducer, { init } from "./reducer"
import { useSave } from "./persistence"

const context = createContext({})

// TODO: rename "page" to something meaningful
// TODO: do not mix UI and data state
export function Editor({ children, page: initialPage }) {
  const [state, dispatch] = useReducer(reducer, initialPage, init)
  const actions = useActions(state, dispatch, initialPage)
  const selectors = createSelectors(state)

  const page = !state.isEditing
    ? initialPage
    : denormalize(state.result, schema, state.entities)

  const selected = page.modules.find((x) => x.id === state.selection)

  const [isSaving, save] = useSave(initialPage, state, () =>
    actions.edit(false)
  )

  useEffect(() => {
    if (!state.isEditing && state.isDirty) {
      actions.reset(initialPage)
    }
  }, [initialPage, state.isEditing, state.isDirty])

  return (
    <context.Provider
      value={{
        save,
        selectors,
        // TODO: move to selectors?
        isEditing: state.isEditing,
        isDirty: state.isDirty,
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
