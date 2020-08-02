export const biggest = (a, b) => (a < b ? b : a)
export const smallest = (a, b) => (a < b ? a : b)

export const range = (value, min, max) => smallest(biggest(value, min), max)

export const calcLeft = (x, columns, containerWidth) =>
  containerWidth * (x / columns)

export const calcTop = (y, rowHeight) => y * rowHeight

export const calcPercentageLeft = (x, columns) => `${(x / columns) * 100}%`

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

export const calcX = (left, w, { minWidth, cols }, round) =>
  range(round(left / minWidth), 0, cols - w)

export const calcY = (top, h, { minHeight, rows }, round) =>
  range(round(top / minHeight), 0, rows - h)

export const coordsEqual = (left, right) =>
  left.w === right.w &&
  left.h === right.h &&
  left.x === right.x &&
  left.y === right.y

export const toCoords = ({ left, top, width, height }, info) => {
  const { minWidth, minHeight } = info

  const w = Math.round(width / minWidth)
  const h = Math.round(height / minHeight)
  const x = calcX(left, w, info, Math.round)
  const y = calcY(top, h, info, Math.round)

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

export const without = (id, layout) => {
  let result = {}

  for (let key of Object.keys(layout)) {
    if (key === id) continue

    result[key] = layout[key]
  }

  return result
}

const collides = (source, target) =>
  source.x + source.w > target.x &&
  target.x + target.w > source.x &&
  source.y + source.h > target.y &&
  target.y + target.h > source.y

const collisionHeight = (source, target) => source.y + source.h - target.y

export const put = (id, anchor, layout) => {
  const keys = Object.keys({ ...layout, [id]: anchor })

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

export const cursor = (clientX, clientY, container) => ({
  left: clientX - container.left,
  top: clientY - container.top,
})
