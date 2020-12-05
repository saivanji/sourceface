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
// import { populateExchange } from "@urql/exchange-populate"
import { introspection } from "@sourceface/schema"
import * as updates from "./updates"

const endpoint = "http://localhost:5001/graphql"

// TODO: move to schema/client package? so we can reuse schema client logic by other clients(mobile app)
// TODO: import mutations definitions
const client = createClient({
  url: endpoint,
  maskTypename: true,
  exchanges: [
    devtoolsExchange,
    dedupExchange,
    // TODO: commenting since it's causing "Found no flat schema type when one was expected" error
    // populateExchange({
    //   schema: introspection,
    // }),
    cacheExchange({
      schema: introspection,
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
export { useQuery, useMutation, client }
