import { makeExecutableSchema } from "graphql-tools"
import { mergeAll } from "utils/index"
import baseDef from "./base/schema.graphql"
import sourceDef from "./source/schema.graphql"
import baseResolvers from "./base/resolvers"
import sourceResolvers from "./source/resolvers"
// import userDef from "./user/schema.graphql"
// import userResolvers from "./user/resolvers"
// import * as userDirectives from "./user/directives"

export default makeExecutableSchema({
  typeDefs: [
    baseDef,
    sourceDef,
    // userDef
  ],
  resolvers: mergeAll(
    baseResolvers,
    sourceResolvers
    // userResolvers
  ),
  // schemaDirectives: {
  //   // ...userDirectives,
  // },
})

// TODO: handle errors. For example, when something is not found on postgres side - throw corresponding error
