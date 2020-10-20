import DataLoader from "dataloader"
import * as actionRepo from "repos/action"
import * as commandRepo from "repos/command"
import * as layoutRepo from "repos/layout"
import * as positionRepo from "repos/position"
import * as moduleRepo from "repos/module"
import * as pageRepo from "repos/page"

export default (pg) => {
  const layout = new DataLoader((ids) => layoutRepo.listByIds(ids, pg))
  const position = new DataLoader((ids) => positionRepo.listByIds(ids, pg))
  const modulesByPage = new DataLoaderHasMany(
    (ids) => moduleRepo.listByPageIds(ids, pg),
    "pageId"
  )
  const positionsByLayout = new DataLoaderHasMany(
    (ids) => positionRepo.listByLayoutIds(ids, pg),
    "layoutId"
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

  return {
    layout,
    actionsByModule,
    layoutsByModule,
    position,
    positionsByLayout,
    modulesByPage,
    trailByPage,
    staleByCommand,
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
