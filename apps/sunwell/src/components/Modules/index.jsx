import React from "react"
import cx from "classnames"
import * as stock from "packages/modules"
import { Container, Identifier } from "packages/toolkit"
import Grid from "./Grid"
import styles from "./index.scss"
import { createLayout } from "./utils"

export default function Modules({
  layout: rawLayout,
  queries,
  modules,
  isEditing,
  selectedId,
  onChange,
  onModuleClick,
  onConfigChange,
}) {
  const layout = createLayout(rawLayout.id, modules, rawLayout.positions)

  /**
   * Passing down event and previous layout.
   */
  const handleChange = event => onChange(event, layout)
  const components = {
    Modules,
  }

  return (
    <Container queries={queries} modules={modules} stock={stock.dict}>
      <Grid
        positions={layout.positions}
        isEditable={isEditing}
        onChange={handleChange}
        renderItem={module => {
          const isSelected = isEditing && selectedId === module.id
          const Component = stock.dict[module.type].Root

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
                  layouts={module.layouts}
                  components={components}
                  isEditing={isEditing}
                  onConfigChange={onConfigChange}
                />
              </div>
            </Identifier>
          )
        }}
      />
    </Container>
  )
}
