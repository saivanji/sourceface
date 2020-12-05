import { SORTABLE_INNER, SORTABLE_OUTER } from "packages/grid"
import { useEditor } from "packages/factory"
import { sanitizePosition, createUpdates } from "./utils"

export const useChangeGrid = (parentId) => {
  const { createModule, select, updateModules } = useEditor()

  // TODO: handle "leave" event
  return (event) => {
    /**
     * Update layout when items are sorted, resized or put on
     * a layout.
     */
    if (
      ["sort", "resize"].includes(event.name) ||
      (event.name === "enter" && event.sourceType === SORTABLE_INNER)
    ) {
      updateModules(createUpdates(parentId, event.layout))
      return
    }

    /**
     * Create new module from the stock.
     */
    if (event.name === "enter" && event.sourceType === SORTABLE_OUTER) {
      const { moduleType } = event.custom
      const position = sanitizePosition(event.layout.outer)
      const moduleId = createModule(parentId, moduleType, position)

      select(moduleId)

      return
    }
  }
}
