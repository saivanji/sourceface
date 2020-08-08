import { createClient, dedupExchange, fetchExchange } from "urql"
import { cacheExchange } from "@urql/exchange-graphcache"
// import { populateExchange } from "@urql/exchange-populate"

const endpoint = "http://localhost:5001/graphql"

export default createClient({
  url: endpoint,
  maskTypename: true,
  exchanges: [
    dedupExchange,
    // TODO: will be available since graphql schema will be pushed as a separate package so we can import
    // populateExchange({}),
    cacheExchange({
      keys: {
        ModulePosition: () => null,
      },
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
        updateLayout: ({ layoutId, positions }) => {
          return {
            __typename: "Layout",
            id: layoutId,
            positions: positions.map(position => ({
              __typename: "Position",
              ...position,
            })),
          }
        },
      },
      updates: {
        Mutation: {
          createModule: (result, args, cache) => {
            const query = "query { modules { id } }"
            cache.updateQuery({ query }, data => {
              return {
                ...data,
                modules: [...data.modules, result.createModule],
              }
            })
          },
        },
      },
    }),
    fetchExchange,
  ],
})
