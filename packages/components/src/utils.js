export const apply = (mapping, fn) => {
  let res = {}

  for (let key of Object.keys(mapping)) {
    res[key] = fn(mapping[key])
  }

  return res
}
