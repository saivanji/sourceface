import React from "react"

export default ({ cond, children, component: Component, ...props }) => {
  return !cond ? children : <Component children={children} {...props} />
}
