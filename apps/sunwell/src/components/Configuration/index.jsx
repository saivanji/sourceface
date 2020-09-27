import React, { useState } from "react"
import JSONTree from "react-json-tree"
import { Tabs } from "@sourceface/components"
import { useScope } from "packages/toolkit"
import * as stock from "packages/modules"

export default function Configuration({
  selectedId,
  modules,
  onUpdate,
  onRemove,
}) {
  const [selected, setSelected] = useState("configuration")

  if (!modules) {
    return "Loading..."
  }

  // TODO: crash, when module is deleted(explore git history for the additional scope on how that was solved before)
  const module = modules.find(x => x.id === selectedId)
  const Component = stock.dict[module.type].Configuration

  return (
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
    <JSONTree
      hideRoot
      invertTheme
      data={scope}
      labelRenderer={path => (
        <strong>
          {path[0]}
          {path.length === 1 && path[0] === "custom" && (
            <button
              style={{ marginLeft: 10, cursor: "pointer" }}
              onClick={() => window.prompt("Enter path and value")}
            >
              +
            </button>
          )}
        </strong>
      )}
    />
  )
}

// TODO: should be no distincion from the input point of view between readable and writable. For the user everything is an expression
