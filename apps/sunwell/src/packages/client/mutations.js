// TODO: mutations might be in the applications since update logic is not bound to them.

export const updateLayout = `
  mutation($layoutId: UUID!, $positions: JSONObject!) {
    updateLayout(layoutId: $layoutId, positions: $positions) @populate
  }
`

export const createModule = `
  mutation(
    $moduleId: UUID!
    $layoutId: UUID!
    $type: ModuleType!
    $name: String!
    $config: JSONObject!
    $positions: JSONObject!
  ) {
    createModule(
      moduleId: $moduleId
      layoutId: $layoutId
      type: $type
      name: $name
      config: $config
    ) @populate
    updateLayout(layoutId: $layoutId, positions: $positions) @populate
  }
`

export const configureModule = `
  mutation($moduleId: UUID!, $key: String!, $value: JSON!) {
    configureModule(moduleId: $moduleId, key: $key, value: $value) {
      id
      config
    }
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
  ) {
    createAction(
      actionId: $actionId
      moduleId: $moduleId
      type: $type
      config: $config
    ) @populate
  }
`

export const removeAction = `
  mutation($actionId: UUID!) {
    removeAction(actionId: $actionId)
  }
`

export const renameAction = `
  mutation($actionId: UUID!, $name: String!) {
    renameAction(actionId: $actionId, name: $name)
  }
`

export const configureAction = `
  mutation($actionId: UUID!, $key: String!, $value: JSON) {
    configureAction(actionId: $actionId, key: $key, value: $value) {
      id
      config
    }
  }
`
