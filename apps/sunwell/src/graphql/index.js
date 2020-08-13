import { createClient, dedupExchange, fetchExchange } from "urql"
import { cacheExchange } from "@urql/exchange-graphcache"
// import { populateExchange } from "@urql/exchange-populate"
import * as optimistic from "./optimistic"
import * as updates from "./updates"

const endpoint = "http://localhost:5001/graphql"

export default createClient({
  url: endpoint,
  maskTypename: true,
  exchanges: [
    dedupExchange,
    // TODO: will be available since graphql schema will be pushed as a separate package so we can import
    // populateExchange({}),
    cacheExchange({
      optimistic,
      updates: {
        Mutation: updates,
      },
    }),
    fetchExchange,
  ],
})
