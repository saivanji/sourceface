import { omit, without, values, mergeDeepRight } from "ramda"
import { normalize } from "normalizr"
import { identify } from "../reference"
import schema from "./schema"

export const init = (data) => root(normalize(data, schema), { type: "init" })

export default function root(state = {}, action) {
  if (action.type === "reset") {
    return init(action.payload)
  }

  return {
    entities: entities(state.entities, action),
    result: result(state.result, action),
    selection: selection(state.selection, action),
    isEditing: edition(state.isEditing, action),
    isDirty: dirty(state.isDirty, action),
  }
}

function entities(state = {}, action) {
  return {
    references: references(state.references, action),
    pages: pages(state.pages, action),
    operations: operations(state.operations, action),
    modules: modules(state.modules, action),
    actions: actions(state.actions, action),
  }
}

function modules(state = {}, { type, payload }) {
  switch (type) {
    case "createModule": {
      const { moduleId, parentId, type, name, config, position } = payload

      return {
        ...state,
        [moduleId]: {
          id: moduleId,
          parentId,
          type,
          name,
          config,
          position,
          actions: [],
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

    case "updateModules": {
      return mergeDeepRight(state, payload)
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

function actions(state = {}, { type, payload }) {
  switch (type) {
    case "createAction": {
      const { actionId, field, type, config } = payload
      const order = values(state).filter((a) => a.field === field).length

      return {
        ...state,
        [actionId]: {
          id: actionId,
          order,
          field,
          type,
          config,
          references: [],
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

    case "changeReference": {
      const { actionId, field, data } = payload
      const key = identify(actionId, field)
      const { references } = state[actionId]

      if (!data) {
        return {
          ...state,
          [actionId]: {
            ...state[actionId],
            references: without([key], references),
          },
        }
      }

      return {
        ...state,
        [actionId]: {
          ...state[actionId],
          references: [...references, key],
        },
      }
    }

    default:
      return state
  }
}

function references(state = {}, { type, payload }) {
  switch (type) {
    case "changeReference": {
      const { actionId, field, data, type } = payload

      const key = identify(actionId, field)

      if (!data) {
        return omit([key], state)
      }

      return {
        ...state,
        [key]: {
          field,
          pages: [],
          operations: [],
          modules: [],
          [type]: data.map((x) => x.id),
        },
      }
    }

    default:
      return state
  }
}

const createEntityReducer = (kind) => {
  const merge = (state, x) => mergeDeepRight(state, { [x.id]: x })

  return function (state = {}, { type, payload }) {
    switch (type) {
      case "changeReference": {
        const { type, data } = payload

        /**
         * Do not updating entities state when removing reference.
         */
        if (!data || type !== kind) return state

        return data.reduce(merge, state)
      }

      default:
        return state
    }
  }
}

function result(state = [], { type, payload }) {
  switch (type) {
    case "createModule":
      return [...state, payload.moduleId]

    case "removeModule":
      return without([payload.moduleId], state)

    default:
      return state
  }
}

function selection(state = null, { type, payload }) {
  switch (type) {
    case "select":
      return payload

    default:
      return state
  }
}

function edition(state = false, action) {
  switch (action.type) {
    case "edit":
      return action.payload

    default:
      return state
  }
}

function dirty(state = false, action) {
  if (!["init", "select", "edit"].includes(action.type)) {
    return true
  }

  return state
}

const pages = createEntityReducer("pages")
const operations = createEntityReducer("operations")
