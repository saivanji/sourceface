import { fromString, translate, compose, toCSS } from "transformation-matrix";

export const getTransform = node => {
  const { transform } = window.getComputedStyle(node);

  return transform !== "none" ? fromString(transform) : translate(0, 0);
};

export const addTranslate = (matrix, x, y) =>
  toCSS(compose(matrix, translate(x, y)));

export const getStyles = (node, names) => {
  let result = {};

  for (let name of names) {
    result[name] = node.style[name];
  }

  return result;
};

export const setStyles = (node, data) => {
  for (let name of Object.keys(data)) {
    node.style[name] = data[name];
  }
};
