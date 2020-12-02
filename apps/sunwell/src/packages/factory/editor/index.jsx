import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useRef,
} from "react"
import { denormalize } from "normalizr"
import { module as moduleSchema } from "./schema"
import { useActions } from "./actions"
import reducer, { init } from "./reducer"
import { useSave } from "./persistence"

const context = createContext({})

export function Editor({ children, page }) {
  const prevPage = useRef(page)
  const [state, dispatch] = useReducer(reducer, page, init)
  const actions = useActions(state, dispatch, page)
  const [isSaving, save] = useSave(page, state, () => actions.edit(false))

  useEffect(() => {
    if (!state.isEditing && state.isDirty) {
      actions.reset(page)
    }

    if (prevPage.current !== page) {
      actions.reset(page)
      prevPage.current = page
    }
  }, [page, state.isEditing, state.isDirty])

  return (
    <context.Provider
      value={{
        save,
        isSaving,
        isEditing: state.isEditing,
        isDirty: state.isDirty,
        selectors: createSelectors(state),
        layout: state.entities.layouts[state.result.layout],
        modules: state.entities.modules,
        actions: state.entities.actions,
        selected: state.entities.modules[state.selection],
        ...actions,
      }}
    >
      {children}
    </context.Provider>
  )
}

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
