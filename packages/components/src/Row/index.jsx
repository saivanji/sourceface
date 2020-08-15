import React from "react"

// TODO: have FormField component instead, which contains Row + Label?
export default function Row({ children }) {
  return (
    <div>
      {children}
      <br />
    </div>
  )
}
