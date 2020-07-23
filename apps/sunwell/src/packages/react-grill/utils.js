export const biggest = (a, b) => (a < b ? b : a)

export const smallest = (a, b) => (a < b ? a : b)

export const range = (value, min, max) => smallest(biggest(value, min), max)

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

export const coordsEqual = (left, right) =>
  left.w === right.w &&
  left.h === right.h &&
  left.x === right.x &&
  left.y === right.y

export const toCoords = (
  { left, top, width, height },
  { minWidth, minHeight, containerWidth, containerHeight }
) => {
  const w = Math.round(width / minWidth)
  const h = Math.round(height / minHeight)
  const x = Math.round(range(left, 0, containerWidth - width) / minWidth)
  const y = Math.round(range(top, 0, containerHeight - height) / minHeight)

  return { x, y, w, h }
}

export const drag = (deltaX, deltaY, { left, top, width, height }) => ({
  left: left + deltaX,
  top: top + deltaY,
  width,
  height,
})

export const resizeSide = (
  isNorthWest,
  delta,
  initialOffset,
  initialSize,
  minSize,
  limit
) => {
  if (isNorthWest) {
    return [
      range(initialSize - delta, minSize, initialSize + initialOffset),
      range(initialOffset + delta, 0, initialOffset + initialSize - minSize),
    ]
  }

  return [
    range(initialSize + delta, minSize, limit - initialOffset),
    initialOffset,
  ]
}

export const resize = (
  angle,
  deltaX,
  deltaY,
  { left, top, width, height },
  { minWidth, minHeight, containerWidth, containerHeight }
) => {
  const isNorth = angle === "nw" || angle === "ne"
  const isWest = angle === "nw" || angle === "sw"

  const [nextWidth, nextLeft] = resizeSide(
    isWest,
    deltaX,
    left,
    width,
    minWidth,
    containerWidth
  )
  const [nextHeight, nextTop] = resizeSide(
    isNorth,
    deltaY,
    top,
    height,
    minHeight,
    containerHeight
  )

  return { left: nextLeft, top: nextTop, width: nextWidth, height: nextHeight }
}

const collides = (source, target) =>
  source.x + source.w > target.x &&
  target.x + target.w > source.x &&
  source.y + source.h > target.y &&
  target.y + target.h > source.y

const collisionHeight = (source, target) => source.y + source.h - target.y

export const put = (id, anchor, layout) => {
  const keys = Object.keys(layout)

  const offset = keys.reduce((acc, key) => {
    const target = layout[key]
    if (key === id || !collides(anchor, target)) return acc

    const height = collisionHeight(anchor, target)
    return acc > height ? acc : height
  }, 0)

  if (!offset) return { ...layout, [id]: anchor }

  return keys.reduce((acc, key) => {
    if (key === id) {
      return { ...acc, [key]: anchor }
    }

    const target = layout[key]

    if (!collides(anchor, target)) {
      return acc
    }

    return put(
      key,
      {
        ...target,
        y: target.y + offset,
      },
      acc
    )
  }, layout)
}
