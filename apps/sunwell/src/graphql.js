import gql from "graphql-tag"
import { propEq, keys } from "ramda"
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
        updatePositions: ({ positions }) => {
          return positions.map(position => ({
            __typename: "Position",
            ...position,
          }))
        },
      },
      updates: {
        Mutation: {
          createModule: (result, args, cache) => {
            const { layoutId } = args.position
            const layoutFragment = gql`
              fragment _ on Layout {
                id
                positions {
                  id
                  x
                  y
                  w
                  h
                }
              }
            `

            const layout = cache.readFragment(layoutFragment, { id: layoutId })

            cache.writeFragment(layoutFragment, {
              ...layout,
              positions: [...layout.positions, result.createModule.position],
            })
          },
          updatePositions: (result, args, cache) => {
            console.log(cache)
            const positions = args.positions.reduce(
              (acc, { id, layoutId }) => ({
                ...acc,
                [layoutId]: [
                  ...(acc[layoutId] || []),
                  result.updatePositions.find(propEq("id", id)),
                ],
              }),
              {}
            )

            const layoutIds = keys(positions)

            // layout of positions was not changed so no further update needed
            if (layoutIds.length === 1) return

            for (let layoutId of layoutIds) {
              const fragment = gql`
                fragment _ on Layout {
                  id
                  positions {
                    id
                    x
                    y
                    w
                    h
                  }
                }
              `

              cache.writeFragment(fragment, {
                id: layoutId,
                positions: positions[layoutId],
              })
            }
          },
        },
      },
    }),
    fetchExchange,
  ],
})
