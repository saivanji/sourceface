export const root = `
  fragment page on Page {
    id
    title
    route
  }

  fragment operation on Command {
    id
    name
    stale {
      id
    }
  }

  fragment module on Module {
    id
    parentId
    name
    type
    config
    position
  }

  fragment action on Action {
    id
    order
    field
    type
    name
    config
  }

  query($path: String!) {
    page(path: $path) {
      ...page
      trail {
        ...page
      }
      modules {
        ...module
        actions {
          ...action
          pagesRefs {
            field
            one {
              ...page
            }
            many {
              ...page
            }
          }
          operationsRefs {
            field
            one {
              ...operation
            }
            many {
              ...operation
            }
          }
          modulesRefs {
            field
            one {
              ...module
            }
            many {
              ...module
            }
          }
        }
      }
    }
  }
`
