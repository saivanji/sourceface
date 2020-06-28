export const byId = async (commandId, pg) => pg.one(sql.byId, [commandId])

export const all = async pg => pg.manyOrNone(sql.all)

const sql = {
  byId: `
    SELECT * FROM commands
    WHERE id = $1
  `,
  all: `
    SELECT * FROM commands
  `,
}
