import { makeExecutableSchema } from "graphql-tools"
import { printedSDL } from "@sourceface/schema"
import { mergeResolvers } from "utils/index"
import * as resolvers from "./resolvers"

export default makeExecutableSchema({
  typeDefs: printedSDL,
  resolvers: mergeResolvers(resolvers),
  // schemaDirectives: directives,
})

// TODO: handle errors. For example, when something is not found on postgres side - throw corresponding error
