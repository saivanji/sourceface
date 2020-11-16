import { makeExecutableSchema } from "graphql-tools"
import { values, mergeDeepLeft } from "ramda"
import { printedSDL } from "@sourceface/schema"
import * as resolvers from "./resolvers"

const mergeResolvers = (resolvers) =>
  values(resolvers).reduce((acc, item) => mergeDeepLeft(item, acc), {})

export default makeExecutableSchema({
  typeDefs: printedSDL,
  resolvers: mergeResolvers(resolvers),
  // schemaDirectives: directives,
})

// TODO: handle errors. For example, when something is not found on postgres side - throw corresponding error
