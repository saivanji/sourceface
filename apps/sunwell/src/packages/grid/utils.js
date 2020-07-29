export const calcLeft = (x, columns, containerWidth) =>
  containerWidth * (x / columns)

export const calcTop = (y, rowHeight) => y * rowHeight

export const calcPercentageX = (x, columns) => `${(x / columns) * 100}%`

export const toInfo = (cols, rows, containerWidth, rowHeight) => {
  // TODO: rename to boxWidth, boxHeight or similar
  const minWidth = containerWidth && calcLeft(1, cols, containerWidth)
  const minHeight = calcTop(1, rowHeight)

  const containerHeight = minHeight * rows

  return {
    cols,
    rows,
    minWidth,
    minHeight,
    containerWidth,
    containerHeight,
    rowHeight,
  }
}

export const toBoxCSS = ({ left, top, width, height }) => {
  return {
    width,
    height,
    transform: `translate(${left}px, ${top}px)`,
  }
}

export const toPercentageCSS = ({ w, h, x, y }, { cols, rowHeight }) => ({
  left: calcPercentageX(x, cols),
  top: calcTop(y, rowHeight),
  width: calcPercentageX(w, cols),
  height: calcTop(h, rowHeight),
})

export const toBounds = (
  { w, h, x, y },
  { cols, containerWidth, rowHeight }
) => {
  const left = containerWidth
    ? calcLeft(x, cols, containerWidth)
    : calcPercentageX(x, cols)
  const top = calcTop(y, rowHeight)

  const width = containerWidth
    ? calcLeft(w, cols, containerWidth)
    : calcPercentageX(w, cols)
  const height = calcTop(h, rowHeight)

  return {
    left,
    top,
    width,
    height,
  }
}
