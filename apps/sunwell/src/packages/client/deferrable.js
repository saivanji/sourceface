import { tap, pipe, filter, map, merge, share } from "wonka"
import { makeOperation } from "@urql/core"
import * as optimistic from "./optimistic"
import * as updates from "./updates"

// TODO: mutations needs to be deferred need to have @defer directive
export default ({ client, forward }) => {
  return ($ops) => {
    return merge([
      pipe(
        share($ops),
        filter(shouldDefer),
        map((op) => {
          console.log(op)
          // How to access `cache` instance here? Since I need to maintain the logic of cache
          // updates applied in graphcache exchange.
          return {
            operation: addCacheOutcome(op, "hit"),
            data: {
              createAction: optimistic.createAction(op.variables),
              __typename: "Mutation",
            },
          }
        })
      ),
      pipe(
        $ops,
        tap(console.log),
        filter(shouldNotDefer),
        forward,
        tap(console.log)
      ),
    ])
  }
}

const shouldDefer = (op) => op.variables?.deferrable
const shouldNotDefer = (op) => !op.variables?.deferrable

// prevent graphql server request
// get result from optimistic update
// apply cache updater

const addCacheOutcome = (operation, outcome) => ({
  ...operation,
  context: {
    ...operation.context,
    meta: {
      ...operation.context.meta,
      cacheOutcome: outcome,
    },
  },
})
