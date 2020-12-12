import { asCsvValues } from "../postgres"
import { getField, getIndex } from "../utils/reference"

export const byId = (operationId, pg) => pg.one(sql.byId, [operationId])
export const list = (search, limit, offset, pg) =>
  pg.manyOrNone(sql.list, [search || "", limit, offset])
export const staleByCommandIds = (operationIds, pg) =>
  pg.manyOrNone(sql.staleByCommandIds, [operationIds])
export const listByIds = (operationIds, pg) =>
  pg.manyOrNone(sql.listByIds, [operationIds])
export const listByReferenceIds = (refIds, pg) =>
  pg.manyOrNone(sql.listByReferenceIds, [asCsvValues(refIds)])

const sql = {
  byId: `
    SELECT * FROM operations
    WHERE id = $1
  `,
  list: `
    SELECT * FROM operations
    WHERE LOWER(name) LIKE LOWER('%$1:value%')
    LIMIT $2 OFFSET $3
  `,
  staleByCommandIds: `
    SELECT c.*, sc.command_id FROM operations AS c
    LEFT JOIN stale_operations AS sc ON (sc.stale_id = c.id) 
    WHERE sc.command_id IN ($1:csv)
  `,
  listByReferenceIds: `
    SELECT o.*, r.action_id, ${getField("r.field")} AS field
    FROM "references" AS r
    INNER JOIN operations AS o ON (o.id = r.operation_id)
    WHERE (r.action_id, ${getField("r.field")}) IN ($1:raw)
    ORDER BY ${getIndex("r.field")} ASC
  `,
  listByIds: `
    SELECT * FROM operations WHERE id IN ($1:csv)
  `,
}
