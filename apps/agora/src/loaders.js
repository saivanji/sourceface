import DataLoader from "dataloader"
import * as actionRepo from "repos/action"
import * as pageRepo from "repos/page"
import * as operationRepo from "repos/command"
import * as moduleRepo from "repos/module"
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
    (ids) => operationRepo.staleByCommandIds(ids, pg),
    "commandId"
  )
  const referencesByAction = new DataLoaderHasMany(
    (ids) => referenceRepo.listByActionIds(ids, pg),
    "actionId"
  )
  const pagesByReference = new DataLoaderHasMany(
    (ids) => pageRepo.listByReferenceIds(ids, pg),
    compareRef
  )
  const operationsByReference = new DataLoaderHasMany(
    (ids) => operationRepo.listByReferenceIds(ids, pg),
    compareRef
  )
  const modulesByReference = new DataLoaderHasMany(
    (ids) => moduleRepo.listByReferenceIds(ids, pg),
    compareRef
  )

  return {
    actionsByModule,
    modulesByPage,
    trailByPage,
    staleByCommand,
    referencesByAction,
    pagesByReference,
    operationsByReference,
    modulesByReference,
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

const compareRef = (item, [actionId, field]) =>
  item.actionId === actionId && item.field === field
