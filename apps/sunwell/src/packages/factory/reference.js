import { compose, map, sort, toPairs, path } from "ramda"
import { client } from "packages/client"

export const getReference = (type, field, references, multiple) => {
  if (!multiple) {
    return references[type].find((r) => r.field === field)?.data
  }

  const unsorted = references[type].reduce((acc, r) => {
    const [f, i] = r.field.split("/")

    if (!i || field !== f) {
      return acc
    }

    return { ...acc, [i]: r.data }
  }, {})

  return compose(
    map((x) => x[1]),
    sort((a, b) => a[0] - b[0]),
    toPairs
  )(unsorted)
}

export const removeReference = (type, field, references, multiple) => {
  if (!multiple) {
    return references[type].filter((r) => r.field !== field)
  }

  return references[type].filter((r) => {
    const [f, i] = r.field.split("/")

    return !i || field !== f
  })
}

export const addReference = (data, type, field, references, multiple) => {
  if (!multiple) {
    return [...references[type], { field, data }]
  }

  // TODO:
  return
}

export const listReferences = (type, input) =>
  client
    .query(queries[type], input)
    .toPromise()
    .then(path(["data", type]))

const queries = {
  operations: `
    query($search: String, $limit: Int, $offset: Int) {
      operations: commands(search: $search, limit: $limit, offset: $offset) {
        id
        name
        stale {
          id
        }
      }
    }
  `,
  pages: `
    query($search: String, $limit: Int, $offset: Int) {
      pages(search: $search, limit: $limit, offset: $offset) {
        id
        title
        route
      }
    }
  `,
}
