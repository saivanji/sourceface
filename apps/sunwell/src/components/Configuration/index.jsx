import React from "react"
import { Tabs } from "packages/kit"

export default function Configuration({ children, onRemove }) {
  return (
    <Tabs>
      <Tabs.Header>
        <Tabs.Tab isSelected>Configuration</Tabs.Tab>
        <Tabs.Tab>Scope</Tabs.Tab>
      </Tabs.Header>
      {children}
      <button
        type="button"
        onClick={() => {
          if (window.confirm()) {
            onRemove()
          }
        }}
      >
        Remove
      </button>
    </Tabs>
  )
}

// TODO: should be no distincion from the input point of view between readable and writable. For the user everything is an expression
