// TODO: rename to scalars.js
import { GraphQLDateTime } from "graphql-iso-date"
import { GraphQLJSON, GraphQLJSONObject } from "graphql-type-json"

export default {
  DateTime: GraphQLDateTime,
  JSON: GraphQLJSON,
  JSONObject: GraphQLJSONObject,
}
