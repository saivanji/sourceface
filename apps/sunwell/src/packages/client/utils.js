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

/**
 * Finds pageId by given layoutId. Since layouts are not distributed
 * across multiple pages it's safe to assume that layoutId belongs only
 * to a found pageId.
 */
// Most likely still need to have pageId additionally to path
// Do we need to return pageId or path?
export const findPageIdByLayout = (layoutId, cache) => {
  return cache.inspectFields("Query").reduce((result, x) => {
    if (x.fieldName !== "page" || result) {
      return result
    }

    const pageLink = cache.resolve("Query", "page", x.arguments)
    const moduleLinks = cache.resolve(pageLink, "modules")

    if (
      layoutInPage(layoutId, pageLink, cache) ||
      layoutInModules(layoutId, moduleLinks, cache)
    ) {
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

export const layoutInModules = (layoutId, moduleLinks, cache) =>
  moduleLinks.reduce((result, moduleLink) => {
    return (
      result ||
      cache.resolve(moduleLink, "layouts").reduce((result, layoutLink) => {
        const moduleLayoutId = cache.resolve(layoutLink, "id")

        if (moduleLayoutId !== layoutId || result) {
          return result
        }

        return moduleLayoutId
      }, null)
    )
  }, null)

export const layoutInPage = (layoutId, pageLink, cache) =>
  cache.resolve(cache.resolve(pageLink, "layout"), "id") === layoutId
