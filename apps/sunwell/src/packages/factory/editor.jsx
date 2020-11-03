import React, { createContext, useContext, useReducer } from "react"
import { normalize, denormalize, schema } from "normalizr"
import { v4 as uuid } from "uuid"
import { omit, without } from "ramda"
import { useContainer } from "./container"

const context = createContext({})

// TODO: instead of diffing, do a mapping between dispatched actions and mutations(next deletion mutation will exclude past creation mutation)

// TODO: rename "page" to something meaningful
export function Editor({ children, page: cached }) {
  const { stock } = useContainer()

  const [state, dispatch] = useReducer(reducer, normalize(cached, pageSchema))
  const page = !state.isEditing
    ? cached
    : denormalize(state.result, pageSchema, state.entities)
  const selected = state.entities.modules[state.selection]

  function select(moduleId) {
    dispatch({ type: "select", payload: moduleId })
  }

  function edit(isEditing) {
    dispatch({ type: "edit", payload: isEditing })
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
    dispatch({
      type: "createModule",
      payload: {
        layoutId,
        moduleId: uuid(),
        config: stock.modules[type].defaultConfig,
        type,
        name,
        position,
      },
    })
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
    dispatch({
      type: "removeModule",
      payload: { moduleId },
    })
  }

  function createAction(actionId, moduleId, type) {
    dispatch({
      type: "createAction",
      payload: { actionId, moduleId, type, config: {} },
    })
  }

  function configureAction(actionId, key, value) {
    dispatch({
      type: "configureAction",
      payload: { actionId, key, value },
    })
  }

  function removeAction(actionId) {
    dispatch({
      type: "removeAction",
      payload: { actionId },
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
  // TODO: resest state to initialState when "edit = false" dispatched

  return {
    entities: {
      layouts: layoutsReducer(state.entities.layouts, action),
      modules: modulesReducer(state.entities.modules, action),
      actions: actionsReducer(state.entities.actions, action),
    },
    result: resultReducer(state.result, action),
    selection: selectionReducer(state.selectio, action),
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
          [moduleId]: position,
        },
      }
    }

    case "removeModule": {
      // TODO: remove module from assigned layout
      return state
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
      const { moduleId, actionId } = payload

      return {
        ...state,
        [moduleId]: {
          ...state[moduleId],
          actions: [...state[moduleId].actions, actionId],
        },
      }
    }

    case "removeAction": {
      // TODO: implement
      return state
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
        modules: [...state.modules, payload.module.id],
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

    case "removeModule":
      return state === payload.moduleId ? null : state

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

const layout = new schema.Entity("layouts")
const action = new schema.Entity("actions")
const module = new schema.Entity("modules", { actions: [action] })

const pageSchema = {
  layout,
  modules: [module],
}
