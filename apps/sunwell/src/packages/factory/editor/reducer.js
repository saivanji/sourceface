import { omit, without, values, mergeDeepRight } from "ramda"
import { normalize } from "normalizr"
import schema from "./schema"

export const init = (data) => normalize(data, schema)

export default (state = {}, action) => {
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
    pages_references: pagesReferences(state.pages_references, action),
    operations_references: operationsReferences(
      state.operations_references,
      action
    ),
    modules_references: modulesReferences(state.modules_references, action),
    pages: pages(state.pages, action),
    commands: commands(state.commands, action),
    modules: modules(state.modules, action),
    actions: actions(state.actions, action),
  }
}

const createEntityReducer = (field) => {
  const merge = (state, x) => mergeDeepRight(state, { [x.id]: x })

  return function (state = {}, { type, payload }) {
    switch (type) {
      case "changeReference": {
        const { type, data } = payload

        /**
         * Do not updating entities state when removing reference.
         */
        if (!data || type !== field) return state

        if (data instanceof Array) {
          return data.reduce(merge, state)
        }

        return merge(state, data)
      }

      default:
        return state
    }
  }
}

const createReferenceReducer = (kind) => {
  return function (state = {}, { type, payload }) {
    switch (type) {
      case "changeReference": {
        const { actionId, field, data, type } = payload

        if (type !== kind) {
          return state
        }

        const key = `action/${actionId}/${field}`
        const isMany = data instanceof Array

        if (!data) {
          return omit([key], state)
        }

        const result = isMany
          ? { many: data.map((x) => x.id) }
          : { one: data.id }

        return {
          ...state,
          [key]: {
            field,
            ...result,
          },
        }
      }

      default:
        return state
    }
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
          pagesRefs: [],
          operationsRefs: [],
          modulesRefs: [],
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

const pages = createEntityReducer("pages")
const commands = createEntityReducer("operations")

const pagesReferences = createReferenceReducer("pages")
const operationsReferences = createReferenceReducer("operations")
const modulesReferences = createReferenceReducer("modules")
