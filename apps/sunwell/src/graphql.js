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
        updateModulesPositions: ({ positions }, cache) => {
          // TODO: might need to get all fields of the module dynamically
          const query = "query { modules { id, position { w, h, x, y } } }"
          const { modules } = cache.readQuery({ query })

          return modules.map(module => {
            const { x, y, w, h } = positions.find(item => item.id === module.id)

            return {
              ...module,
              position: { __typename: "ModulePosition", x, y, w, h },
            }
          })
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
