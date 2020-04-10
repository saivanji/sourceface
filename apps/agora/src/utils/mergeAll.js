import * as R from "ramda"

export default (...objects) =>
  objects.reduce((acc, item) => R.mergeDeepLeft(item, acc), {})
