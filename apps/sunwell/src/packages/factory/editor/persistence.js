import { useState } from "react"
import { toPairs, isNil, keys, values, mergeDeepRight } from "ramda"
import deepDiff from "deep-diff"
import { client } from "packages/client"
import reducer, { init } from "./reducer"
import * as reference from "../reference"
import { toDict } from "./utils"

export const useSave = (page, state, onSuccess) => {
  const [isSaving, setSaving] = useState(false)
  const save = async () => {
    const initialState = reducer(init(page.modules), {})
    const mutations = structure(createChanges(page.id, initialState, state))

    setSaving(true)
    await send(mutations)
    setSaving(false)

    onSuccess()
  }

  return [isSaving, save]
}

const definitions = {
  createModule: [
    {
      moduleId: "UUID",
      parentId: "UUID",
      pageId: "Int",
      type: "ModuleType",
      name: "String",
      config: "JSONObject",
      position: "JSONObject",
    },
    ["id", "parentId", "pageId", "type", "name", "config", "position"],
  ],
  updateModule: [
    {
      moduleId: "UUID",
      name: "String",
      config: "JSONObject",
    },
    ["id", "name", "config"],
  ],
  updateModules: [
    {
      modules: "[ModuleInput!]",
    },
    ["id", "parentId", "position"],
  ],
  removeModule: [
    {
      moduleId: "UUID",
    },
  ],
  createAction: [
    {
      actionId: "UUID",
      moduleId: "UUID",
      order: "Int",
      field: "String",
      type: "ActionType",
      name: "String",
      config: "JSONObject",
    },
    ["id", "order", "field", "type", "name", "config"],
  ],
  updateAction: [
    {
      actionId: "UUID",
      name: "String",
      config: "JSONObject",
    },
    ["id", "name", "config"],
  ],
  removeAction: [
    {
      actionId: "UUID",
    },
  ],
  referActionPage: [
    {
      actionId: "UUID",
      pageId: "Int",
      pageIds: "[Int!]",
      field: "String",
    },
  ],
  unreferActionPage: [
    {
      actionId: "UUID",
      field: "String",
    },
  ],
  referActionOperation: [
    {
      actionId: "UUID",
      operationId: "Int",
      operationIds: "[Int!]",
      field: "String",
    },
  ],
  unreferActionOperation: [
    {
      actionId: "UUID",
      field: "String",
    },
  ],
  referActionModule: [
    {
      actionId: "UUID",
      moduleId: "UUID",
      moduleIds: "[UUID!]",
      field: "String",
    },
  ],
  unreferActionModule: [
    {
      actionId: "UUID",
      field: "String",
    },
  ],
}

const mutate = (items) => {
  let init = []
  let mutations = []
  let variables = {}
  let i = 0

  for (let [index, [identifier, input]] of items.entries()) {
    const name = getName(identifier)
    let args = []

    const [types, out] = definitions[name]

    for (let [key, value] of toPairs(input)) {
      if (isNil(value)) {
        continue
      }

      const variable = `v${i++}`
      const type = types[key]

      variables[variable] = value
      init.push(`$${variable}:${type}!`)

      args.push(`${key}:$${variable}`)
    }

    mutations.push(`a${index}: ${name}(${args.join(",")}) ${returns(out)}`)
  }

  const mutation = `mutation(${init.join(",")}) {${mutations.join(" ")}}`
  return client.mutation(mutation, variables).toPromise()
}

const returns = (value) =>
  typeof value === "string"
    ? value
    : value instanceof Array
    ? `{${value.join(", ")}}`
    : ""

