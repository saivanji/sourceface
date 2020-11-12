import DataLoader from "dataloader"
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
  const pagesByAction = new DataLoaderHasMany(
    (ids) => pageRepo.listByActionIds(ids, pg),
    "actionId"
  )
  const commandsByAction = new DataLoaderHasMany(
    (ids) => commandRepo.listByActionIds(ids, pg),
    "actionId"
  )

  return {
    layout,
    actionsByModule,
    layoutsByModule,
    modulesByPage,
    trailByPage,
    staleByCommand,
    pagesByAction,
    commandsByAction,
  }
}

class DataLoaderHasMany extends DataLoader {
  constructor(fn, key, options) {
    super(async (ids) => {
      const items = await fn(ids)
      return ids.map((id) => items.filter((item) => item[key] === id))
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
