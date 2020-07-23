export const root = `
  query {
    modules {
      id
      type
      config
      position {
        x
        y
        w
        h
      }
    }
    commands {
      id
    }
  }
`

export const updateModule = `
  mutation ($moduleId: Int!, $key: String!, $value: JSON!) {
    updateModule(moduleId: $moduleId, key: $key, value: $value) {
      id
      config
    }
  }
`

export const addModule = `
  mutation ($type: ModuleType!, $config: JSONObject!) {
    addModule(type: $type, config: $config) {
      id
      type
      config
    }
  }
`
