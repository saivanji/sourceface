import { useMemo } from "react"

export const useApply = (...input) => {
  const [firstFn, ...tailFns] = input.slice(0, -1).reverse()
  const args = input[input.length - 1]

  return useMemo(
    () => tailFns.reduce((acc, fn) => fn(acc), firstFn(...args)),
    args
  )
}
