import { createClient, dedupExchange, fetchExchange } from "urql"
import { cacheExchange } from "@urql/exchange-graphcache"
// import { populateExchange } from "@urql/exchange-populate"
import { keys } from "ramda"

const endpoint = "http://localhost:5001/graphql"

export default createClient({
  url: endpoint,
  exchanges: [
    dedupExchange,
    // TODO: will be available since graphql schema will be pushed as a separate package so we can import
    // populateExchange({}),
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
      updates: {
        Mutation: {
          addModule: (result, args, cache) => {
            cache.updateQuery({ query: "query { modules { id } }" }, data => {
              return {
                ...data,
                modules: [...data.modules, result.addModule],
              }
            })
          },
        },
      },
    }),
    fetchExchange,
  ],
})
