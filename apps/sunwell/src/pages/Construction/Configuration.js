import React, { createContext, useMemo, useCallback } from "react"
import { useMutation } from "urql"
import * as kit from "packages/kit"
import Form, { populateField } from "./Form"
import * as schema from "./schema"

export const context = createContext({})

export default function Configuration({ module, component: Component }) {
  const [, updateModule] = useMutation(schema.updateModule)
  const onSave = useCallback(
    (key, value) => updateModule({ moduleId: module.id, key, value }),
    [module.id]
  )

  const components = useMemo(
    () => ({
      Form,
      Input: populateField(kit.Input, onSave),
      Select: populateField(kit.Select, onSave),
      Label: kit.Label,
      Row: kit.Row,
    }),
    [onSave]
  )

  return (
    <context.Provider value={module.config}>
      <Component
        key={module.id}
        config={module.config}
        components={components}
      />
    </context.Provider>
  )
}
