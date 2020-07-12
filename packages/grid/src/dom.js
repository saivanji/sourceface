export const getTransform = node => {
  const { m41: translateX, m42: translateY } = new window.DOMMatrix(
    window.getComputedStyle(node).transform
  );

  return { translateX, translateY };
};
