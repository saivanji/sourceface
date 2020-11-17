import { compose, uniq, flatten, values } from "ramda"

export const load = (fn, type) => async (referencesGroups) => {
  const groupIds = referencesGroups.map((r) => flattenValues(r[type]))
  const ids = flattenUnique(groupIds)

  if (!ids.length) return []

  return (await fn(ids)).reduce((acc, c) => {
    const indexes = groupIds.reduce(
      (acc, ids, i) => (ids.includes(c.id) ? [...acc, i] : acc),
      []
    )

    return [...acc, ...indexes.map((index) => ({ ...c, index }))]
  }, [])
}

export const compare = (item, identifier, index) => item.index === index

const flattenUnique = compose(uniq, flatten)
const flattenValues = compose(uniq, flatten, values)
