export const findPageIdByModule = (moduleId, cache) => {
  return cache.inspectFields("Query").reduce((result, x) => {
    if (x.fieldName !== "page" || result) {
      return result
    }

    const pageLink = cache.resolve("Query", "page", x.arguments)
    const moduleIds = cache
      .resolve(pageLink, "modules")
      .map((x) => cache.resolve(x, "id"))

    if (moduleIds.includes(moduleId)) {
      return cache.resolve(pageLink, "id")
    }

    return result
  }, null)
}

export const findModuleIdByAction = (actionId, cache) => {
  return cache.inspectFields("Query").reduce((result, x) => {
    if (x.fieldName !== "page" || result) {
      return result
    }

    const pageLink = cache.resolve("Query", "page", x.arguments)

    return cache
      .resolve(pageLink, "modules")
      .reduce(
        (result, moduleLink) =>
          result ||
          (actionInModule(actionId, moduleLink, cache)
            ? cache.resolve(moduleLink, "id")
            : result),
        null
      )
  }, null)
}

export const actionInModule = (actionId, moduleLink, cache) =>
  cache
    .resolve(moduleLink, "actions")
    .some((actionLink) => cache.resolve(actionLink, "id") === actionId)
