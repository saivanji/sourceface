import { graphql } from "graphql"
import schema from "../../src/schema"

export default async (query, variables) => {
  const res = await graphql(schema, query, null, { pg: global.pg }, variables)

  if (res.errors) throw res.errors

  return res
}
