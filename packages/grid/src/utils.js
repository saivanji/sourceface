export const calcX = (leftOffset, columns, containerWidth) =>
  Math.floor(leftOffset / (containerWidth / columns));

export const calcY = (topOffset, rowHeight) =>
  Math.floor(topOffset / rowHeight);

export const calcXCSSPercentage = (x, columns) => toPercentsCSS(x / columns);

export const calcXCSS = (x, columns, containerWidth) =>
  containerWidth * (x / columns);

export const calcYCSS = (y, rowHeight) => y * rowHeight;

const toPercentsCSS = n => `${n * 100}%`;
