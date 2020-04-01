import React from "react"

export default ({ label }) => (
  <label className="cursor-pointer">
    <input type="checkbox" />
    {label && <span className="ml-2 select-none">{label}</span>}
  </label>
)
