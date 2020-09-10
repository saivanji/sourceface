import React from "react"
import * as stock from "packages/modules"
import * as expression from "lib/expression"
import Grid from "./Grid"
import Module from "./Module"

export default function Modules({
  layout,
  isEditing,
  selectedId,
  onChange,
  onModuleClick,
}) {
  /**
   * Passing down event and previous layout.
   */
  const handleChange = event => onChange(event, layout)
  const components = {
    Modules,
  }

  return !layout ? (
    "Loading..."
  ) : (
    <Grid
      positions={layout.positions}
      isEditable={isEditing}
      onChange={handleChange}
      renderItem={module => (
        <Module
          key={module.id}
          isEditable={isEditing}
          isSelected={isEditing && selectedId === module.id}
          data={module}
          expression={expression}
          components={components}
          component={stock.dict[module.type].Root}
          onClick={onModuleClick}
        />
      )}
    />
  )
}
