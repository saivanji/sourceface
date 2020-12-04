import DataLoader from "dataloader"
import { load, compare } from "utils/relations"
import * as actionRepo from "repos/action"
import * as commandRepo from "repos/command"
import * as moduleRepo from "repos/module"
import * as pageRepo from "repos/page"

export default (pg) => {
  const modulesByPage = new DataLoaderHasMany(
    (ids) => moduleRepo.listByPageIds(ids, pg),
    "pageId"
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
  const commandsByRelations = new DataLoaderHasMany(
    load((ids) => commandRepo.listByIds(ids, pg), "commands"),
    compare
  )
  const pagesByRelations = new DataLoaderHasMany(
    load((ids) => pageRepo.listByIds(ids, pg), "pages"),
    compare
  )

  return {
    actionsByModule,
    modulesByPage,
    trailByPage,
    staleByCommand,
    commandsByRelations,
    pagesByRelations,
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
