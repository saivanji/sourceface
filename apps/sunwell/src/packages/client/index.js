import React from "react"
import {
  Provider,
  createClient,
  dedupExchange,
  fetchExchange,
  useQuery,
  useMutation,
} from "urql"
import { devtoolsExchange } from "@urql/devtools"
import { cacheExchange } from "@urql/exchange-graphcache"
import { populateExchange } from "@urql/exchange-populate"
import { introspection } from "@sourceface/schema"
import deferrableExchange from "./deferrable"
import * as optimistic from "./optimistic"
import * as updates from "./updates"
import * as mutations from "./mutations"

const endpoint = "http://localhost:5001/graphql"

// TODO: move to schema/client package? so we can reuse schema client logic by other clients(mobile app)
// TODO: import mutations definitions
const client = createClient({
  url: endpoint,
  maskTypename: true,
  exchanges: [
    deferrableExchange,
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

export function ClientProvider({ children }) {
  return <Provider value={client}>{children}</Provider>
}

/**
 * Re-exporting useQuery and useMutation hooks for the convenience.
 */
export { mutations, useQuery, useMutation }
