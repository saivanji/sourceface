import React from "react"
import { Input } from "@sourceface/components"
import { Configuration, useEditor } from "packages/factory"
import { Section, Option } from "packages/toolkit"

export default function () {
  const { selected: module, select, renameModule, removeModule } = useEditor()

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
        <Input
          size="compact"
          placeholder="Module name"
          onChange={(e) => renameModule(module.id, e.target.value)}
          value={module.name}
        />
        <div>
          <span>{module.type}</span>
          <button
            type="button"
            onClick={async () => {
              if (window.confirm()) {
                select(null)
                removeModule(module.id)
              }
            }}
          >
            x
          </button>
        </div>
      </div>
      <Configuration key={module.id} module={module}>
        <Section title="Mounting">
          <Option name="@mount" label="Data" actionsOnly />
        </Section>
      </Configuration>
    </>
  )
}
