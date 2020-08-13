import gql from "graphql-tag"

export default (result, args, cache) => {
  const module = cache.readFragment(moduleFragment, {
    id: args.moduleId,
  })
}

const moduleFragment = gql`
  fragment moduleFragment on Module {
    id
    position {
      id
    }
  }
`
