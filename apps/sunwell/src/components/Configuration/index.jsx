import React, { useState } from "react"
import JSONView from "react-json-view"
import { Tabs } from "@sourceface/components"
import { useScope } from "packages/toolkit"
import * as stock from "packages/modules"

export default function ConfigurationContainer({ module, onUpdate, onRemove }) {
  const [selected, setSelected] = useState("configuration")
  const Component = stock.dict[module.type].Configuration

  return !module ? (
    "Loading..."
  ) : (
    <>
      <TabHead selected={selected} onSelect={setSelected} />
      <Tabs>
        {selected === "configuration" ? (
          <Base
            module={module}
            onUpdate={onUpdate}
            onRemove={onRemove}
            component={Component}
          />
        ) : (
          selected === "scope" && <Scope moduleId={module.id} />
        )}
      </Tabs>
    </>
  )
}

function TabHead({ selected, onSelect }) {
  return (
    <Tabs.Header>
      <Tabs.Tab
        onClick={() => onSelect("configuration")}
        isSelected={selected === "configuration"}
      >
        Configuration
      </Tabs.Tab>
      <Tabs.Tab
        onClick={() => onSelect("scope")}
        isSelected={selected === "scope"}
      >
        Scope
      </Tabs.Tab>
    </Tabs.Header>
  )
}

// TODO: why use "key"?
function Base({ module, onUpdate, onRemove, component: Component }) {
  return (
    <>
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

function Scope({ moduleId }) {
  const scope = useScope(moduleId)

  return (
    <JSONView
      src={scope}
      name={null}
      enableClipboard={false}
      displayObjectSize={false}
      displayDataTypes={false}
    />
  )
}

// TODO: should be no distincion from the input point of view between readable and writable. For the user everything is an expression
