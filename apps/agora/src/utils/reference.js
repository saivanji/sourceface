import { reduceBy, toPairs } from "ramda"

export const getField = (key) => `regexp_replace(${key}, '(.*)/(.*)', '\\1')`
export const getIndex = (key) => `regexp_replace(${key}, '(.*)/(.*)', '\\2')`

export const createFields = (ids, key, actionId, field) =>
  ids.map((id, i) => ({
    [key]: id,
    field: `${field}/${i}`,
    action_id: actionId,
  }))

export const transform = (items) =>
  toPairs(
    reduceBy(
      (acc, item) => {
        return {
          pages: concat(item.page, acc.pages),
          operations: concat(item.operation, acc.operations),
          modules: concat(item.module, acc.modules),
        }
      },
      {},
      (item) => item.field.split("/")[0],
      items
    )
  ).reduce((acc, [field, data]) => [...acc, { field, ...data }], [])

const concat = (entry, items = []) => (entry ? [...items, entry] : items)
