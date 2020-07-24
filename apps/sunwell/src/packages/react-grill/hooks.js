import { useMemo, useCallback } from "react"

export const useApply = (...input) => {
  const [firstFn, ...tailFns] = input.slice(0, -1).reverse()
  const args = input[input.length - 1]

  return useMemo(
    () => tailFns.reduce((acc, fn) => fn(acc), firstFn(...args)),
    args
  )
}

export const useLifecycle = (lifecycleFn, fn, deps) => {
  return useCallback(
    (...args) => {
      lifecycleFn && lifecycleFn()
      fn(...args)
    },
    lifecycleFn ? [...deps, lifecycleFn] : deps
  )
}
