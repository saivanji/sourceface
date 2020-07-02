import React from "react"

export default ({ title, children }) => (
  <div>
    <div>
      <b>{title}</b>
    </div>
    {children}
  </div>
)
