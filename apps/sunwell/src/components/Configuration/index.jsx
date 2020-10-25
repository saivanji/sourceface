import React from "react"
import { Input } from "@sourceface/components"
import * as factory from "packages/factory"

export default function Configuration({
  module,
  onUpdate,
  onRemove,
  onActionCreate,
  onActionUpdate,
}) {
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
        <Input size="compact" placeholder="Module name" value="input5" />
        <span>{module.type}</span>
      </div>
      <factory.Configuration
        key={module.id}
        module={module}
        onConfigChange={onUpdate}
        onActionUpdate={onActionUpdate}
        onActionCreate={onActionCreate}
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
