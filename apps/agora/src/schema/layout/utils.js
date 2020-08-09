export const createPositions = layouts =>
  layouts.reduce(
    (acc, layout) => [
      ...acc,
      ...layout.positions.map(({ id, ...position }) => ({
        id,
        position,
        layout_id: layout.layoutId,
      })),
    ],
    []
  )

export const populateLayouts = (layouts, positions) =>
  layouts.map(layout => ({
    ...layout,
    positions: positions.filter(position => position.layout_id === layout.id),
  }))
