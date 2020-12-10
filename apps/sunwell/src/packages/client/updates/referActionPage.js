import { parse } from "graphql"

export default (result, { actionId, field, pageId, pageIds }, cache) => {
  const action = cache.readFragment(actionFragment, { id: actionId })

  // TODO: have similar logic back-end has - filter field references first and then add to the action
  cache.writeFragment(actionFragment, {
    ...action,
    pagesReferences: [...action.pagesReferences, result.referPage],
  })
}

const actionFragment = parse(`
  fragment _ on Action {
    id
    pagesReferences {
      field
    }
  }
`)
