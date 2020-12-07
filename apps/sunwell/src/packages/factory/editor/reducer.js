import { omit, without, assoc, values, mergeDeepRight } from "ramda"
import { normalize } from "normalizr"
import schema from "./schema"
import { toDict } from "./utils"

export const init = (data) => normalize(data, schema)

export default (state = {}, action) => {
  if (action.type === "reset") {
    return init(action.payload)
  }

  console.log(state)

  return {
    entities: {
      pages: pages(state.entities.pages, action),
      commands: commands(state.entities.commands, action),
      modules: modules(state.entities.modules, action),
      actions: actions(state.entities.actions, action),
    },
    result: result(state.result, action),
    selection: selection(state.selection, action),
    isEditing: edition(state.isEditing, action),
    isDirty: dirty(state.isDirty, action),
  }
}

function pages(state = {}, { type, payload }) {
  switch (type) {
    case "changeReference": {
      const { type, data } = payload

      /**
       * Do not updating entities state when removing reference.
       */
      if (!data || type !== "pages") return state

      return {
        ...state,
        [data.id]: data,
      }
    }

    default:
      return state
  }
}

function commands(state = {}, { type, payload }) {
  switch (type) {
    case "changeReference": {
      const { type, data } = payload

      /**
       * Do not updating entities state when removing reference.
       */
      if (!data || type !== "operations") return state

      return {
        ...state,
        [data.id]: data,
      }
    }

    default:
      return state
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
      const order = values(state).filter((a) => a.field !== field).length

      return {
        ...state,
        [actionId]: {
          id: actionId,
          order,
          field,
          type,
          config,
          references: {
            pages: [],
            commands: [],
            modules: [],
          },
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

    // TODO: implement support for changing multiple references in reducer. Since it will not be possible to override multiple
    // selection
    case "changeReference": {
      const { actionId, type, field, data } = payload
      const items = toDict("field", state[actionId].references[type])

      if (!(data instanceof Array)) {
        const result = !data
          ? omit([field], items)
          : assoc(field, { field, data: data.id }, items)

        return {
          ...state,
          [actionId]: {
            ...state[actionId],
            references: {
              ...state[actionId].references,
              [type]: values(result),
            },
          },
        }
      }

      // TODO: handle array update
      return {}
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
  if (!["select", "edit"].includes(action.type)) {
    return true
  }

  return state
}
