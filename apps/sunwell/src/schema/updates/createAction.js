import gql from "graphql-tag"

export default (result, { moduleId }, cache) => {
  const module = cache.readFragment(moduleFragment, { id: moduleId })

  cache.writeFragment(moduleFragment, {
    ...module,
    actions: [...module.actions, result.createAction],
  })
}

const moduleFragment = gql`
  fragment moduleFragment on Module {
    id
    actions {
      id
    }
  }
`
