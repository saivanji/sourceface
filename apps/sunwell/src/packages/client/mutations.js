// TODO: mutations might be in the applications since update logic is not bound to them.

export const updatePositions = `
  mutation($positions: [PositionInput!]!) {
    updatePositions(positions: $positions) @populate
  }
`

export const createModule = `
  mutation(
    $moduleId: UUID!
    $type: ModuleType!
    $config: JSONObject!
    $position: PositionInput!
    $positions: [PositionInput!]!
  ) {
    updatePositions(positions: $positions) @populate
    createModule(
      moduleId: $moduleId
      type: $type
      config: $config
      position: $position
    ) @populate
  }
`

export const updateModule = `
  mutation($moduleId: UUID!, $key: String!, $value: JSON!) {
    updateModule(moduleId: $moduleId, key: $key, value: $value) @populate
  }
`

export const removeModule = `
  mutation($moduleId: UUID!) {
    removeModule(moduleId: $moduleId)
  }
`

export const createAction = `
  mutation(
    $actionId: UUID!
    $moduleId: UUID!
    $type: ActionType!
    $config: JSONObject!
    $key: String!
    $value: JSON!
  ) {
    createAction(
      actionId: $actionId
      moduleId: $moduleId
      type: $type
      config: $config
    ) @populate
    updateModule(moduleId: $moduleId, key: $key, value: $value) @populate
  }
`

export const removeAction = `
  mutation($actionId: UUID!, $moduleId: UUID!, $key: String!, $value: JSON!) {
    removeAction(actionId: $actionId)
    updateModule(moduleId: $moduleId, key: $key, value: $value) @populate
  }
`

export const renameAction = `
  mutation($actionId: UUID!, $name: String!) {
    renameAction(actionId: $actionId, name: $name)
  }
`

export const changeActionConfig = `
  mutation($actionId: UUID!, $key: String!, $value: JSON) {
    changeActionConfig(actionId: $actionId, key: $key, value: $value) @populate
  }
`
