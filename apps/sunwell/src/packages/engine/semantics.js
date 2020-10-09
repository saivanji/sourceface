// TODO: instead of parent, have more specific name such as structure, member and so on?

export const Definition = {
  params: (parent, param) => ({
    ...parent,
    params: [...parent.params, param],
  }),
  param: (parent, identifier) => identifier.value,
}

export const Call = {
  callee: (parent, callee) => ({ ...parent, callee }),
  args: (parent, arg) => ({ ...parent, args: [...parent.args, arg] }),
  key: (parent, identifier) => ({
    ...parent,
    type: "key",
    name: identifier.value,
  }),
  value: (parent, value) => ({ ...parent, value }),
  shorthand: (parent, value) => ({
    ...parent,
    type: "key",
    name: value.name.slice(-1),
    value,
  }),
  spread: (parent, value) => ({ ...parent, type: "spread", value }),
}

export const Member = {
  prefix: (parent, punctuator, options) => ({
    ...parent,
    name: options.namespaces[punctuator.value].name,
  }),
  node: (parent, identifier) => ({
    ...parent,
    name: [...parent.name, identifier.value],
  }),
}

export const Literal = {
  numeric: (parent, item) => ({ value: +item.value }),
  string: (parent, item) => ({ value: item.value.replace(/'|"/g, "") }),
  boolean: (parent, item) => ({
    value: { true: true, false: false }[item.value],
  }),
}
