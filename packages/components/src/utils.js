export const variant = (prop, mapping, fn) => props => fn(mapping[props[prop]])

export const variants = (mapping, fn) => {
  let res = {}

  for (let key of Object.keys(mapping)) {
    res[key] = fn(mapping[key])
  }

  return res
}
