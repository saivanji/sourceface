import DataLoader from "dataloader"
import { loadReferences, compare } from "utils/config"
import * as actionRepo from "repos/action"
import * as commandRepo from "repos/command"
import * as layoutRepo from "repos/layout"
import * as moduleRepo from "repos/module"
import * as pageRepo from "repos/page"

export default (pg) => {
  const layout = new DataLoader((ids) => layoutRepo.listByIds(ids, pg))
  const modulesByPage = new DataLoaderHasMany(
    (ids) => moduleRepo.listByPageIds(ids, pg),
    "pageId"
  )
  const layoutsByModule = new DataLoaderHasMany(
    (ids) => layoutRepo.listByModuleIds(ids, pg),
    "moduleId"
  )
  const actionsByModule = new DataLoaderHasMany(
    (ids) => actionRepo.listByModuleIds(ids, pg),
    "moduleId"
  )
  const trailByPage = new DataLoaderHasMany(
    (ids) => pageRepo.trailByPageIds(ids, pg),
    "pageId"
  )
  const staleByCommand = new DataLoaderHasMany(
    (ids) => commandRepo.staleByCommandIds(ids, pg),
    "commandId"
  )
  const commandsByActionConfig = new DataLoaderHasMany(
    loadReferences((ids) => commandRepo.listByIds(ids, pg), "command"),
    compare
  )
  const pagesByActionConfig = new DataLoaderHasMany(
    loadReferences((ids) => pageRepo.listByIds(ids, pg), "page"),
    compare
  )

  return {
    layout,
    actionsByModule,
    layoutsByModule,
    modulesByPage,
    trailByPage,
    staleByCommand,
    commandsByActionConfig,
    pagesByActionConfig,
  }
}

class DataLoaderHasMany extends DataLoader {
  constructor(fn, key, options) {
    super(async (ids) => {
      const items = await fn(ids)
      return ids.map((id, i) =>
        items.filter((item) =>
          typeof key === "string" ? item[key] === id : key(item, id, i)
        )
      )
    }, options)
  }
}

class DataLoaderHasOne extends DataLoader {
  constructor(fn, key, options) {
    super(async (ids) => {
      const items = await fn(ids)
      return ids.map((id) => items.find((item) => item[key] === id))
    }, options)
  }
}
