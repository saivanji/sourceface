// TODO: causes `urql-exchange-graphcache.js:11 Invalid undefined: The field at ...` error.
// Either need to return full module as a result(since we use populate exchange and don't know what fields are requested), or
// figure out why populate exchange requires so many fields.
export default ({ moduleId, key, value }, cache) => {
  const __typename = "Module"

  return {
    __typename,
    id: moduleId,
    config: {
      ...cache.resolve({ __typename, id: moduleId }, "config"),
      [key]: value,
    },
  }
}
