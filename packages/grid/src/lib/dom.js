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
