import React from "react"
import { Input } from "@sourceface/components"
import * as stock from "packages/modules"

export default function Configuration({
  selectedId,
  modules,
  onUpdate,
  onRemove,
}) {
  if (!modules) {
    return "Loading..."
  }

  // TODO: crash, when module is deleted(explore git history for the additional scope on how that was solved before)
  const module = modules.find((x) => x.id === selectedId)
  const Component = stock.dict[module.type].Configuration

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
      <Component
        key={module.id}
        config={module.config}
        onConfigChange={onUpdate}
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
