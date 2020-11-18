import { omit, without } from "ramda"

export default (state, action) => {
  if (action.type === "reset") {
    return action.payload
  }

  return {
    entities: {
      pages: referenceEntity(state.entities.pages, action),
      commands: referenceEntity(state.entities.commands, action),
      layouts: layouts(state.entities.layouts, action),
      modules: modules(state.entities.modules, action),
      actions: actions(state.entities.actions, action),
    },
    result: result(state.result, action),
    selection: selection(state.selection, action),
    isEditing: edition(state.isEditing, action),
    isDirty: dirty(state.isDirty, action),
  }
}

function referenceEntity(state, { type, payload }) {
  switch (type) {
    case "changeRelation": {
      const { data } = payload

      /**
       * Do not updating entities state when removing reference.
       */
      if (!data) return state

      if (data instanceof Array) {
        return data.reduce(
          (acc, item) => ({ ...state, [item.id]: item }),
          state
        )
      }

      return {
        ...state,
        [data.id]: data,
      }
    }

    default:
      return state
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

    case "renameModule": {
      const { moduleId, name } = payload

      return {
        ...state,
        [moduleId]: {
          ...state[moduleId],
          name,
        },
      }
    }

    case "removeModule":
      return omit([payload.moduleId], state)

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
          relations: {},
          commands: [],
          pages: [],
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

    case "changeRelation": {
      const { actionId, type, key, data } = payload
      const links = state[actionId][type]

      if (!data) {
        return {
          ...state,
          [actionId]: {
            ...state[actionId],
            relations: {
              ...state[actionId].relations,
              [type]: omit([key], state[actionId].relations[type]),
            },
          },
        }
      }

      const isArr = data instanceof Array
      const ids = isArr ? data.map((x) => x.id) : data.id
      const diff = (isArr ? ids : [ids]).filter((id) => !links.includes(id))

      return {
        ...state,
        [actionId]: {
          ...state[actionId],
          [type]: [...links, ...diff],
          relations: {
            ...state[actionId].relations,
            [type]: {
              ...state[actionId].relations[type],
              [key]: ids,
            },
          },
        },
      }
    }

    case "renameAction": {
      const { actionId, name } = payload

      return {
        ...state,
        [actionId]: {
          ...state[actionId],
          name,
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

function dirty(state, action) {
  if (!["select", "edit"].includes(action.type)) {
    return true
  }

  return state
}
