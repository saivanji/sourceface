import { GraphQLDateTime } from "graphql-iso-date"
import { GraphQLJSON, GraphQLJSONObject } from "graphql-type-json"
import GraphQLUUID from "graphql-type-uuid"

export default {
  DateTime: GraphQLDateTime,
  JSON: GraphQLJSON,
  JSONObject: GraphQLJSONObject,
  UUID: GraphQLUUID,
}
