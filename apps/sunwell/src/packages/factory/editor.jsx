import React, { createContext, useContext, useReducer } from "react"
import { normalize, denormalize, schema } from "normalizr"
import { v4 as uuid } from "uuid"
import { omit, without, keys } from "ramda"
import { useContainer } from "./container"

const context = createContext({})

// TODO: instead of diffing, do a mapping between dispatched actions and mutations(next deletion mutation will exclude past creation mutation)

// TODO: rename "page" to something meaningful
// TODO: do not mix UI and data state
export function Editor({ children, page: cached }) {
  const { stock } = useContainer()
  const initialState = normalize(cached, pageSchema)

  const [state, dispatch] = useReducer(reducer, initialState)
  const page = !state.isEditing
    ? cached
    : denormalize(state.result, pageSchema, state.entities)
  const selected = page.modules.find((x) => x.id === state.selection)

  function select(moduleId) {
    dispatch({ type: "select", payload: moduleId })
  }

  function edit(isEditing) {
    dispatch({ type: "edit", payload: isEditing })
    if (!isEditing) {
      dispatch({ type: "reset", payload: initialState })
    }
  }

  function updateLayout(layoutId, positions) {
    dispatch({
      type: "updateLayout",
      payload: {
        layoutId,
        positions,
      },
    })
  }

  function createModule(layoutId, type, position) {
    const moduleId = uuid()
    dispatch({
      type: "createModule",
      payload: {
        layoutId,
        moduleId,
        config: stock.modules.dict[type].defaultConfig,
        type,
        name,
        position,
      },
    })
    return moduleId
  }

  function configureModule(moduleId, key, value) {
    dispatch({
      type: "configureModule",
      payload: {
        moduleId,
        key,
        value,
      },
    })
  }

  function removeModule(moduleId) {
    const layoutId = findLayoutIdByModule(moduleId, state.entities.layouts)
    dispatch({
      type: "removeModule",
      payload: { moduleId, layoutId },
    })
  }

  function createAction(moduleId, type) {
    const actionId = uuid()
    dispatch({
      type: "createAction",
      payload: { actionId, moduleId, type, config: {} },
    })
    return actionId
  }

  function configureAction(actionId, key, value) {
    dispatch({
      type: "configureAction",
      payload: { actionId, key, value },
    })
  }

  function removeAction(actionId) {
    const moduleId = findModuleIdByAction(actionId, state.entities.modules)
    dispatch({
      type: "removeAction",
      payload: { actionId, moduleId },
    })
  }

  return (
    <context.Provider
      value={{
        isEditing: state.isEditing,
        layout: page.layout,
        modules: page.modules,
        selected,
        edit,
        select,
        updateLayout,
        createModule,
        configureModule,
        removeModule,
        createAction,
        configureAction,
        removeAction,
      }}
    >
      {children}
    </context.Provider>
  )
}

export const useEditor = () => {
  return useContext(context)
}

const reducer = (state, action) => {
  if (action.type === "reset") {
    return action.payload
  }

  return {
    entities: {
      layouts: layoutsReducer(state.entities.layouts, action),
      modules: modulesReducer(state.entities.modules, action),
      actions: actionsReducer(state.entities.actions, action),
    },
    result: resultReducer(state.result, action),
    selection: selectionReducer(state.selection, action),
    isEditing: editionReducer(state.isEditing, action),
  }
}

function layoutsReducer(state, { type, payload }) {
  switch (type) {
    case "updateLayout": {
      const { layoutId, positions } = payload

      return {
        ...state,
        [layoutId]: {
          id: layoutId,
          positions,
        },
      }
    }

    case "createModule": {
      const { moduleId, layoutId, position } = payload

      return {
        ...state,
        [layoutId]: {
          ...state[layoutId],
          positions: {
            ...state[layoutId].positions,
            [moduleId]: position,
          },
        },
      }
    }

    case "removeModule": {
      const { moduleId, layoutId } = payload
      console.log(layoutId)

      return {
        ...state,
        [layoutId]: {
          ...state[layoutId],
          positions: omit([moduleId], state[layoutId].positions),
        },
      }
    }

    default:
      return state
  }
}

function modulesReducer(state, { type, payload }) {
  switch (type) {
    case "createModule": {
      const { moduleId, type, name, config } = payload

      return {
        ...state,
        [moduleId]: {
          id: moduleId,
          type,
          name,
          config,
          actions: [],
          layouts: [],
        },
      }
    }

    case "configureModule": {
      const { moduleId, key, value } = payload

      return {
        ...state,
        [moduleId]: {
          ...state[moduleId],
          config: {
            ...state[moduleId].config,
            [key]: value,
          },
        },
      }
    }

    case "removeModule":
      return omit([payload.moduleId], state.modules)

    case "createAction": {
      const { actionId, moduleId } = payload

      return {
        ...state,
        [moduleId]: {
          ...state[moduleId],
          actions: [...state[moduleId].actions, actionId],
        },
      }
    }

    case "removeAction": {
      const { actionId, moduleId } = payload

      return {
        ...state,
        [moduleId]: {
          ...state[moduleId],
          actions: without([actionId], state[moduleId].actions),
        },
      }
    }

    default:
      return state
  }
}

function actionsReducer(state, { type, payload }) {
  switch (type) {
    case "createAction": {
      const { actionId, type, config } = payload

      return {
        ...state,
        [actionId]: {
          id: actionId,
          type,
          config,
        },
      }
    }

    case "configureAction": {
      const { actionId, key, value } = payload

      return {
        ...state,
        [actionId]: {
          ...state[actionId],
          config: {
            ...state[actionId].config,
            [key]: value,
          },
        },
      }
    }

    case "removeAction":
      return omit([payload.actionId], state)

    default:
      return state
  }
}

function resultReducer(state, { type, payload }) {
  switch (type) {
    case "createModule":
      return {
        ...state,
        modules: [...state.modules, payload.moduleId],
      }

    case "removeModule": {
      return {
        ...state,
        modules: without([payload.moduleId], state.modules),
      }
    }

    default:
      return state
  }
}

function selectionReducer(state, { type, payload }) {
  switch (type) {
    case "select":
      return payload

    default:
      return state
  }
}

function editionReducer(state, action) {
  switch (action.type) {
    case "edit":
      return action.payload

    default:
      return state
  }
}

const findLayoutIdByModule = (moduleId, layouts) =>
  keys(layouts).find((layoutId) => !!layouts[layoutId].positions[moduleId])

const findModuleIdByAction = (actionId, modules) =>
  keys(modules).find((moduleId) => modules[moduleId].actions.includes(actionId))

const layout = new schema.Entity("layouts")
const action = new schema.Entity("actions")
const module = new schema.Entity("modules", { actions: [action] })

const pageSchema = {
  layout,
  modules: [module],
}
