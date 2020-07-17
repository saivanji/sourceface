export const calcLeft = (x, columns, containerWidth) =>
  containerWidth * (x / columns);

export const calcTop = (y, rowHeight) => y * rowHeight;

export const calcPercentageX = (x, columns) => `${(x / columns) * 100}%`;

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

export const toBoxCSS = (
  { w, h, x, y },
  { cols, containerWidth, rowHeight }
) => {
  const top = calcTop(y, rowHeight);
  const height = calcTop(h, rowHeight);

  if (!containerWidth) {
    return {
      left: calcPercentageX(x, cols),
      width: calcPercentageX(w, cols),
      top,
      height
    };
  }

  const left = calcLeft(x, cols, containerWidth);
  const width = calcLeft(w, cols, containerWidth);

  return {
    transform: `translate(${left}px, ${top}px)`,
    width,
    height
  };
};