// TODO: container module creation mutation should be sent before positions update(or children create) mutation of the modules which are children of creating module.
// Keep in mind multiple level nesting. When creating multiple container modules one inside of another, should send mutations from parent to child:
// Parent 1 create
// Children of parent 1 update(or create)
// Parent 2 create(inside of children 1)
// Children of parent 2 update(or create)
// Parent 3 create(inside of children 2) and so on
const structure = (changes) => {
  const deps = {
    createAction: {
      key: "moduleId",
      parent: "createModule",
    },
    createSomething: {
      key: "actionId",
      parent: "createAction",
    },
    ...getActionRefsMutations({ key: "actionId", parent: "createAction" }),
  }

  let result = []

  for (let [identifier, input] of toPairs(changes)) {
    const name = getName(identifier)
    const dependency = deps[name]
    const entry = [identifier, input]

    /**
     * No need to add the data if it already in the result
     */
    if (exists(identifier, result)) {
      continue
    }

    /**
     * When there is no dependencies
     */
    if (!dependency) {
      result.push(entry)

      continue
    }

    const parent = identify(dependency.parent, input[dependency.key])

    /**
     * When parent data already added to result
     */
    if (exists(parent, result)) {
      result = insert(parent, result, entry)

      continue
    }

    /**
     * When parent exists in source
     */
    if (changes[parent]) {
      result.push([parent, changes[parent], [entry]])

      continue
    }

    result.push(entry)
  }

  return result
}

const send = async ([head, ...tail]) => {
  if (!head) {
    return []
  }

  const children = head[2]

  const res = await Promise.all([mutate([head]), ...(await send(tail))])

  if (children) {
    await send(children)
  }

  return res
}

const exists = (identifier, [head, ...tail]) => {
  if (!head) {
    return false
  }

  if (head[0] === identifier) {
    return true
  }

  if (head[2]) {
    return exists(identifier, head[2])
  }

  return exists(identifier, tail)
}

const insert = (identifier, [head, ...tail], data) => {
  if (!head) {
    return []
  }

  const [id, input, children = []] = head

  if (id === identifier) {
    return [[id, input, [...children, data]], ...tail]
  }

  if (children.length) {
    return [
      [id, input, insert(identifier, children, data)],
      ...insert(identifier, tail, data),
    ]
  }

  return [head, ...insert(identifier, tail, data)]
}

