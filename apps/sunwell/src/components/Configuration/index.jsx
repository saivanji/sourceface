import React from "react"
import { useMutation, mutations } from "packages/client"
import { Input } from "@sourceface/components"
import * as factory from "packages/factory"

export default function Configuration({ module, onModuleRemove }) {
  const [, removeModule] = useMutation(mutations.removeModule)

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
      <factory.Configuration key={module.id} module={module} />
      <button
        type="button"
        onClick={async () => {
          if (window.confirm()) {
            await removeModule({ moduleId: module.id })
            onModuleRemove()
          }
        }}
      >
        Remove
      </button>
    </>
  )
}
