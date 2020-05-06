import { makeExecutableSchema } from "graphql-tools"
import { mergeAll } from "utils/index"
import baseDef from "./base/schema.graphql"
import baseResolvers from "./base/resolvers"
import userDef from "./user/schema.graphql"
import userResolvers from "./user/resolvers"
import * as userDirectives from "./user/directives"
import roleDef from "./role/schema.graphql"
import roleResolvers from "./role/resolvers"
import * as roleDirectives from "./role/directives"

export default makeExecutableSchema({
  typeDefs: [baseDef, userDef, roleDef],
  resolvers: mergeAll(baseResolvers, userResolvers, roleResolvers),
  schemaDirectives: {
    ...userDirectives,
    ...roleDirectives,
  },
})