const createChanges = (pageId, initialState, state) => {
  const diff = deepDiff(initialState.entities, state.entities) || []

  console.log(diff)
  // return

  let result = {}

  for (let { kind, path, rhs, item } of diff) {
    /**
     * Create module
     */
    if (kind === "N" && path[0] === "modules" && path.length === 2) {
      const moduleId = rhs.id
      const identifier = identify("createModule", moduleId)

      result[identifier] = {
        ...result[identifier],
        moduleId,
        parentId: rhs.parentId,
        pageId,
        type: rhs.type,
        name: rhs.name,
        config: rhs.config,
        position: rhs.position,
      }

      for (let actionId of rhs.actions) {
        const identifier = identify("createAction", actionId)

        result[identifier] = {
          ...result[identifier],
          moduleId,
        }
      }
    }

    /**
     * Update module information
     */
    if (
      (kind === "E" || kind === "N" || kind === "A") &&
      path[0] === "modules" &&
      ["name", "config"].includes(path[2]) &&
      path.length > 2
    ) {
      const moduleId = path[1]
      const field = path[2]
      const objectField = path[3]
      const isObject = field === "config" && path.length > 3
      const identifier = identify("updateModule", moduleId)

      result[identifier] = {
        ...result[identifier],
        moduleId,
        [field]: isObject
          ? {
              ...result[identifier]?.[field],
              [objectField]:
                state.entities.modules[moduleId][field][objectField],
            }
          : rhs,
      }
    }

    /**
     * Update module positions
     */
    if (
      kind === "E" &&
      path[0] === "modules" &&
      ((path[2] === "parentId" && path.length === 3) ||
        (path[2] === "position" && path.length === 4))
    ) {
      const changingParentId = path[2] === "parentId"
      const moduleId = path[1]
      const field = path[3]
      const identifier = identify("updateModules", 0)

      const initialModule = state.entities.modules[moduleId]
      const prevUpdates = toDict("moduleId", result[identifier]?.modules)

      result[identifier] = {
        modules: values(
          mergeDeepRight(prevUpdates, {
            [moduleId]: {
              moduleId,
              parentId: changingParentId
                ? rhs
                : prevUpdates[moduleId]?.parentId || initialModule.parentId,
              position: {
                ...initialModule.position,
                ...prevUpdates[moduleId]?.position,
                ...(!changingParentId && {
                  [field]: rhs,
                }),
              },
            },
          })
        ),
      }
    }

    /**
     * Remove module
     */
    if (kind === "D" && path[0] === "modules" && path.length === 2) {
      const moduleId = path[1]
      const identifier = identify("removeModule", moduleId)

      result[identifier] = {
        moduleId,
      }
    }

    /**
     * Create action
     */
    if (kind === "N" && path[0] === "actions" && path.length === 2) {
      const actionId = path[1]
      const identifier = identify("createAction", actionId)

      result[identifier] = {
        ...result[identifier],
        actionId,
        order: rhs.order,
        field: rhs.field,
        type: rhs.type,
        name: rhs.name,
        config: rhs.config,
      }

      /**
       * Assign references
       */
      const action = state.entities.actions[actionId]

      for (let [type, [mutationName, , oneName, manyName]] of toPairs(
        actionRefsMapping
      )) {
        const key = reference.mapping[type]

        for (let refId of action[key]) {
          const name = getReferenceEntitiesName(type)
          const { field, one, many } = state.entities[name][refId]

          const identifier = identify(mutationName, [actionId, field])
          const value = one ? { [oneName]: one } : { [manyName]: many }

          result[identifier] = {
            actionId,
            field,
            ...value,
          }
        }
      }
    }

    /**
     * Creation action(assign to existing module)
     */
    if (
      kind === "A" &&
      path[0] === "modules" &&
      path[2] === "actions" &&
      path.length === 3 &&
      item.kind === "N"
    ) {
      const moduleId = path[1]
      const actionId = item.rhs
      const identifier = identify("createAction", actionId)

      result[identifier] = {
        ...result[identifier],
        moduleId,
      }
    }

    /**
     * Update action
     */
    if (
      (kind === "E" || kind === "N" || kind === "A") &&
      path[0] === "actions" &&
      ["name", "config"].includes(path[2]) &&
      path.length > 2
    ) {
      const actionId = path[1]
      const field = path[2]
      const objectField = path[3]
      const isObject = ["config"].includes(field) && path.length > 3
      const identifier = identify("updateAction", actionId)

      result[identifier] = {
        ...result[identifier],
        actionId,
        [field]: isObject
          ? {
              ...result[identifier]?.[field],
              [objectField]:
                state.entities.actions[actionId][field][objectField],
            }
          : rhs,
      }
    }

    /**
     * Remove action
     */
    if (kind === "D" && path[0] === "actions" && path.length === 2) {
      const actionId = path[1]
      const identifier = identify("removeAction", actionId)

      result[identifier] = {
        actionId,
      }
    }

    /**
     * Refer action
     */
    if (["E", "N"].includes(kind) && isReference(path[0])) {
      const [actionId, field] = reference.tear(path[1])
      const type = getReferenceType(path[0])
      const { one, many } = state.entities[path[0]][path[1]]
      const [mutationName, , oneName, manyName] = actionRefsMapping[type]
      const identifier = identify(mutationName, [actionId, field])

      const value = one ? { [oneName]: one } : { [manyName]: many }

      result[identifier] = {
        actionId,
        field,
        ...value,
      }
    }

    /**
     * Unrefer action
     */
    if (kind === "D" && isReference(path[0])) {
      const [actionId, field] = reference.tear(path[1])
      const type = getReferenceType(path[0])
      const [, mutationName] = actionRefsMapping[type]
      const identifier = identify(mutationName, [actionId, field])

      result[identifier] = {
        actionId,
        field,
      }
    }
  }

  return result
}

const identify = (name, id) => `${name}/${id}`

const getName = (identifier) => identifier.split("/")[0]

const actionRefsMapping = {
  pages: ["referActionPage", "unreferActionPage", "pageId", "pageIds"],
  operations: [
    "referActionOperation",
    "unreferActionOperation",
    "operationId",
    "operationIds",
  ],
  modules: [
    "referActionModule",
    "unreferActionModule",
    "moduleId",
    "moduleIds",
  ],
}

const isReference = (key) => {
  const str = "_references"
  const index = key.indexOf(str)

  return index !== -1 && index === key.length - str.length
}

const getReferenceType = (key) =>
  key.slice(0, key.length - "_references".length)

const getReferenceEntitiesName = (type) => type + "_references"

const getActionRefsMutations = (data) =>
  values(actionRefsMapping).reduce((acc, [name]) => ({ ...acc, [name]: data }))
