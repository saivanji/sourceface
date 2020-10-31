import React from "react"
import { Input } from "@sourceface/components"
import * as factory from "packages/factory"

export default function Configuration({
  module,
  onRemove,
  onActionCreate,
  onActionConfigChange,
  onActionRemove,
}) {
  // TODO: do we need to move mutations inside factory?

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          paddingBottom: 16,
          marginBottom: 16,
          borderBottom: "1px solid #ccc",
        }}
      >
        <Input size="compact" placeholder="Module name" value={module.name} />
        <span>{module.type}</span>
      </div>
      <factory.Configuration
        key={module.id}
        module={module}
        onActionConfigChange={onActionConfigChange}
        onActionCreate={onActionCreate}
        onActionRemove={onActionRemove}
      />
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
    </>
  )
}
