import React from "react"

export default ({ children, title, isRequired = false }) => (
  <label>
    <span className="font-bold mb-2 flex text-gray-shade-110">
      {title}
      <span className="text-xs ml-1">{isRequired && "*"}</span>
    </span>
    {children}
  </label>
)
