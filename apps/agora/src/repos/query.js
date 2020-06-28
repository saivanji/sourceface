export const byId = async (queryId, pg) => pg.one(sql.byId, [queryId])

export const all = async pg => pg.manyOrNone(sql.all)

const sql = {
  byId: `
    SELECT * FROM queries
    WHERE id = $1
  `,
  all: `
    SELECT * FROM queries
  `,
}
