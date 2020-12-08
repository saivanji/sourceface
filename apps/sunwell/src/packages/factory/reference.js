import { path } from "ramda"
import { client } from "packages/client"

export const getReference = (type, field, data) => {
  const found = data[mapping[type]].find((r) => r.field === field)

  return found?.one || found?.many
}

export const mapping = {
  pages: "pagesRefs",
  operations: "operationsRefs",
  modules: "modulesRefs",
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
