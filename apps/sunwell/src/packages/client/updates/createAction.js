import { parse } from "graphql"

export default (result, { moduleId, actionId }, cache) => {
  const module = cache.readFragment(moduleFragment, { id: moduleId })
  const action = cache.readFragment(actionFragment, { id: actionId })

  /**
   * Assigning created action to it's module
   */
  cache.writeFragment(moduleFragment, {
    ...module,
    actions: [...module.actions, action],
  })

  /**
   * Populating cache with empty references array after it's creation
   */
  cache.writeFragment(actionRefsFragment, {
    ...action,
    references: [],
  })
}

const moduleFragment = parse(`
  fragment _ on Module {
    id
    actions {
      id
    }
  }
`)

const actionFragment = parse(`
  fragment _ on Action {
    id
  }
`)

const actionRefsFragment = parse(`
  fragment _ on Action {
    id
    references {
      field
    }
  }
`)
