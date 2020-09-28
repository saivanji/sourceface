import gql from "graphql-tag"

export default (result, { moduleId }, cache) => {
  cache.writeFragment(moduleFragment, {
    id: moduleId,
    binds: result.pushBinds,
  })
}

const moduleFragment = gql`
  fragment moduleFragment on Module {
    id
    binds
  }
`
