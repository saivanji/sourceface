import React from "react"
import cx from "classnames"
import * as stock from "packages/modules"
import { Identifier, useContainer } from "packages/toolkit"
import Grid from "./Grid"
import styles from "./index.scss"
import { createLayer } from "./utils"

export default function Modules({ layout, modules, ...props }) {
  const layer = layout && createLayer(layout, modules)
  const isLoaded = !!layout

  return !isLoaded ? "Loading..." : <Frame layer={layer} {...props} />
}

function Frame({
  layer,
  isEditing,
  selectedId,
  onChange,
  onModuleClick,
  onConfigChange,
}) {
  /**
   * Passing down event and previous layer.
   */
  const handleChange = event => onChange(event, layer)
  const components = {
    Frame,
  }
  const { readState, getScope } = useContainer()

  return (
    <Grid
      units={layer.units}
      isEditable={isEditing}
      onChange={handleChange}
      renderItem={module => {
        const isSelected = isEditing && selectedId === module.id
        const Component = stock.dict[module.type].Root
        const scope = getScope(module.id)
        const state = readState(module.id)

        return (
          <Identifier key={module.id} id={module.id}>
            <div
              onClick={e => {
                if (onModuleClick) {
                  /**
                   * Propagating click events in order to be able to click on nested module
                   */
                  e.stopPropagation()
                  onModuleClick(module.id)
                }
              }}
              className={cx(
                styles.module,
                isEditing && styles.editing,
                isSelected && styles.selected
              )}
            >
              <Component
                config={module.config}
                state={state}
                local={scope.local}
                layers={module.layers}
                components={components}
                isEditing={isEditing}
                onConfigChange={onConfigChange}
              />
            </div>
          </Identifier>
        )
      }}
    />
  )
}
