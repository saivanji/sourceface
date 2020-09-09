import React, { createContext, useContext } from "react"
import * as stock from "packages/modules"
import * as expression from "lib/expression"
import Grid from "./Grid"
import Module from "./Module"

const context = createContext({})

export default function Modules({ layout }) {
  // TODO: move all in props as optional props
  const { isEditing, selectedId, onChange, onModuleClick } = useContext(context)
  /**
   * Passing down event and previous layout.
   */
  const handleChange = event => onChange(event, layout)
  const components = {
    Modules,
  }

  return (
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

Modules.Provider = ({
  children,
  isEditing,
  selectedId,
  onChange,
  onModuleClick,
}) => {
  return (
    <context.Provider
      value={{ isEditing, selectedId, onChange, onModuleClick }}
    >
      {children}
    </context.Provider>
  )
}
