export const byId = (commandId, pg) => pg.one(sql.byId, [commandId])
export const all = pg => pg.manyOrNone(sql.all)
export const staleByCommandIds = (commandIds, pg) =>
  pg.manyOrNone(sql.staleByCommandIds, [commandIds])

const sql = {
  byId: `
    SELECT * FROM commands
    WHERE id = $1
  `,
  all: `
    SELECT * FROM commands
  `,
  staleByCommandIds: `
    SELECT c.*, sc.command_id FROM commands AS c
    LEFT JOIN stale_commands AS sc ON (sc.stale_id = c.id) 
    WHERE sc.command_id IN ($1:csv)
  `,
}
