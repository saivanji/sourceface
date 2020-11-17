import { flatten, values } from "ramda"

export const load = (fn, type) => async (referencesGroups) => {
  const groupIds = referencesGroups.map((r) => values(r[type]))
  const ids = flatten(groupIds)

  if (!ids.length) return []

  return (await fn(ids)).reduce((acc, c) => {
    const indexes = groupIds.reduce(
      (result, ids, i) => (ids.includes(c.id) ? [...acc, i] : acc),
      []
    )

    return [...acc, ...indexes.map((index) => ({ ...c, index }))]
  }, [])
}

export const compare = (item, identifier, index) => item.index === index
