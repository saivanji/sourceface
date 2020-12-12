import { parse } from "graphql"

export default (result, { actionId, field }, cache) => {
  const action = cache.readFragment(actionFragment, { id: actionId })

  const references = action.references.filter((r) => r.field !== field)

  cache.writeFragment(actionFragment, {
    ...action,
    references: [...references, result.refer],
  })
}

const actionFragment = parse(`
  fragment _ on Action {
    id
    references {
      pages {
        id
      }
      operations {
        id
      }
      modules {
        id
      }
    }
  }
`)
