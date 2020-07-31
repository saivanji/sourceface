import { useMemo, useState, useCallback } from "react"

export const useApply = (...input) => {
  const [firstFn, ...tailFns] = input.slice(0, -1).reverse()
  const args = input[input.length - 1]

  return useMemo(
    () => tailFns.reduce((acc, fn) => fn(acc), firstFn(...args)),
    args
  )
}

export const useBooleanState = initialState => {
  const [state, setState] = useState(initialState)
  const enable = useCallback(() => setState(true), [])
  const disable = useCallback(() => setState(false), [])

  return [state, enable, disable]
}
