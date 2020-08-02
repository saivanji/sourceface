import { useCallback } from "react"

export default (...callbacks) => {
  return useCallback((transfer, action) => {
    return callbacks.reduce((acc, cb) => {
      const prevTransfer = { ...transfer, ...acc }

      return cb(prevTransfer, action) || prevTransfer
    }, {})
  }, callbacks)
}
