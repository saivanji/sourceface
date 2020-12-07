export const byId = (commandId, pg) => pg.one(sql.byId, [commandId])
export const list = (search, limit, offset, pg) =>
  pg.manyOrNone(sql.list, [search || "", limit, offset])
export const staleByCommandIds = (commandIds, pg) =>
  pg.manyOrNone(sql.staleByCommandIds, [commandIds])
export const listByIds = (commandIds, pg) =>
  pg.manyOrNone(sql.listByIds, [commandIds])

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
  listByIds: `
    SELECT * FROM operations WHERE id IN ($1:csv)
  `,
}
