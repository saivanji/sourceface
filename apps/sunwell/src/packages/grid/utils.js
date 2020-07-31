export const biggest = (a, b) => (a < b ? b : a)
export const smallest = (a, b) => (a < b ? a : b)

export const range = (value, min, max) => smallest(biggest(value, min), max)

export const calcLeft = (x, columns, containerWidth) =>
  containerWidth * (x / columns)

export const calcTop = (y, rowHeight) => y * rowHeight

export const calcPercentageLeft = (x, columns) => `${(x / columns) * 100}%`

export const toItem = (id, layout) => ({ id, ...layout[id] })

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
  left: calcPercentageLeft(x, cols),
  top: calcTop(y, rowHeight),
  width: calcPercentageLeft(w, cols),
  height: calcTop(h, rowHeight),
})

export const toBounds = (
  { w, h, x, y },
  { cols, containerWidth, rowHeight }
) => {
  const left = containerWidth
    ? calcLeft(x, cols, containerWidth)
    : calcPercentageLeft(x, cols)
  const top = calcTop(y, rowHeight)

  const width = containerWidth
    ? calcLeft(w, cols, containerWidth)
    : calcPercentageLeft(w, cols)
  const height = calcTop(h, rowHeight)

  return {
    left,
    top,
    width,
    height,
  }
}
