import { useRef, useReducer, useEffect } from "react"

// TODO: in case of pagination, have variable to control current page but keep all loaded items in state
export const useItems = (items, search, page) => {
  const [{ isLoading, ...state }, dispatch] = useReducer(reducer, {
    isLoading: false,
    error: null,
  })
  const loading = useLoading(isLoading, search, page)

  const isFunc = typeof items === "function"

  useEffect(() => {
    if (!isFunc) {
      return
    }

    let canceled = false
    const safeDispatch = (...args) => !canceled && dispatch(...args)

    const result = items(search, page)

    if (result instanceof Promise) {
      safeDispatch({ type: "start" })

      result
        .then((data) => safeDispatch({ type: "finish", payload: data }))
        .catch((err) => safeDispatch({ type: "error", payload: err }))

      return () => {
        canceled = true
      }
    }

    safeDispatch({ type: "finish", payload: result })
  }, [isFunc, items, search, page])

  return !isFunc
    ? { data: items }
    : {
        ...state,
        ...loading,
      }
}

const useLoading = (isLoading, search, page) => {
  const ref = useRef({})

  useEffect(() => {
    ref.current = { search, page }
  })

  return {
    isPaging: ref.current.page !== page && isLoading,
    isSearching: ref.current.search !== search && isLoading,
  }
}

const reducer = (state, action) => {
  switch (action.type) {
    case "start":
      return {
        ...state,
        isLoading: true,
      }
    case "finish":
      return {
        data: action.payload,
        error: null,
        isLoading: false,
      }
    case "error":
      return {
        data: null,
        error: action.payload,
        isLoading: false,
      }
    default:
      return state
  }
}
