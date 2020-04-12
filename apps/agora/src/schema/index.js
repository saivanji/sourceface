import { makeExecutableSchema } from "graphql-tools"
import { mergeAll } from "utils/index"
import baseDef from "./base/schema.graphql"
import baseResolvers from "./base/resolvers"
import userDef from "./user/schema.graphql"
import userResolvers from "./user/resolvers"
import * as userDirectives from "./user/directives"

export default makeExecutableSchema({
  typeDefs: [baseDef, userDef],
  resolvers: mergeAll(baseResolvers, userResolvers),
  schemaDirectives: {
    ...userDirectives,
  },
})
