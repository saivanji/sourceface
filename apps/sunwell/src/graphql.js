import { createClient, dedupExchange, fetchExchange } from "urql"
import { cacheExchange } from "@urql/exchange-graphcache"

const endpoint = "http://localhost:5001/graphql"

export default createClient({
  url: endpoint,
  exchanges: [
    dedupExchange,
    cacheExchange({
      optimistic: {
        updateModule: ({ moduleId, key, value }, cache) => {
          const __typename = "Module"

          return {
            __typename,
            id: moduleId,
            config: {
              ...cache.resolve({ __typename, id: moduleId }, "config"),
              [key]: value,
            },
          }
        },
      },
    }),
    fetchExchange,
  ],
})
