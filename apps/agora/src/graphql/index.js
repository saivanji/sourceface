import { makeExecutableSchema } from "graphql-tools"
import baseDef from "./base/schema.graphql"
import userDef from "./user/schema.graphql"
import userResolvers from "./user/resolvers"

export default makeExecutableSchema({
  typeDefs: [baseDef, userDef],
  resolvers: userResolvers,
})
