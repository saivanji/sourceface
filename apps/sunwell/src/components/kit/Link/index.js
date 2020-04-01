import React from "react"

export default ({ children }) => (
  <button className="focus:outline-none focus:shadow-gray-outline rounded font-semibold">
    {children}
  </button>
)
