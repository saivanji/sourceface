import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useRef,
} from "react"
import { sort } from "ramda"
import { denormalize } from "normalizr"
import { module as moduleSchema } from "./schema"
import { useActions } from "./actions"
import reducer, { init } from "./reducer"
import { useSave } from "./persistence"

const context = createContext({})

export function Editor({ children, page }) {
  const prevPage = useRef(page.id)
  const [state, dispatch] = useReducer(reducer, page.modules, init)
  const actions = useActions(state, dispatch)
  const [isSaving, save] = useSave(page, state, () => actions.edit(false))

  useEffect(() => {
    if (!state.isEditing && state.isDirty) {
      actions.reset(page.modules)
    }

    if (prevPage.current !== page.id) {
      actions.reset(page.modules)
      prevPage.current = page.id
    }
  }, [page, state.isEditing, state.isDirty])

  //   console.log(state, denormalize(state.result, [moduleSchema], state.entities))

  return (
    <context.Provider
      value={{
        save,
        isSaving,
        isEditing: state.isEditing,
        isDirty: state.isDirty,
        selectors: createSelectors(state),
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
    sort(
      (a, b) => a.order - b.order,
      denormalize(
        state.entities.modules[moduleId],
        moduleSchema,
        state.entities
      ).actions.filter((a) => a.field === field)
    ),
  modules: () => denormalize(state.result, [moduleSchema], state.entities),
})

export const useEditor = () => {
  return useContext(context)
}
