import { useRef, useReducer, useEffect } from "react"

export const useItems = (items, page, search) => {
  const [{ isLoading, ...state }, dispatch] = useReducer(reducer, {
    isLoading: false,
    error: null,
  })
  const loading = useLoading(isLoading, page, search)

  const isFunc = typeof items === "function"

  useEffect(() => {
    if (!isFunc) {
      return
    }

    let canceled = false
    const safeDispatch = (...args) => !canceled && dispatch(...args)

    const result = items(page, search)

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
  }, [isFunc, items, page, search])

  return !isFunc
    ? { data: items }
    : {
        ...state,
        ...loading,
      }
}

const useLoading = (isLoading, page, search) => {
  const ref = useRef({})

  useEffect(() => {
    ref.current = { page, search }
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
