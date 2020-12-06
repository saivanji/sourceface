import DataLoader from "dataloader"
import * as actionRepo from "repos/action"
import * as commandRepo from "repos/command"
import * as moduleRepo from "repos/module"
import * as pageRepo from "repos/page"
import * as referenceRepo from "repos/reference"

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
  const pagesReferencesByAction = new DataLoaderHasMany(
    (ids) => referenceRepo.listPagesByActionIds(ids, pg),
    "actionId"
  )
  const operationsReferencesByAction = new DataLoaderHasMany(
    (ids) => referenceRepo.listOperationsByActionIds(ids, pg),
    "actionId"
  )
  const modulesReferencesByAction = new DataLoaderHasMany(
    (ids) => referenceRepo.listModulesByActionIds(ids, pg),
    "actionId"
  )

  return {
    actionsByModule,
    modulesByPage,
    trailByPage,
    staleByCommand,
    pagesReferencesByAction,
    operationsReferencesByAction,
    modulesReferencesByAction,
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
