import React from "react"

export default ({ items, ...props }) => (
  <select {...props}>
    {items.map((item, i) => {
      return (
        <option key={i} value={item.value}>
          {item.title}
        </option>
      )
    })}
  </select>
)
