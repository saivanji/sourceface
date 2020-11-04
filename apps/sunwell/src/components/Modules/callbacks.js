import { mapObjIndexed } from "ramda"
import { SORTABLE_INNER, SORTABLE_OUTER } from "packages/grid"
import { useEditor } from "packages/factory"
import { sanitizePosition } from "./utils"

// TODO: make sure there is nothing left from old layout naming conventions.
// TODO: most likely keep grill logic here and call lower level functions from editor here.
// TODO: why called prevLayout?
export const useChangeGrid = (prevLayout) => {
  const { createModule, updateLayout, select } = useEditor()

  // TODO: handle "leave" event
  return (event) => {
    /**
     * Renaming grill's "layout" to "positions" to avoid confusion between application layout
     * and "react-grill" layout.
     */
    const positions = event.layout

    /**
     * Update layout positions when items are sorted, resized or put on
     * a layout.
     */
    if (
      ["sort", "resize"].includes(event.name) ||
      (event.name === "enter" && event.sourceType === SORTABLE_INNER)
    ) {
      updateLayout(prevLayout.id, mapObjIndexed(sanitizePosition, positions))
      return
    }

    /**
     * Create new module from the stock.
     */
    if (event.name === "enter" && event.sourceType === SORTABLE_OUTER) {
      const { moduleType } = event.custom

      const moduleId = createModule(
        prevLayout.id,
        moduleType,
        sanitizePosition(positions.outer)
      )
      select(moduleId)

      return
    }
  }
}
