import { values, mergeDeepLeft } from "ramda"

export default resolvers =>
  values(resolvers).reduce((acc, item) => mergeDeepLeft(item, acc), {})
