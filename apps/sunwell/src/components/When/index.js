import React from "react"

export default ({ cond, children, component: Component, ...props }) => {
  const element = typeof children === "function" ? children() : children

  return !cond ? element : <Component children={children} {...props} />
}
