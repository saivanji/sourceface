import { pick, keys } from "ramda"

// TODO: consider moving that logic somewhere since it's might be reused in mobile app?
export const populateLayout = (layout, modules) => {
  let result = { id: layout.id, positions: {} }

  for (let moduleId of keys(layout.positions)) {
    const module = modules.find((x) => x.id === moduleId)

    /**
     * Ignoring data inconsistency in case module was not found.
     */
    if (!module) {
      continue
    }

    result.positions[moduleId] = {
      ...layout.positions[moduleId],
      data: {
        ...module,
        layouts: module.layouts.map((layout) =>
          populateLayout(layout, modules)
        ),
      },
    }
  }

  return result
}

export const sanitizePosition = pick(["w", "h", "x", "y"])
