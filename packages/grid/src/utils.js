const toPercents = n => `${n * 100}%`;

export const biggest = (a, b) => (a < b ? b : a);

export const smallest = (a, b) => (a < b ? a : b);

export const range = (value, min, max) => smallest(biggest(value, min), max);

export const calcPercentageX = (x, columns) => toPercents(x / columns);

export const calcLeft = (x, columns, containerWidth) =>
  containerWidth * (x / columns);

export const calcTop = (y, rowHeight) => y * rowHeight;

export const toInfo = (cols, rows, containerWidth, rowHeight) => {
  const minWidth = containerWidth && calcLeft(1, cols, containerWidth);
  const minHeight = calcTop(1, rowHeight);

  const containerHeight = minHeight * rows;

  return {
    cols,
    rows,
    minWidth,
    minHeight,
    containerWidth,
    containerHeight,
    rowHeight
  };
};

export const toBounds = (
  { w, h, x, y },
  { cols, containerWidth, rowHeight }
) => {
  const left = containerWidth
    ? calcLeft(x, cols, containerWidth)
    : calcPercentageX(x, cols);
  const top = calcTop(y, rowHeight);

  const width = containerWidth
    ? calcLeft(w, cols, containerWidth)
    : calcPercentageX(w, cols);
  const height = calcTop(h, rowHeight);

  return {
    left,
    top,
    width,
    height
  };
};

export const toUnits = (
  { left, top, width, height },
  { minWidth, minHeight },
  defaultTo
) => {
  const w = width ? Math.round(width / minWidth) : defaultTo.w;
  const h = height ? Math.round(height / minHeight) : defaultTo.h;
  const x = Math.round(left / minWidth);
  const y = Math.round(top / minHeight);

  return { x, y, w, h };
};

export const unitsEqual = (left, right) =>
  left.w === right.w &&
  left.h === right.h &&
  left.x === right.x &&
  left.y === right.y;

export const resize = (
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
      range(initialOffset + delta, 0, initialOffset + initialSize - minSize)
    ];
  }

  return [
    range(initialSize + delta, minSize, limit - initialOffset),
    initialOffset
  ];
};

export const drag = (
  deltaX,
  deltaY,
  { left, top, width, height },
  { containerWidth, containerHeight }
) => {
  return {
    left: range(left + deltaX, 0, containerWidth - width),
    top: range(top + deltaY, 0, containerHeight - height)
  };
};
