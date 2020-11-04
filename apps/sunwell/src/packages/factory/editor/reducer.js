import { omit, without } from "ramda"

export default (state, action) => {
  if (action.type === "reset") {
    return action.payload
  }

  return {
    entities: {
      layouts: layouts(state.entities.layouts, action),
      modules: modules(state.entities.modules, action),
      actions: actions(state.entities.actions, action),
    },
    result: result(state.result, action),
    selection: selection(state.selection, action),
    isEditing: edition(state.isEditing, action),
  }
}

function layouts(state, { type, payload }) {
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

function modules(state, { type, payload }) {
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

function actions(state, { type, payload }) {
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

function result(state, { type, payload }) {
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

function selection(state, { type, payload }) {
  switch (type) {
    case "select":
      return payload

    default:
      return state
  }
}

function edition(state, action) {
  switch (action.type) {
    case "edit":
      return action.payload

    default:
      return state
  }
}
