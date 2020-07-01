import { useState, useCallback } from "react"

export default initialState => {
  const [state, setState] = useState(initialState)
  const enable = useCallback(() => setState(true), [])
  const disable = useCallback(() => setState(false), [])

  return [state, enable, disable]
}
