import { useEffect, useRef } from "react"
import { useParams as useRouterParams } from "react-router-dom"
import { useContainer, useParams } from "../packages/factory"

export default function Params() {
  const { page } = useContainer()
  const { path } = useRouterParams()
  const ref = useRef({ pageId: page.id, path })

  // TODO: inconsistency issue persists when cache of operation is expired?
  /**
   * Getting params from next path only after page fetched to avoid data inconsistency.
   */
  useEffect(() => {
    if (ref.current.pageId !== page.id) {
      ref.current.pageId = page.id

      /**
       * Considering path change only after next page is fetched.
       */
      if (ref.current.path !== path) {
        ref.current.path = path
      }
    }
  }, [page, path, ref])

  const nextPath =
    /**
     * When route path is changed and next page is not fetched yet - returning previous path.
     */
    ref.current.path !== path && ref.current.pageId === page.id
      ? ref.current.path
      : path

  return useParams("/" + nextPath)
}
