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
        }
      }
      modules {
        id
        positionId
        type
        config
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
    $newPosition: PositionInput!
    $positions: [PositionInput!]!
  ) {
    updatePositions(positions: $positions) {
      id
      x
      y
      w
      h
    }
    createModule(type: $type, config: $config, position: $newPosition) {
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
