import React from "react"
import * as stock from "packages/modules"
import View from "./View"
//
export default function ConfigurationContainer({ module, onUpdate, onRemove }) {
  const Component = stock.dict[module.type].Configuration

  return !module ? (
    "Loading..."
  ) : (
    <View onRemove={onRemove}>
      <Component
        key={module.id}
        config={module.config}
        onConfigChange={onUpdate}
      />
    </View>
  )
}
