import React, { useMemo } from "react"
import { Input, Select, Checkbox } from "@sourceface/components"
import * as stock from "packages/modules"
import * as form from "lib/form"
import View from "./View"

// TODO: implement api which will be passed down to Configuration and module component itself.
// will contain:
// 1. onConfigChange for setting configuration variable
// 2. config
// 3. Module specific
// - isEditing
//
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
    // TODO: get rid of ValuesProvider so default values will be passed to Form
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
