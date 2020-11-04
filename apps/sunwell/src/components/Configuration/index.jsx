import React from "react"
import { Input } from "@sourceface/components"
import { Configuration, useEditor } from "packages/factory"

export default function () {
  const { selected: module, select, removeModule } = useEditor()

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
      <Configuration key={module.id} module={module} />
      <button
        type="button"
        onClick={async () => {
          if (window.confirm()) {
            select(null)
            removeModule(module.id)
          }
        }}
      >
        Remove
      </button>
    </>
  )
}
