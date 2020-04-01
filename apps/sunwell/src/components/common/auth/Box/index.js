import React from "react"

export default ({ children, title, description }) => (
  <div className="bg-white rounded p-8 shadow-md">
    <span className="block mb-1 text-2xl font-semibold text-gray-shade-110">
      {title}
    </span>
    <span className="block mb-6 text-gray-shade-50">{description}</span>
    {children}
  </div>
)
