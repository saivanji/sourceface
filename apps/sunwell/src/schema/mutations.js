export const updatePositions = `
  mutation($positions: [PositionInput!]!) {
    updatePositions(positions: $positions) @populate
  }
`

export const createModule = `
  mutation(
    $type: ModuleType!
    $config: JSONObject!
    $position: PositionInput!
    $positions: [PositionInput!]!
  ) {
    updatePositions(positions: $positions) @populate
    createModule(type: $type, config: $config, position: $position) @populate
  }
`

export const updateModule = `
  mutation($moduleId: Int!, $key: String!, $value: JSON!) {
    updateModule(moduleId: $moduleId, key: $key, value: $value) @populate
  }
`

export const removeModule = `
  mutation($moduleId: Int!) {
    removeModule(moduleId: $moduleId)
  }
`

export const pushBinds = `
  mutation($moduleId: Int!, $binds: JSONObject!) {
    pushBinds(moduleId: $moduleId, binds: $binds)
  }
`

export const createAction = `
  mutation(
    $moduleId: Int!
    $type: ActionType!
    $config: JSONObject!
  ) {
    createAction(moduleId: $moduleId, type: $type, config: $config) @populate
  }
`

export const removeAction = `
  mutation($actionId: Int!) {
    removeAction(actionId: $actionId)
  }
`

export const changeActionConfig = `
  mutation(
    $actionId: Int!
    $key: String!
    $value: JSON
  ) {
    changeActionConfig(actionId: $actionId, key: $key, value: $value) @populate
  }
`
