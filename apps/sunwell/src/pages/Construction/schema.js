export const root = `
  query {
    modules {
      id
      type
      config
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
