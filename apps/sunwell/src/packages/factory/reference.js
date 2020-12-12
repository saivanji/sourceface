import { path } from "ramda"
import { client } from "packages/client"

export const getReference = (type, field, action, multiple = false) => {
  const found = action.references.find((r) => r.field === field)?.[type] || []

  return multiple ? found : found[0]
}

export const identify = (sourceId, field) => `${sourceId}/${field}`
export const tear = (id) => id.split("/")

export const mapping = {
  pages: "pageIds",
  operations: "operationIds",
  modules: "moduleIds",
}

export const listReferences = (type, input) =>
  client
    .query(queries[type], input)
    .toPromise()
    .then(path(["data", type]))

const queries = {
  operations: `
    query($search: String, $limit: Int, $offset: Int) {
      operations(search: $search, limit: $limit, offset: $offset) {
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
