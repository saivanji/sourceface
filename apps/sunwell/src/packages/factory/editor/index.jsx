import React, { createContext, useContext, useReducer, useEffect } from "react"
import { denormalize } from "normalizr"
import schema, { module as moduleSchema } from "./schema"
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

  // TODO: consider having one way data flow instead of denormalizing only when editing.
  // 1. page goes as initial state to reducer
  // 2. state denormalizes into the page
  // 3. Denormalized page goes down to components.
  //
  // or do not denormalize at all and provide selectors so components can use to get:
  // - actions
  // - modules
  // and so on
  // const page = !state.isEditing
  //   ? initialPage
  //   : denormalize(state.result, schema, state.entities)

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

// TODO: do normalization here(from set to list)
const createSelectors = (state) => ({
  actions: (moduleId, field) =>
    denormalize(
      state.entities.modules[moduleId],
      moduleSchema,
      state.entities
    ).actions.filter((a) => a.field === field),
  modules: () =>
    denormalize(state.result.modules, [moduleSchema], state.entities),
})

export const useEditor = () => {
  return useContext(context)
}
