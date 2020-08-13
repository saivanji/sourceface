import gql from "graphql-tag"

export default (result, { position }, cache) => {
  const layout = cache.readFragment(layoutFragment, { id: position.layoutId })

  cache.writeFragment(layoutFragment, {
    ...layout,
    positions: [...layout.positions, result.createModule.position],
  })
}

const layoutFragment = gql`
  fragment layoutFragment on Layout {
    id
    positions {
      id
    }
  }
`
