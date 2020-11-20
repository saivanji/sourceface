import { parse } from "graphql"

export default (result, { moduleId, relations }, cache) => {
  const module = cache.readFragment(moduleFragment, { id: moduleId })

  cache.writeFragment(moduleFragment, {
    ...module,
    actions: [...module.actions, result.createAction],
  })
}

// TODO: manually populate commands and pages based on input data of relations
const moduleFragment = parse(`
  fragment _ on Module {
    id
    actions {
      id
    }
  }
`)
