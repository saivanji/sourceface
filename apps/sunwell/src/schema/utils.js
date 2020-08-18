export const findPageIdByModule = (moduleId, cache) => {
  return cache.inspectFields("Query").reduce((result, x) => {
    if (x.fieldName !== "page" || result) {
      return result
    }

    const moduleIds = cache
      .resolve(cache.resolve("Query", "page", x.arguments), "modules")
      .map(x => cache.resolve(x, "id"))

    if (moduleIds.includes(moduleId)) {
      return x.arguments.pageId
    }

    return result
  }, null)
}

export const findPageIdByLayout = (layoutId, cache) => {
  return cache.inspectFields("Query").reduce((result, x) => {
    if (x.fieldName !== "page" || result) {
      return result
    }

    const currentLayoutId = cache.resolve(
      cache.resolve(cache.resolve("Query", "page", x.arguments), "layout"),
      "id"
    )

    if (currentLayoutId === layoutId) {
      return x.arguments.pageId
    }

    return result
  }, null)
}
