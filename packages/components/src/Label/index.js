import React from "react"

export default ({ children, title, helperMessage }) => (
  <label>
    <span className="font-bold mb-2 flex text-gray-shade-110">{title}</span>
    {children}
    {helperMessage && (
      <span className="block mt-1 text-gray text-xs">{helperMessage}</span>
    )}
  </label>
)
