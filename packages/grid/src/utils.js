export const calcX = (leftOffset, columns, containerWidth) =>
  Math.floor(leftOffset / (containerWidth / columns));

export const calcY = (topOffset, rowHeight) =>
  Math.floor(topOffset / rowHeight);

export const calcPercentageX = (x, columns) => toPercents(x / columns);

export const calcPixelX = (x, columns, containerWidth) =>
  containerWidth * (x / columns);

export const calcPixelY = (y, rowHeight) => y * rowHeight;

const toPercents = n => `${n * 100}%`;
