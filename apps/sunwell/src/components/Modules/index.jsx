import React, { createContext, useContext } from "react"
import * as stock from "packages/modules"
import * as expression from "lib/expression"
import Grid from "./Grid"
import Module from "./Module"

const context = createContext({})

export default function Modules({ layout }) {
  const { isEditing, selectedId, onChange, onModuleClick } = useContext(context)
  // TODO: consider passing whole layout, instead of id for getting calculated changed
  // positions
  const handleChange = event => onChange(event, layout.id)
  const components = {
    Modules,
  }

  return (
    <Grid
      layout={layout.positions}
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
