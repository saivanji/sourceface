import React from "react"
import cx from "classnames"

export default ({ children, className }) => (
  <button
    className={cx(
      "focus:outline-none focus:shadow-gray-outline rounded font-semibold",
      className
    )}
  >
    {children}
  </button>
)
