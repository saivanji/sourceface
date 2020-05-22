export const variant = (prop, mapping, fn) => props => fn(mapping[props[prop]])
