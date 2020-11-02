import { parse } from "graphql"

export default (result, { moduleId }, cache) => {
  const module = cache.readFragment(moduleFragment, { id: moduleId })

  cache.writeFragment(moduleFragment, {
    ...module,
    actions: [...module.actions, result.createAction],
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
