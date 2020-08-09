import DataLoader from "dataloader"
import * as layoutRepo from "repos/layout"
import * as positionRepo from "repos/position"
import * as moduleRepo from "repos/module"

export default pg => {
  const layout = new DataLoader(ids => layoutRepo.listByIds(ids, pg))
  const position = new DataLoader(ids => positionRepo.listByIds(ids, pg))
  const moduleByPosition = new DataLoaderHasOne(
    ids => moduleRepo.listByPositionIds(ids, pg),
    "positionId"
  )
  const positionsByLayout = new DataLoaderHasMany(
    ids => positionRepo.listByLayoutIds(ids, pg),
    "layoutId"
  )

  return { layout, position, moduleByPosition, positionsByLayout }
}

class DataLoaderHasMany extends DataLoader {
  constructor(fn, key, options) {
    super(async ids => {
      const items = await fn(ids)
      return ids.map(id => items.filter(item => item[key] === id))
    }, options)
  }
}

class DataLoaderHasOne extends DataLoader {
  constructor(fn, key, options) {
    super(async ids => {
      const items = await fn(ids)
      return ids.map(id => items.find(item => item[key] === id))
    }, options)
  }
}
