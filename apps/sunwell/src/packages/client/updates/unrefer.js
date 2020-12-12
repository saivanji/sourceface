import { parse } from "graphql"

export default (result, { actionId, field }, cache) => {
  const action = cache.readFragment(actionFragment, { id: actionId })

  const references = action.references.filter((r) => r.field !== field)

  cache.writeFragment(actionFragment, {
    ...action,
    references,
  })
}

const actionFragment = parse(`
  fragment _ on Action {
    id
    references {
      field
    }
  }
`)
