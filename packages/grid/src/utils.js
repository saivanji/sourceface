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
  { minWidth, minHeight, containerWidth, containerHeight }
) => {
  const w = Math.round(width / minWidth);
  const h = Math.round(height / minHeight);
  const x = Math.round(range(left, 0, containerWidth - width) / minWidth);
  const y = Math.round(range(top, 0, containerHeight - height) / minHeight);

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

export const drag = (deltaX, deltaY, { left, top }) => {
  return {
    left: left + deltaX,
    top: top + deltaY
  };
};

const countCollision = (source, target) => {
  const differenceX = target.x + target.w - (source.x + source.w);
  const differenceY = target.y + target.h - (source.y + source.h);

  const x = differenceX !== 1 && differenceX !== -1 ? 0 : differenceX;
  const y = differenceY !== 1 && differenceY !== -1 ? 0 : differenceY;

  return {
    x,
    y
  };
};

export const reorder = (id, item, layout) => {
  return { ...layout, [id]: item };

  // const update = (element, collision) => ({
  //   x: element.x + collision.x,
  //   y: element.y + collision.y
  // });

  // return Object.keys(layout).reduce((acc, key) => {
  //   const collision = countCollision(item, layout[key]);

  //   return {
  //     ...acc,
  //     [key]:
  //       key === id
  //         ? item
  //         : {
  //             ...item,
  //             ...update(layout[key], collision)
  //           }
  //   };
  // }, {});
};
