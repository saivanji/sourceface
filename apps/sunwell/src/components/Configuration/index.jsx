import React, { useMemo } from "react"
import { Input, Select, Checkbox } from "packages/kit"
import * as stock from "packages/modules"
import * as form from "lib/form"
import View from "./View"

export default function ConfigurationContainer({ module, onUpdate, onRemove }) {
  const Component = stock.dict[module.type].Configuration

  const components = useMemo(() => {
    const wrap = Component => form.populateField(Component, onUpdate)

    return {
      Form: form.SetupProvider,
      Input: wrap(Input),
      Select: wrap(Select),
      Checkbox: wrap(Checkbox),
    }
  }, [module.id])

  return !module ? (
    "Loading..."
  ) : (
    <View onRemove={onRemove}>
      <form.ValuesProvider values={module.config}>
        <Component
          key={module.id}
          config={module.config}
          components={components}
        />
      </form.ValuesProvider>
    </View>
  )
}
