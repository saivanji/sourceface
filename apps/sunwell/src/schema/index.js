import { createClient, dedupExchange, fetchExchange } from "urql"
import { introspection } from "@sourceface/schema"
import { cacheExchange } from "@urql/exchange-graphcache"
import { populateExchange } from "@urql/exchange-populate"
import * as optimistic from "./optimistic"
import * as updates from "./updates"

const endpoint = "http://localhost:5001/graphql"

export default createClient({
  url: endpoint,
  maskTypename: true,
  exchanges: [
    dedupExchange,
    populateExchange({
      schema: introspection,
    }),
    cacheExchange({
      schema: introspection,
      optimistic,
      updates: {
        Mutation: updates,
      },
    }),
    fetchExchange,
  ],
})
