import gql from "graphql-tag"

export default (result, { position }, cache) => {
  const { layoutId, x, y, w, h } = position
  const { positionId } = result.createModule

  const pageId = findPageId(layoutId, cache)

  const page = cache.readFragment(pageFragment, { id: pageId })
  const layout = cache.readFragment(layoutFragment, { id: layoutId })

  cache.writeFragment(pageFragment, {
    ...page,
    modules: [...page.modules, result.createModule],
  })

  cache.writeFragment(layoutFragment, {
    ...layout,
    positions: [
      ...layout.positions,
      { __typename: "Position", id: positionId, x, y, w, h },
    ],
  })
}

// TODO: why it'not causing extra page request when x, y, w, h are not passed?
const layoutFragment = gql`
  fragment layoutFragment on Layout {
    id
    positions {
      id
      x
      y
      w
      h
    }
  }
`

// TODO: why it's not causing extra page request
const pageFragment = gql`
  fragment pageFragment on Page {
    id
    modules {
      id
    }
  }
`

const findPageId = (layoutId, cache) => {
  return cache.inspectFields("Query").reduce((result, x) => {
    if (x.fieldName !== "page" || result) {
      return result
    }

    const currentLayoutId = cache.resolve(
      cache.resolve(cache.resolve("Query", "page", x.arguments), "layout"),
      "id"
    )

    if (currentLayoutId === layoutId) {
      return x.arguments.pageId
    }

    return result
  }, null)
}
