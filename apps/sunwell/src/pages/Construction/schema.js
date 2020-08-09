// TODO: How to create recursive queries in case module will have layout with a child module who has it's child layout and so on? In theory, Tabs module may contain Tabs inside etc.
export const root = `
  query($pageId: Int!) {
    page(pageId: $pageId) {
      id
      title
      layout {
        id
        positions {
          id
          x
          y
          w
          h
          module {
            id
            type
            config
          }
        }
      }
    }
    commands {
      id
    }
  }
`

export const updatePositions = `
  mutation($positions: [PositionInput!]!) {
    updatePositions(positions: $positions) {
      id
      x
      y
      w
      h
    }
  }
`

export const createModule = `
  mutation(
    $type: ModuleType!
    $config: JSONObject!
    $position: PositionInput!
    $positions: [PositionInput!]!
  ) {
    updatePositions(positions: $positions) {
      id
      x
      y
      w
      h
    }
    createModule(type: $type, config: $config, position: $position) {
      id
      type
      config
      position {
        id
        x
        y
        w
        h
      }
    }
  }
`

export const updateModule = `
  mutation($moduleId: Int!, $key: String!, $value: JSON!) {
    updateModule(moduleId: $moduleId, key: $key, value: $value) {
      id
      config
    }
  }
`

export const removeModule = `
  mutation($moduleId: Int!) {
    removeModule(moduleId: $moduleId)
  }
`
