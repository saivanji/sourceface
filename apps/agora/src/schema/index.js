import { makeExecutableSchema } from "graphql-tools"
import { printedSDL } from "@sourceface/schema"
import { mergeAll } from "utils/index"
import baseResolvers from "./base/resolvers"
import sourceResolvers from "./source/resolvers"
import moduleResolvers from "./module/resolvers"
import layoutResolvers from "./layout/resolvers"
import pageResolvers from "./page/resolvers"
// import userDef from "./user/schema.graphql"
// import userResolvers from "./user/resolvers"
// import * as userDirectives from "./user/directives"

export default makeExecutableSchema({
  typeDefs: printedSDL,
  resolvers: mergeAll(
    baseResolvers,
    sourceResolvers,
    moduleResolvers,
    layoutResolvers,
    pageResolvers
    // userResolvers
  ),
  // schemaDirectives: {
  //   // ...userDirectives,
  // },
})

// TODO: handle errors. For example, when something is not found on postgres side - throw corresponding error
