import { createClient, dedupExchange, fetchExchange } from "urql"
import { devtoolsExchange } from "@urql/devtools"
import { cacheExchange } from "@urql/exchange-graphcache"
import { populateExchange } from "@urql/exchange-populate"
import { introspection } from "@sourceface/schema"
import * as optimistic from "./optimistic"
import * as updates from "./updates"

const endpoint = "http://localhost:5001/graphql"

// TODO: move to schema/client package? so we can reuse schema client logic by other clients(mobile app)
// TODO: have `useSchema` hook to get mutations definitions`
export default createClient({
  url: endpoint,
  maskTypename: true,
  exchanges: [
    devtoolsExchange,
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
