import { mergeDeepRight } from "ramda"

export default ({ moduleId, binds }, cache) => {
  return mergeDeepRight(
    cache.resolve({ __typename: "Module", id: moduleId }, "binds"),
    binds
  )
}
