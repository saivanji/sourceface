const toPercents = n => `${n * 100}%`;

export const calcX = (leftOffset, columns, containerWidth) =>
  Math.floor(leftOffset / (containerWidth / columns));

export const calcY = (topOffset, rowHeight) =>
  Math.floor(topOffset / rowHeight);

export const calcPercentageX = (x, columns) => toPercents(x / columns);

export const calcPixelX = (x, columns, containerWidth) =>
  containerWidth * (x / columns);

export const calcPixelY = (y, rowHeight) => y * rowHeight;

export const biggest = (a, b) => (a < b ? b : a);

export const smallest = (a, b) => !console.log(a, b) && (a < b ? a : b);

export const range = (value, min, max) => smallest(biggest(value, min), max);
