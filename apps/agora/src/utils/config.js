import { flatten, values } from "ramda"

export const getReferences = (type, config) =>
  values(config.references && config.references[type]).reduce(
    (acc, ref) => acc.concat(ref),
    []
  )

export const loadReferences = (fn, type) => async (configs) => {
  const groupIds = configs.map((c) => getReferences(type, c))
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
