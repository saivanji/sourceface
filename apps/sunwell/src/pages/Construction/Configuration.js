import React, { createContext, useMemo, useCallback } from "react"
import { useMutation } from "urql"
import { Input, Select, Checkbox, Tabs } from "packages/kit"
import Form, { populateField } from "./Form"
import * as schema from "./schema"

export const context = createContext({})

export default function Configuration({ module, component: Component }) {
  const [, updateModule] = useMutation(schema.updateModule)
  const onSave = useCallback(
    // TODO: implement debouncing
    (key, value) => updateModule({ moduleId: module.id, key, value }),
    [module.id]
  )

  const components = useMemo(
    () => ({
      Form,
      Input: populateField(Input, onSave),
      Select: populateField(Select, onSave),
      Checkbox: populateField(Checkbox, onSave),
    }),
    [onSave]
  )

  // TODO: should tabs be in a different place?
  return (
    <context.Provider value={module.config}>
      <Tabs>
        <Tabs.Header>
          <Tabs.Tab isSelected>Configuration</Tabs.Tab>
          <Tabs.Tab>Scope</Tabs.Tab>
        </Tabs.Header>
        <Component
          key={module.id}
          config={module.config}
          components={components}
        />
      </Tabs>
    </context.Provider>
  )
}

// TODO: should be no distincion from the input point of view between readable and writable. For the user everything is an expression
